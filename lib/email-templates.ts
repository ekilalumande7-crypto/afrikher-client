// ══════════════════════════════════════════════
// AFRIKHER — Email Templates (HTML)
// All transactional emails use this shared styling
// ══════════════════════════════════════════════

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afrikher-client.vercel.app';

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
    AFRIKHER Magazine — L'elegance hors du commun.<br>
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
export function welcomeReaderEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Bienvenue sur AFRIKHER',
    html: layout(`
      ${heading('Bienvenue, ' + (name || 'chere lectrice') + '.')}
      <p>Nous sommes ravies de vous accueillir dans l'univers AFRIKHER — le magazine premium dedie au business et au leadership feminin africain.</p>
      <p>Votre compte est maintenant actif. Vous pouvez decouvrir nos contenus editoriaux, parcourir notre boutique et rejoindre notre communaute.</p>
      ${button('Decouvrir le magazine', SITE_URL + '/magazine')}
      ${subtle('A bientot dans nos pages.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 2. ORDER CONFIRMATION
// ══════════════════════════════════════════════
export function orderConfirmationEmail(
  name: string,
  orderId: string,
  total: string,
  items: { name: string; qty: number; price: number }[]
): { subject: string; html: string } {
  const itemsHtml = items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;color:#F5F0E8;font-size:14px;border-bottom:1px solid #F5F0E820">${i.name} x${i.qty}</td><td style="padding:8px 0;color:#C9A84C;font-size:14px;text-align:right;border-bottom:1px solid #F5F0E820">${i.price.toFixed(2)} EUR</td></tr>`
    )
    .join('');

  return {
    subject: 'Confirmation de votre commande — AFRIKHER',
    html: layout(`
      ${heading('Commande confirmee')}
      <p>Merci ${name || ''} pour votre commande. Votre paiement a ete recu avec succes.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-top:1px solid #F5F0E820">
        ${itemsHtml}
        <tr><td style="padding:12px 0;color:#F5F0E8;font-size:15px;font-weight:600">Total</td><td style="padding:12px 0;color:#C9A84C;font-size:15px;font-weight:600;text-align:right">${total} EUR</td></tr>
      </table>
      <p style="font-size:13px;opacity:0.6">Reference : ${orderId.slice(0, 8).toUpperCase()}</p>
      ${button('Voir mes commandes', SITE_URL + '/dashboard/commandes')}
      ${subtle('Vous recevrez un email quand votre commande sera expediee.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 3. SUBSCRIPTION CONFIRMED
// ══════════════════════════════════════════════
export function subscriptionConfirmedEmail(name: string, plan: string): { subject: string; html: string } {
  return {
    subject: 'Abonnement active — AFRIKHER',
    html: layout(`
      ${heading('Votre abonnement est actif')}
      <p>Felicitations ${name || ''} ! Votre abonnement AFRIKHER (${plan === 'annual' ? 'annuel' : 'mensuel'}) est maintenant actif.</p>
      <p>Vous avez desormais acces a l'integralite de nos contenus premium : articles editoriaux, interviews exclusives, dossiers et bien plus.</p>
      ${button('Acceder a mes contenus', SITE_URL + '/magazine')}
      ${subtle('Gerez votre abonnement depuis votre espace membre.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 4. SUBMISSION RECEIVED (partner)
// ══════════════════════════════════════════════
export function submissionReceivedEmail(name: string, title: string): { subject: string; html: string } {
  return {
    subject: 'Soumission recue — AFRIKHER',
    html: layout(`
      ${heading('Votre contenu a ete recu')}
      <p>Merci ${name || 'cher partenaire'}. Votre soumission « ${title} » a bien ete enregistree.</p>
      <p>Notre equipe editoriale va l'examiner dans les meilleurs delais. Vous recevrez une notification des que le statut sera mis a jour.</p>
      ${button('Suivre mes soumissions', SITE_URL + '/partner/contenus')}
      ${subtle('Delai de traitement habituel : 48 a 72 heures.')}
    `),
  };
}

// ══════════════════════════════════════════════
// 5. NEWSLETTER WELCOME
// ══════════════════════════════════════════════
export function newsletterWelcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: 'Bienvenue dans la newsletter AFRIKHER',
    html: layout(`
      ${heading('Vous etes inscrit(e)')}
      <p>${name ? 'Cher(e) ' + name + ', merci' : 'Merci'} de rejoindre la communaute AFRIKHER.</p>
      <p>Vous recevrez nos meilleurs contenus, nos analyses et nos decouvertes directement dans votre boite mail.</p>
      ${button('Decouvrir nos articles', SITE_URL + '/rubriques')}
      ${subtle('Vous pouvez vous desabonner a tout moment.')}
    `),
  };
}

export function magazinePurchaseEmail(
  name: string,
  magazineTitle: string,
  magazineSlug: string,
  pdfUrl: string | null
): { subject: string; html: string } {
  const readUrl = `${SITE_URL}/magazine/${magazineSlug}`;
  return {
    subject: `Votre magazine AFRIKHER est pret : ${magazineTitle}`,
    html: layout(`
      ${heading('Achat confirme')}
      <p>${name ? 'Cher(e) ' + name + ',' : ''} merci pour votre achat.</p>
      <p>Votre exemplaire de <strong>${magazineTitle}</strong> est desormais accessible dans votre espace AFRIKHER.</p>
      ${button('Lire le magazine', readUrl)}
      ${pdfUrl ? `<p style="margin-top:16px;text-align:center;"><a href="${pdfUrl}" style="color:#C9A84C;text-decoration:underline;font-size:14px;">Telecharger le PDF</a></p>` : ''}
      ${subtle('Cet achat est definitif. Vous pouvez relire votre magazine a tout moment depuis votre compte.')}
    `),
  };
}
