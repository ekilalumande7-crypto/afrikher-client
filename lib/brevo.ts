const BREVO_API_URL = 'https://api.brevo.com/v3';

export async function brevoRequest(
  endpoint: string,
  method: string = 'GET',
  body?: any
): Promise<Response> {
  const response = await fetch(`${BREVO_API_URL}${endpoint}`, {
    method,
    headers: {
      'api-key': process.env.BREVO_API_KEY!,
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  return response;
}

export async function addContact(
  email: string,
  name?: string,
  listIds: number[] = [2]
): Promise<Response> {
  return brevoRequest('/contacts', 'POST', {
    email,
    listIds,
    attributes: name ? { FIRSTNAME: name } : {},
    updateEnabled: true,
  });
}

export async function sendTransactionalEmail(
  to: { email: string; name?: string },
  subject: string,
  htmlContent: string,
  senderName: string = 'AFRIKHER'
): Promise<Response> {
  return brevoRequest('/smtp/email', 'POST', {
    sender: { name: senderName, email: 'noreply@afrikher.com' },
    to: [to],
    subject,
    htmlContent,
  });
}

export async function sendCampaign(
  subject: string,
  htmlContent: string,
  listIds: number[]
): Promise<Response> {
  return brevoRequest('/emailCampaigns', 'POST', {
    name: subject,
    subject,
    sender: { name: 'AFRIKHER', email: 'noreply@afrikher.com' },
    type: 'classic',
    recipients: { listIds },
    htmlContent,
    status: 'sent',
  });
}
