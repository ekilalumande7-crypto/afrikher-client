import crypto from 'crypto';

const FIDEPAY_BASE_URL = process.env.FIDEPAY_API_URL || 'https://admin.fide-pay.com/api/merchant';

interface FidepayTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

interface FidepayPaymentResponse {
  status: string;
  transaction_id: string;
  checkout_url?: string;
  payment_url?: string;
  [key: string]: any;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getFidepayToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const response = await fetch(`${FIDEPAY_BASE_URL}/access-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ public_key: process.env.FIDEPAY_API_KEY }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get FIDEPAY token: ${response.statusText}`);
  }

  const data = (await response.json()) as FidepayTokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };

  return data.access_token;
}

export async function createPayment(params: {
  amount: number;
  currency: string;
  transaction_id: string;
  description: string;
  ipn_url: string;
  success_url: string;
  cancel_url: string;
}): Promise<FidepayPaymentResponse> {
  const token = await getFidepayToken();
  const response = await fetch(`${FIDEPAY_BASE_URL}/make-payment`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`FIDEPAY payment failed: ${response.statusText}`);
  }

  return response.json() as Promise<FidepayPaymentResponse>;
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.FIDEPAY_WEBHOOK_SECRET || '';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
}

export interface WebhookPayload {
  status: string;
  transaction_id: string;
  amount: number;
  currency: string;
  description: string;
  custom_data?: Record<string, any>;
  [key: string]: any;
}

export function parseWebhookPayload(rawBody: string): WebhookPayload {
  try {
    return JSON.parse(rawBody) as WebhookPayload;
  } catch {
    throw new Error('Invalid webhook payload');
  }
}
