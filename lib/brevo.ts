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
  let senderEmail = 'noreply@afrikher.com';
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
      // site_config takes priority over .env
      if (configMap['brevo_api_key']) apiKey = configMap['brevo_api_key'];
      if (configMap['brevo_sender_email']) senderEmail = configMap['brevo_sender_email'];
      if (configMap['brevo_sender_name']) senderName = configMap['brevo_sender_name'];
      if (configMap['brevo_newsletter_list_id']) listId = parseInt(configMap['brevo_newsletter_list_id'], 10) || 2;
    }
  } catch (err) {
    console.error('Failed to load Brevo config from site_config, using .env fallback:', err);
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
  return brevoRequest('/smtp/email', 'POST', {
    sender: { name: overrideSenderName || config.senderName, email: config.senderEmail },
    to: [to],
    subject,
    htmlContent,
  });
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
 * Test the Brevo connection by fetching account info.
 * Returns account email on success.
 */
export async function testBrevoConnection(): Promise<{ success: boolean; email?: string; error?: string }> {
  try {
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
