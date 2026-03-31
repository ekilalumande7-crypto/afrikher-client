import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/auth-helpers';
import { sendNotification } from '@/lib/notifications';
import { sendTransactionalEmail } from '@/lib/brevo';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin(request);
    if (authResult.status === 401 || authResult.status === 403) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = await params;
    const supabase = getServiceRoleClient();

    // Get submission
    const { data: submission } = await supabase
      .from('partner_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Create article from submission
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        title: submission.title,
        slug: submission.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        content: submission.content,
        cover_image: submission.cover_image,
        category_id: submission.category_id,
        author_id: submission.partner_id,
        type: submission.type || 'article',
        status: 'published',
        partner_id: submission.partner_id,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (articleError || !article) {
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      );
    }

    // Update submission status
    const { error: updateError } = await supabase
      .from('partner_submissions')
      .update({
        status: 'published',
        published_article_id: article.id,
        reviewed_by: authResult.user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update submission' },
        { status: 500 }
      );
    }

    // Get partner
    const { data: partner } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', submission.partner_id)
      .single();

    // Send notification
    try {
      await sendNotification(submission.partner_id, {
        title: 'Contenu approuvé',
        body: `Votre soumission "${submission.title}" a été approuvée et publiée!`,
        type: 'content',
        data: { submissionId: id, articleId: article.id },
      });
    } catch (notifError) {
      console.error('Failed to send notification:', notifError);
    }

    // Send email
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Contenu approuvé!</h2>
          <p>Votre soumission "<strong>${submission.title}</strong>" a été approuvée et est maintenant publiée sur AFRIKHER.</p>
          <p><a href="https://afrikher.com/rubriques/${article.slug}">Voir mon article</a></p>
          <p>Cordialement,<br/>L'équipe AFRIKHER</p>
        </body>
      </html>
    `;

    await sendTransactionalEmail(
      { email: partner?.email || '', name: partner?.full_name },
      'Contenu approuvé - AFRIKHER',
      htmlContent
    );

    return NextResponse.json({
      success: true,
      message: 'Submission approved and published',
      article,
    });
  } catch (error) {
    console.error('POST /api/admin/submissions/[id]/approve error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
