import { getServiceRoleClient } from "@/lib/supabase";
import { getServerAuthUser } from "@/lib/server-auth";
import MagazineReaderClient from "./MagazineReaderClient";

// CRITICAL: force dynamic rendering so server-side auth runs on every request.
// Without this, Next.js caches the page with no user context → paywall always shows.
export const dynamic = "force-dynamic";

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
    // Magazines are PAID content — subscription alone does NOT grant access.
    // Only a completed magazine_purchases record unlocks reading.
    let hasMagazinePurchase = false;

    // Check by user_id first
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

    // Fallback: check by customer_email
    if (!hasMagazinePurchase && userEmail) {
      const { data: purchaseByEmail } = await supabase
        .from("magazine_purchases")
        .select("id, user_id")
        .eq("magazine_id", magazineId)
        .eq("customer_email", userEmail)
        .eq("payment_status", "completed")
        .maybeSingle();

      if (purchaseByEmail) {
        hasMagazinePurchase = true;
        // Auto-link user_id for future lookups
        if (!purchaseByEmail.user_id && user?.id) {
          await supabase
            .from("magazine_purchases")
            .update({ user_id: user.id })
            .eq("id", purchaseByEmail.id);
        }
      }
    }

    hasAccess = hasMagazinePurchase;
  }

  return (
    <MagazineReaderClient
      slug={slug}
      hasAccess={hasAccess}
      magazineId={magazineId}
    />
  );
}
