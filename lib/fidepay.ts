import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ══════════════════════════════════════════════
// FIDEPAY API INTEGRATION
// Reads keys from Supabase site_config (admin-configurable)
// Falls back to environment variables if not found in DB
// ══════════════════════════════════════════════

// API doc: https://www.fide-pay.com/api-documentation
// Live base: https://admin.fide-pay.com/api/merchant
// Sandbox base: https://admin.fide-pay.com/api/merchant/sandbox

interface FidepayConfig {
  publicKey: string;
  secretKey: string;
  mode: 'live' | 'test';
  accessTokenUrl: string;
  makePaymentUrl: string;
}

interface FidepayTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

interface FidepayPaymentResponse {
  status: string;
  payment_url?: string;
  transaction_id?: string;
  [key: string]: any;
}

export type FidepayTransactionType = 'subscription' | 'magazine' | 'order';
export type FidepayTransactionStatus = 'pending' | 'done';

interface TransactionRecord {
  id: string;
  transaction_id: string;
  user_id: string;
  type: FidepayTransactionType;
  item_id: string | null;
  order_id: string | null;
  amount: number;
  status: FidepayTransactionStatus;
  created_at: string;
}

// Cached token + config
let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedConfig: { config: FidepayConfig; expiresAt: number } | null = null;

// ── Get Supabase service client ──
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
}

// ── Generate transaction ID (12 chars alphanumeric) ──
export function generateTransactionId(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.randomBytes(12);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
}

// ── Create transaction record in pending state ──
export async function createPendingTransaction(params: {
  transactionId: string;
  userId: string;
  type: FidepayTransactionType;
  itemId?: string | null;
  orderId?: string | null;
  amount: number;
}): Promise<TransactionRecord> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      transaction_id: params.transactionId,
      user_id: params.userId,
      type: params.type,
      item_id: params.itemId || null,
      order_id: params.orderId || null,
      amount: params.amount,
      status: 'pending',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create pending transaction: ${error?.message || 'unknown error'}`);
  }

  return data as TransactionRecord;
}

// ── Read transaction record by external transaction ID ──
export async function getTransactionById(transactionId: string): Promise<TransactionRecord | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('transaction_id', transactionId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read transaction: ${error.message}`);
  }

  return (data as TransactionRecord | null) ?? null;
}

// ── Mark transaction as done ──
export async function markTransactionDone(transactionId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('transactions')
    .update({ status: 'done' })
    .eq('transaction_id', transactionId);

  if (error) {
    throw new Error(`Failed to update transaction status: ${error.message}`);
  }
}

// ── Sync transaction ID if FIDEPAY returns a different one ──
export async function syncTransactionId(oldId: string, newId: string): Promise<void> {
  if (oldId === newId) return;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('transactions')
    .update({ transaction_id: newId })
    .eq('transaction_id', oldId);

  if (error) {
    throw new Error(`Failed to sync transaction ID: ${error.message}`);
  }
}

// ── Read FIDEPAY config from site_config table ──
export async function getFidepayConfig(): Promise<FidepayConfig> {
  // Use cache for 5 minutes to avoid hammering DB
  if (cachedConfig && cachedConfig.expiresAt > Date.now()) {
    return cachedConfig.config;
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from('site_config')
      .select('key, value')
      .in('key', [
        'fidepay_public_key', 'fidepay_secret_key', 'fidepay_mode',
        'fidepay_access_token_url', 'fidepay_make_payment_url'
      ]);

    const configMap: Record<string, string> = {};
    if (data) {
      for (const row of data) {
        configMap[row.key] = row.value;
      }
    }

    const mode = (configMap['fidepay_mode'] as 'live' | 'test') || 'test';
    const defaultAccessTokenUrl = mode === 'live'
      ? 'https://admin.fide-pay.com/api/merchant/access-token'
      : 'https://admin.fide-pay.com/api/merchant/sandbox/access-token';
    const defaultMakePaymentUrl = mode === 'live'
      ? 'https://admin.fide-pay.com/api/merchant/make-payment'
      : 'https://admin.fide-pay.com/api/sandbox/make-payment';

    const config: FidepayConfig = {
      publicKey: configMap['fidepay_public_key'] || process.env.FIDEPAY_API_KEY || '',
      secretKey: configMap['fidepay_secret_key'] || process.env.FIDEPAY_WEBHOOK_SECRET || '',
      mode,
      accessTokenUrl: configMap['fidepay_access_token_url'] || defaultAccessTokenUrl,
      makePaymentUrl: configMap['fidepay_make_payment_url'] || defaultMakePaymentUrl,
    };

    cachedConfig = { config, expiresAt: Date.now() + 5 * 60 * 1000 };
    return config;
  } catch (err) {
    console.error('Failed to read FIDEPAY config from DB, using env vars:', err);
    return {
      publicKey: process.env.FIDEPAY_API_KEY || '',
      secretKey: process.env.FIDEPAY_WEBHOOK_SECRET || '',
      mode: 'test',
      accessTokenUrl: 'https://admin.fide-pay.com/api/merchant/sandbox/access-token',
      makePaymentUrl: 'https://admin.fide-pay.com/api/sandbox/make-payment',
    };
  }
}

// ── Get access token ──
export async function getFidepayToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const config = await getFidepayConfig();

  if (!config.publicKey) {
    throw new Error('FIDEPAY public_key is not configured. Go to Admin > Parametres > Paiements to set it up.');
  }

  const response = await fetch(config.accessTokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_key: config.publicKey }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FIDEPAY token error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  // FIDEPAY returns { status: "success", token: "...", expires_in: "..." }
  const accessToken = data.token || data.access_token || data.data?.token || data.data?.access_token;

  if (!accessToken) {
    throw new Error(`FIDEPAY returned no token. Keys: ${Object.keys(data).join(', ')}`);
  }

  // Cache token for 55 min (tokens typically last 60 min)
  cachedToken = {
    token: accessToken,
    expiresAt: Date.now() + 55 * 60 * 1000,
  };

  return accessToken;
}

// ── Create payment ──
export async function createPayment(params: {
  amount: number;
  currency: string;
  transaction_id: string;
  description: string;
  ipn_url: string;
  success_url: string;
  cancel_url: string;
  customer_name?: string;
  customer_email?: string;
}): Promise<FidepayPaymentResponse> {
  const config = await getFidepayConfig();
  const token = await getFidepayToken();

  const paymentBody = {
    amount: params.amount,
    currency: params.currency,
    transaction_id: params.transaction_id,
    description: params.description,
    ipn_url: params.ipn_url,
    callback_url: params.success_url,
    return_url: params.success_url,
    cancel_url: params.cancel_url,
    customer_name: params.customer_name || '',
    customer_email: params.customer_email || '',
  };

  console.log('[FIDEPAY] Creating payment:', JSON.stringify(paymentBody));
  console.log('[FIDEPAY] Using URL:', config.makePaymentUrl);

  const response = await fetch(config.makePaymentUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FIDEPAY payment error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<FidepayPaymentResponse>;
}

// ── Verify webhook signature (IPN) ──
// FIDEPAY docs: HMAC-SHA256 of (transaction_id + total_amount) with secret_key
export async function verifyWebhookSignature(
  transactionId: string,
  totalAmount: string,
  signature: string
): Promise<boolean> {
  const config = await getFidepayConfig();

  if (!config.secretKey) {
    console.warn('FIDEPAY secret_key not configured, skipping signature verification');
    return true; // Allow in dev if no secret configured
  }

  const payload = `${transactionId}${totalAmount}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.secretKey)
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
}

// ── Parse webhook query params (FIDEPAY sends GET with query params) ──
export interface WebhookData {
  status: string;
  signature: string;
  transaction_id: string;
  total_amount: string;
  charges: string;
  amount: string;
  currency: string;
}

export function parseWebhookParams(url: URL): WebhookData {
  return {
    status: url.searchParams.get('status') || '',
    signature: url.searchParams.get('signature') || '',
    transaction_id: url.searchParams.get('data[transaction_id]') || url.searchParams.get('transaction_id') || '',
    total_amount: url.searchParams.get('data[total_amount]') || url.searchParams.get('total_amount') || '',
    charges: url.searchParams.get('data[charges]') || '0',
    amount: url.searchParams.get('data[amount]') || '0',
    currency: url.searchParams.get('data[currency]') || 'EUR',
  };
}

// ── Clear cached config (call after admin updates keys) ──
export function clearFidepayCache(): void {
  cachedToken = null;
  cachedConfig = null;
}
