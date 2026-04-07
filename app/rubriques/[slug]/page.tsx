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
    const now = new Date().toISOString();

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .gt("current_period_end", now)
      .maybeSingle();

    hasAccess = Boolean(subscription);
  }

  return <RubriquesArticleClient slug={slug} hasAccess={hasAccess} />;
}
