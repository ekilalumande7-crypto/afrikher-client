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

// Cached token + config
let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedConfig: { config: FidepayConfig; expiresAt: number } | null = null;

// ── Get Supabase service client ──
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key);
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
      .in('key', ['fidepay_public_key', 'fidepay_secret_key', 'fidepay_mode']);

    const configMap: Record<string, string> = {};
    if (data) {
      for (const row of data) {
        configMap[row.key] = row.value;
      }
    }

    const config: FidepayConfig = {
      publicKey: configMap['fidepay_public_key'] || process.env.FIDEPAY_API_KEY || '',
      secretKey: configMap['fidepay_secret_key'] || process.env.FIDEPAY_WEBHOOK_SECRET || '',
      mode: (configMap['fidepay_mode'] as 'live' | 'test') || 'test',
    };

    cachedConfig = { config, expiresAt: Date.now() + 5 * 60 * 1000 };
    return config;
  } catch (err) {
    console.error('Failed to read FIDEPAY config from DB, using env vars:', err);
    return {
      publicKey: process.env.FIDEPAY_API_KEY || '',
      secretKey: process.env.FIDEPAY_WEBHOOK_SECRET || '',
      mode: 'test',
    };
  }
}

// ── Get base URL based on mode ──
function getBaseUrl(mode: 'live' | 'test'): string {
  return mode === 'live'
    ? 'https://admin.fide-pay.com/api/merchant'
    : 'https://admin.fide-pay.com/api/merchant/sandbox';
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

  const baseUrl = getBaseUrl(config.mode);

  const response = await fetch(`${baseUrl}/access-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_key: config.publicKey }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`FIDEPAY token error (${response.status}): ${errorText}`);
  }

  const data = (await response.json()) as FidepayTokenResponse;

  // Cache token for 55 min (tokens typically last 60 min)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + 55 * 60 * 1000,
  };

  return data.access_token;
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
  const baseUrl = getBaseUrl(config.mode);
  const token = await getFidepayToken();

  // FIDEPAY make-payment endpoint
  // Live: /api/merchant/make-payment
  // Sandbox: /api/sandbox/make-payment
  const paymentUrl = config.mode === 'live'
    ? 'https://admin.fide-pay.com/api/merchant/make-payment'
    : 'https://admin.fide-pay.com/api/sandbox/make-payment';

  const response = await fetch(paymentUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      transaction_id: params.transaction_id,
      description: params.description,
      ipn_url: params.ipn_url,
      callback_url: params.success_url,
      customer_name: params.customer_name || '',
      customer_email: params.customer_email || '',
    }),
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
