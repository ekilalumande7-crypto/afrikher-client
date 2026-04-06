"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  AlertCircle,
  Bell,
  Check,
  FileText,
  ShoppingBag,
} from "lucide-react";
import AccountCard from "@/components/account/AccountCard";
import AccountEmptyState from "@/components/account/AccountEmptyState";
import AccountLoadingBlock from "@/components/account/AccountLoadingBlock";
import AccountSectionHeader from "@/components/account/AccountSectionHeader";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  created_at: string;
}

const typeIcons: Record<string, any> = {
  order: ShoppingBag,
  content: FileText,
  validation: Check,
  system: AlertCircle,
  default: Bell,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data && !error) {
        setNotifications(data);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <AccountLoadingBlock />;
  }

  return (
    <div className="space-y-8">
      <AccountSectionHeader
        eyebrow="Alertes"
        title="Vos notifications"
        description="Une lecture plus calme des mises à jour utiles, des informations système et des nouvelles liées à votre compte."
      />

      <AccountCard
        eyebrow="Boîte d’activité"
        title="Historique des notifications"
        description="Consultez vos messages récents et marquez rapidement les éléments déjà lus."
        actions={
          unreadCount > 0 ? (
            <button
              onClick={markAllAsRead}
              className="font-body text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] transition-opacity hover:opacity-75"
            >
              Tout marquer comme lu
            </button>
          ) : undefined
        }
      >
        {notifications.length === 0 ? (
          <AccountEmptyState
            icon={<Bell size={42} />}
            title="Aucune notification"
            description="Vos mises à jour importantes, confirmations et alertes apparaîtront ici au fil de votre activité."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || typeIcons.default;
              return (
                <button
                  key={notif.id}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  className={`flex w-full items-start gap-4 border p-5 text-left transition-colors ${
                    notif.read
                      ? "border-black/6 bg-white/45"
                      : "border-[#C9A84C]/24 bg-[#F5F0E8]"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                      notif.read ? "bg-[#F2EBDF]" : "bg-[#C9A84C]/12"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={notif.read ? "text-[#8D877C]" : "text-[#C9A84C]"}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h3
                        className={`font-body text-[0.94rem] font-semibold ${
                          notif.read ? "text-[#0A0A0A]/54" : "text-[#0A0A0A]"
                        }`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#C9A84C]" />
                      )}
                    </div>
                    <p className="mt-2 font-body text-[0.92rem] leading-[1.72] text-[#0A0A0A]/56">
                      {notif.body}
                    </p>
                    <p className="mt-3 font-body text-[0.68rem] uppercase tracking-[0.18em] text-[#8D877C]">
                      {new Date(notif.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </AccountCard>
    </div>
  );
}
