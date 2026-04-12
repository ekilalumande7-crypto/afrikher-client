import { getServiceRoleClient } from "@/lib/supabase";
import { getServerAuthUser } from "@/lib/server-auth";
import RubriquesArticleClient from "./RubriquesArticleClient";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getServerAuthUser();

  let hasAccess = false;

  if (user?.id) {
    const supabase = getServiceRoleClient();

    // 1. Check by user_id — accept active subscription regardless of period_end
    //    (period_end may be NULL if webhook didn't fill it)
    const { data: subByUser } = await supabase
      .from("subscriptions")
      .select("id, status, current_period_end")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (subByUser) {
      hasAccess = true;
    } else if (user.email) {
      // 2. Fallback: check by customer_email
      const { data: subByEmail } = await supabase
        .from("subscriptions")
        .select("id, status, current_period_end, user_id")
        .eq("customer_email", user.email)
        .eq("status", "active")
        .maybeSingle();

      if (subByEmail) {
        hasAccess = true;
        // Auto-link user_id for future lookups
        if (!subByEmail.user_id) {
          await supabase
            .from("subscriptions")
            .update({ user_id: user.id })
            .eq("id", subByEmail.id);
        }
      }
    }
  }

  return <RubriquesArticleClient slug={slug} hasAccess={hasAccess} />;
}
