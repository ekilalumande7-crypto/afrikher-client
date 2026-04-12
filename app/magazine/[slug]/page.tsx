import { getServiceRoleClient } from "@/lib/supabase";
import { getServerAuthUser } from "@/lib/server-auth";
import MagazineReaderClient from "./MagazineReaderClient";

const defaultSlugs = [
  "afrikher-n1-ascension",
  "afrikher-n2-mode-identite",
  "afrikher-n3-tech-innovation",
  "afrikher-n4-leadership-feminin",
];

export async function generateStaticParams() {
  return defaultSlugs.map((slug) => ({ slug }));
}

export default async function MagazineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getServerAuthUser();
  const userEmail = user?.email?.toLowerCase() ?? null;

  let hasAccess = false;
  let magazineId: string | null = null;

  // Fetch the magazine to get its ID
  const supabase = getServiceRoleClient();
  const { data: magazine } = await supabase
    .from("magazines")
    .select("id")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (magazine) {
    magazineId = magazine.id;
  }

  if (magazineId && (user?.id || userEmail)) {
    let hasActiveSubscription = false;

    // 1. Check active subscription by user_id, then fall back to customer_email
    //    Accept status=active regardless of current_period_end (may be NULL)
    if (user?.id) {
      const { data: subscriptionByUser } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      hasActiveSubscription = Boolean(subscriptionByUser);
    }

    if (!hasActiveSubscription && userEmail) {
      const { data: subscriptionByEmail } = await supabase
        .from("subscriptions")
        .select("id, user_id")
        .eq("customer_email", userEmail)
        .eq("status", "active")
        .maybeSingle();

      if (subscriptionByEmail) {
        hasActiveSubscription = true;
        // Auto-link user_id for future lookups
        if (!subscriptionByEmail.user_id && user?.id) {
          await supabase
            .from("subscriptions")
            .update({ user_id: user.id })
            .eq("id", subscriptionByEmail.id);
        }
      }
    }

    // 2. Check magazine purchase
    let hasMagazinePurchase = false;

    if (user?.id) {
      const { data: purchase } = await supabase
        .from("magazine_purchases")
        .select("id")
        .eq("magazine_id", magazineId)
        .eq("user_id", user.id)
        .eq("payment_status", "completed")
        .maybeSingle();

      hasMagazinePurchase = Boolean(purchase);
    }

    // hasAccess = subscription active OR magazine purchased
    hasAccess = hasActiveSubscription || hasMagazinePurchase;
  }

  return (
    <MagazineReaderClient
      slug={slug}
      hasAccess={hasAccess}
      magazineId={magazineId}
    />
  );
}
