// ══════════════════════════════════════════════
// AFRIKHER — Email Templates (HTML)
// All transactional emails use this shared styling
// Templates can be customized via site_config keys:
//   email_tpl_{type}_subject  → custom subject line
//   email_tpl_{type}_body     → custom body text (plain text, auto-converted to HTML)
// ══════════════════════════════════════════════

import { getServiceRoleClient } from '@/lib/supabase';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrikher-client.vercel.app';

// ── Cache for custom templates loaded from site_config ──
let tplCache: Record<string, string> | null = null;
let tplCacheTime = 0;
const TPL_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function loadCustomTemplates(): Promise<Record<string, string>> {
  const now = Date.now();
  if (tplCache && now - tplCacheTime < TPL_CACHE_TTL) return tplCache;

  try {
    const supabase = getServiceRoleClient();
    const { data } = await supabase
      .from('site_config')
      .select('key, value')
      .like('key', 'email_tpl_%');

    const map: Record<string, string> = {};
    data?.forEach((r: { key: string; value: string }) => {
      if (r.value && r.value.trim()) map[r.key] = r.value.trim();
    });

    tplCache = map;
    tplCacheTime = now;
    return map;
  } catch {
    return tplCache || {};
  }
}

function getCustom(templates: Record<string, string>, type: string, field: 'subject' | 'body'): string | null {
  const val = templates[`email_tpl_${type}_${field}`];
  return val && val.trim() ? val.trim() : null;
}

// ── Convert plain text body to HTML paragraphs ──
function textToHtml(text: string, vars: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('\n    ');
}

// ── Layout wrapper ──
function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
  <!-- Logo -->
  <tr><td style="padding-bottom:32px;text-align:center">
    <a href="${SITE_URL}" style="font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.2em;color:#C9A84C;text-decoration:none">AFRIKHER</a>
    <div style="font-size:8px;letter-spacing:0.15em;color:#C9A84C;opacity:0.5;margin-top:4px;text-transform:uppercase">Magazine</div>
  </td></tr>
  <!-- Gold line -->
  <tr><td style="padding-bottom:32px"><div style="height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent)"></div></td></tr>
  <!-- Content -->
  <tr><td style="color:#F5F0E8;font-size:15px;line-height:1.7">
    ${content}
  </td></tr>
  <!-- Footer line -->
  <tr><td style="padding-top:40px;padding-bottom:24px"><div style="height:1px;background:linear-gradient(90deg,transparent,#C9A84C33,transparent)"></div></td></tr>
  <!-- Footer -->
  <tr><td style="text-align:center;font-size:11px;color:#F5F0E8;opacity:0.3;line-height:1.6">
    AFRIKHER Magazine — L'élégance hors du commun.<br>
    <a href="${SITE_URL}" style="color:#C9A84C;opacity:0.5;text-decoration:none">afrikher.com</a>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function button(text: string, url: string): string {
  return `<table cellpadding="0" cellspacing="0" style="margin:28px 0"><tr><td>
    <a href="${url}" style="display:inline-block;padding:14px 32px;background:#C9A84C;color:#0A0A0A;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none">${text}</a>
  </td></tr></table>`;
}

function heading(text: string): string {
  return `<h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#F5F0E8;margin:0 0 16px 0;font-weight:400">${text}</h2>`;
}

function subtle(text: string): string {
  return `<p style="color:#F5F0E8;opacity:0.5;font-size:13px;margin:20px 0 0">${text}</p>`;
}

// ══════════════════════════════════════════════
// 1. WELCOME READER
// ══════════════════════════════════════════════
export async function welcomeReaderEmail(name: string): Promise<{ subject: string; html: string }> {
  const tpls = await loadCustomTemplates();
  const customSubject = getCustom(tpls, 'welcome', 'subject');
  const customBody = getCustom(tpls, 'welcome', 'body');

  if (customBody) {
    const bodyHtml = textToHtml(customBody, { nom: name || 'chère lectrice' });
    return {
      subject: customSubject || 'Bienvenue sur AFRIKHER',
      html: layout(`${bodyHtml}${button('Découvrir le magazine', SITE_URL + '/magazine')}`),
    };
  }

  return {
    subject: customSubject || 'Bienvenue sur AFRIKHER',
    html: layout(`
      ${heading('Bienvenue, ' + (name || 'chère lectrice') + '.')}
      <p>Nous sommes ravies de vous accueillir dans l'univers AFRIKHER — le magazine premium dédié au business et au leadership féminin africain.</p>
      <p>Votre compte est maintenant actif. Vous pouvez découvrir nos contenus éditoriaux, parcourir notre boutique et rejoindre notre communauté.</p>
      ${button('Découvrir le magazine', SITE_URL + '/magazine')}
      ${subtle('À bientôt dans nos pages.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 2. ORDER CONFIRMATION
// ══════════════════════════════════════════════
export async function orderConfirmationEmail(
  name: string,
  orderId: string,
  total: string,
  items: { name: string; qty: number; price: number }[]
): Promise<{ subject: string; html: string }> {
  const tpls = await loadCustomTemplates();
  const customSubject = getCustom(tpls, 'order', 'subject');
  const customBody = getCustom(tpls, 'order', 'body');

  const itemsHtml = items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;color:#F5F0E8;font-size:14px;border-bottom:1px solid #F5F0E820">${i.name} x${i.qty}</td><td style="padding:8px 0;color:#C9A84C;font-size:14px;text-align:right;border-bottom:1px solid #F5F0E820">${i.price.toFixed(2)} EUR</td></tr>`
    )
    .join('');

  if (customBody) {
    const bodyHtml = textToHtml(customBody, {
      nom: name || '',
      reference: orderId.slice(0, 8).toUpperCase(),
      total,
    });
    return {
      subject: customSubject || 'Confirmation de votre commande — AFRIKHER',
      html: layout(`${bodyHtml}
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-top:1px solid #F5F0E820">
          ${itemsHtml}
          <tr><td style="padding:12px 0;color:#F5F0E8;font-size:15px;font-weight:600">Total</td><td style="padding:12px 0;color:#C9A84C;font-size:15px;font-weight:600;text-align:right">${total} EUR</td></tr>
        </table>
        ${button('Voir mes commandes', SITE_URL + '/dashboard/commandes')}`),
    };
  }

  return {
    subject: customSubject || 'Confirmation de votre commande — AFRIKHER',
    html: layout(`
      ${heading('Commande confirmée')}
      <p>Merci ${name || ''} pour votre commande. Votre paiement a été reçu avec succès.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-top:1px solid #F5F0E820">
        ${itemsHtml}
        <tr><td style="padding:12px 0;color:#F5F0E8;font-size:15px;font-weight:600">Total</td><td style="padding:12px 0;color:#C9A84C;font-size:15px;font-weight:600;text-align:right">${total} EUR</td></tr>
      </table>
      <p style="font-size:13px;opacity:0.6">Référence : ${orderId.slice(0, 8).toUpperCase()}</p>
      ${button('Voir mes commandes', SITE_URL + '/dashboard/commandes')}
      ${subtle('Vous recevrez un email quand votre commande sera expédiée.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 3. SUBSCRIPTION CONFIRMED
// ══════════════════════════════════════════════
export async function subscriptionConfirmedEmail(name: string, plan: string): Promise<{ subject: string; html: string }> {
  const tpls = await loadCustomTemplates();
  const customSubject = getCustom(tpls, 'subscription', 'subject');
  const customBody = getCustom(tpls, 'subscription', 'body');

  const planLabel = plan === 'annual' ? 'annuel' : 'mensuel';

  if (customBody) {
    const bodyHtml = textToHtml(customBody, { nom: name || '', plan: planLabel });
    return {
      subject: customSubject || 'Abonnement activé — AFRIKHER',
      html: layout(`${bodyHtml}${button('Accéder à mes contenus', SITE_URL + '/magazine')}`),
    };
  }

  return {
    subject: customSubject || 'Abonnement activé — AFRIKHER',
    html: layout(`
      ${heading('Votre abonnement est actif')}
      <p>Félicitations ${name || ''} ! Votre abonnement AFRIKHER (${planLabel}) est maintenant actif.</p>
      <p>Vous avez désormais accès à l'intégralité de nos contenus premium : articles éditoriaux, interviews exclusives, dossiers et bien plus.</p>
      ${button('Accéder à mes contenus', SITE_URL + '/magazine')}
      ${subtle('Gérez votre abonnement depuis votre espace membre.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 3b. SUBSCRIPTION CANCELLED
// ══════════════════════════════════════════════
export async function subscriptionCancelledEmail(name: string, plan: string): Promise<{ subject: string; html: string }> {
  const tpls = await loadCustomTemplates();
  const customSubject = getCustom(tpls, 'subscription_cancel', 'subject');
  const customBody = getCustom(tpls, 'subscription_cancel', 'body');

  const planLabel = plan === 'annual' ? 'annuel' : 'mensuel';

  if (customBody) {
    const bodyHtml = textToHtml(customBody, { nom: name || '', plan: planLabel });
    return {
      subject: customSubject || 'Votre abonnement AFRIKHER a été désactivé',
      html: layout(`${bodyHtml}${button('Réactiver mon abonnement', SITE_URL + '/abonnement')}`),
    };
  }

  return {
    subject: customSubject || 'Votre abonnement AFRIKHER a été désactivé',
    html: layout(`
      ${heading('Abonnement désactivé')}
      <p>${name || 'Cher(e) abonné(e)'}, votre abonnement AFRIKHER (${planLabel}) a été désactivé.</p>
      <p>Vous conservez l'accès à vos contenus jusqu'à la fin de votre période en cours. Après cette date, l'accès aux contenus premium sera suspendu.</p>
      <p>Vous pouvez réactiver votre abonnement à tout moment depuis votre espace membre.</p>
      ${button('Réactiver mon abonnement', SITE_URL + '/abonnement')}
      ${subtle('Nous espérons vous revoir bientôt.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 4. SUBMISSION RECEIVED (partner)
// ══════════════════════════════════════════════
export async function submissionReceivedEmail(name: string, title: string): Promise<{ subject: string; html: string }> {
  const tpls = await loadCustomTemplates();
  const customSubject = getCustom(tpls, 'submission', 'subject');
  const customBody = getCustom(tpls, 'submission', 'body');

  if (customBody) {
    const bodyHtml = textToHtml(customBody, { nom: name || 'cher partenaire', titre: title });
    return {
      subject: customSubject || 'Soumission reçue — AFRIKHER',
      html: layout(`${bodyHtml}${button('Suivre mes soumissions', SITE_URL + '/partner/contenus')}`),
    };
  }

  return {
    subject: customSubject || 'Soumission reçue — AFRIKHER',
    html: layout(`
      ${heading('Votre contenu a été reçu')}
      <p>Merci ${name || 'cher partenaire'}. Votre soumission « ${title} » a bien été enregistrée.</p>
      <p>Notre équipe éditoriale va l'examiner dans les meilleurs délais. Vous recevrez une notification dès que le statut sera mis à jour.</p>
      ${button('Suivre mes soumissions', SITE_URL + '/partner/contenus')}
      ${subtle('Délai de traitement habituel : 48 à 72 heures.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 5. NEWSLETTER WELCOME
// ══════════════════════════════════════════════
export async function newsletterWelcomeEmail(name: string): Promise<{ subject: string; html: string }> {
  const tpls = await loadCustomTemplates();
  const customSubject = getCustom(tpls, 'newsletter', 'subject');
  const customBody = getCustom(tpls, 'newsletter', 'body');

  if (customBody) {
    const bodyHtml = textToHtml(customBody, { nom: name || '' });
    return {
      subject: customSubject || 'Bienvenue dans la newsletter AFRIKHER',
      html: layout(`${bodyHtml}${button('Découvrir nos articles', SITE_URL + '/rubriques')}`),
    };
  }

  return {
    subject: customSubject || 'Bienvenue dans la newsletter AFRIKHER',
    html: layout(`
      ${heading('Vous êtes inscrit(e)')}
      <p>${name ? 'Cher(e) ' + name + ', merci' : 'Merci'} de rejoindre la communauté AFRIKHER.</p>
      <p>Vous recevrez nos meilleurs contenus, nos analyses et nos découvertes directement dans votre boîte mail.</p>
      ${button('Découvrir nos articles', SITE_URL + '/rubriques')}
      ${subtle('Vous pouvez vous désabonner à tout moment.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 6. CONTACT FORM CONFIRMATION
// ══════════════════════════════════════════════
export async function contactConfirmationEmail(name: string, subject: string): Promise<{ subject: string; html: string }> {
  const tpls = await loadCustomTemplates();
  const customSubject = getCustom(tpls, 'contact', 'subject');
  const customBody = getCustom(tpls, 'contact', 'body');

  if (customBody) {
    const bodyHtml = textToHtml(customBody, { nom: name || '', sujet: subject });
    return {
      subject: customSubject || 'Nous avons bien reçu votre message — AFRIKHER',
      html: layout(`${bodyHtml}`),
    };
  }

  return {
    subject: customSubject || 'Nous avons bien reçu votre message — AFRIKHER',
    html: layout(`
      ${heading('Message reçu')}
      <p>${name || ''}, nous avons bien reçu votre message concernant « ${subject} ».</p>
      <p>Notre équipe vous répondra dans les meilleurs délais, généralement sous 24 à 48 heures.</p>
      ${subtle('Merci pour votre intérêt envers AFRIKHER.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 7. MAGAZINE PURCHASE
// ══════════════════════════════════════════════
export async function magazinePurchaseEmail(
  name: string,
  magazineTitle: string,
  magazineSlug: string,
  pdfUrl: string | null
): Promise<{ subject: string; html: string }> {
  const tpls = await loadCustomTemplates();
  const customSubject = getCustom(tpls, 'magazine_purchase', 'subject');
  const customBody = getCustom(tpls, 'magazine_purchase', 'body');

  const readUrl = `${SITE_URL}/magazine/${magazineSlug}`;

  if (customBody) {
    const bodyHtml = textToHtml(customBody, {
      nom: name || '',
      titre_magazine: magazineTitle,
    });
    return {
      subject: customSubject || `Votre magazine AFRIKHER est prêt : ${magazineTitle}`,
      html: layout(`${bodyHtml}${button('Lire le magazine', readUrl)}${pdfUrl ? `<p style="margin-top:16px;text-align:center;"><a href="${pdfUrl}" style="color:#C9A84C;text-decoration:underline;font-size:14px;">Télécharger le PDF</a></p>` : ''}`),
    };
  }

  return {
    subject: customSubject || `Votre magazine AFRIKHER est prêt : ${magazineTitle}`,
    html: layout(`
      ${heading('Achat confirmé')}
      <p>${name ? 'Cher(e) ' + name + ',' : ''} merci pour votre achat.</p>
      <p>Votre exemplaire de <strong>${magazineTitle}</strong> est désormais accessible dans votre espace AFRIKHER.</p>
      ${button('Lire le magazine', readUrl)}
      ${pdfUrl ? `<p style="margin-top:16px;text-align:center;"><a href="${pdfUrl}" style="color:#C9A84C;text-decoration:underline;font-size:14px;">Télécharger le PDF</a></p>` : ''}
      ${subtle('Cet achat est définitif. Vous pouvez relire votre magazine à tout moment depuis votre compte.')}
    `),
  };
}
