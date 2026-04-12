import { getServiceRoleClient } from '@/lib/supabase';

const BREVO_API_URL = 'https://api.brevo.com/v3';

// Cache for Brevo config loaded from site_config
let brevoConfigCache: { apiKey: string; senderEmail: string; senderName: string; listId: number } | null = null;
let brevoConfigCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Load Brevo configuration from site_config (priority) with .env fallback.
 */
async function getBrevoConfig(): Promise<{
  apiKey: string;
  senderEmail: string;
  senderName: string;
  listId: number;
}> {
  const now = Date.now();
  if (brevoConfigCache && now - brevoConfigCacheTime < CACHE_TTL) {
    return brevoConfigCache;
  }

  let apiKey = process.env.BREVO_API_KEY || '';
  let senderEmail = ''; // Will be resolved below — must be a verified Brevo sender
  let senderName = 'AFRIKHER';
  let listId = 2;

  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from('site_config')
      .select('key, value')
      .in('key', ['brevo_api_key', 'brevo_sender_email', 'brevo_sender_name', 'brevo_newsletter_list_id']);

    if (data) {
      const configMap: Record<string, string> = {};
      for (const row of data) {
        configMap[row.key] = row.value || '';
      }
      // site_config takes priority over .env — trim to remove accidental whitespace
      if (configMap['brevo_api_key']) apiKey = configMap['brevo_api_key'].trim();
      if (configMap['brevo_sender_email']) senderEmail = configMap['brevo_sender_email'].trim();
      if (configMap['brevo_sender_name']) senderName = configMap['brevo_sender_name'].trim();
      if (configMap['brevo_newsletter_list_id']) listId = parseInt(configMap['brevo_newsletter_list_id'].trim(), 10) || 2;
    }
  } catch (err) {
    console.error('Failed to load Brevo config from site_config, using .env fallback:', err);
  }

  // If no sender email configured, auto-detect from Brevo verified senders
  if (!senderEmail && apiKey) {
    try {
      const sendersRes = await fetch(`${BREVO_API_URL}/senders`, {
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      });
      if (sendersRes.ok) {
        const sendersData = await sendersRes.json();
        const activeSender = sendersData.senders?.find((s: { active: boolean }) => s.active);
        if (activeSender) {
          senderEmail = activeSender.email;
          if (!senderName || senderName === 'AFRIKHER') {
            senderName = activeSender.name || 'AFRIKHER';
          }
          console.log(`[BREVO] Auto-detected verified sender: ${senderEmail} (${senderName})`);
        }
      }
    } catch {
      // Ignore — will fall back to default below
    }
  }

  // Ultimate fallback
  if (!senderEmail) {
    senderEmail = 'noreply@afrikher.com';
    console.warn('[BREVO] No verified sender found — using fallback noreply@afrikher.com (may fail if domain not verified)');
  }

  brevoConfigCache = { apiKey, senderEmail, senderName, listId };
  brevoConfigCacheTime = now;

  return brevoConfigCache;
}

export async function brevoRequest(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<Response> {
  const config = await getBrevoConfig();

  const response = await fetch(`${BREVO_API_URL}${endpoint}`, {
    method,
    headers: {
      'api-key': config.apiKey,
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  return response;
}

export async function addContact(
  email: string,
  name?: string,
  listIds?: number[]
): Promise<Response> {
  const config = await getBrevoConfig();
  return brevoRequest('/contacts', 'POST', {
    email,
    listIds: listIds || [config.listId],
    attributes: name ? { FIRSTNAME: name } : {},
    updateEnabled: true,
  });
}

export async function sendTransactionalEmail(
  to: { email: string; name?: string },
  subject: string,
  htmlContent: string,
  overrideSenderName?: string
): Promise<Response> {
  const config = await getBrevoConfig();

  console.log(`[BREVO] Sending email to ${to.email} — subject: "${subject}" — sender: ${config.senderEmail}`);

  const response = await brevoRequest('/smtp/email', 'POST', {
    sender: { name: overrideSenderName || config.senderName, email: config.senderEmail },
    to: [to],
    subject,
    htmlContent,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[BREVO] Email send failed (${response.status}): ${errorText}`);
    throw new Error(`Brevo email send failed (${response.status}): ${errorText}`);
  }

  console.log(`[BREVO] Email sent successfully to ${to.email}`);
  return response;
}

export async function sendCampaign(
  subject: string,
  htmlContent: string,
  listIds?: number[]
): Promise<Response> {
  const config = await getBrevoConfig();
  return brevoRequest('/emailCampaigns', 'POST', {
    name: subject,
    subject,
    sender: { name: config.senderName, email: config.senderEmail },
    type: 'classic',
    recipients: { listIds: listIds || [config.listId] },
    htmlContent,
    status: 'sent',
  });
}

/**
 * Clear the cached Brevo config so next call reads fresh from DB.
 */
export function clearBrevoConfigCache() {
  brevoConfigCache = null;
  brevoConfigCacheTime = 0;
}

/**
 * Test the Brevo connection by fetching account info.
 * Always clears cache first to use the latest saved key.
 */
export async function testBrevoConnection(): Promise<{ success: boolean; email?: string; error?: string }> {
  try {
    // Force fresh config read so we use the latest saved key
    clearBrevoConfigCache();
    const response = await brevoRequest('/account', 'GET');
    if (response.ok) {
      const data = await response.json();
      return { success: true, email: data.email };
    } else {
      const text = await response.text();
      return { success: false, error: `Brevo API error (${response.status}): ${text}` };
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Erreur de connexion' };
  }
}
