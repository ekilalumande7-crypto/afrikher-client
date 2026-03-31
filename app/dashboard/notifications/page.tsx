"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, Check, ShoppingBag, CreditCard, FileText, AlertCircle } from "lucide-react";

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
      const { data: { user } } = await supabase.auth.getUser();
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
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
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
    return (
      <div className="bg-white p-10 border border-[#2A2A2A]/10 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#F5F0E8] rounded w-48" />
          <div className="h-16 bg-[#F5F0E8] rounded" />
          <div className="h-16 bg-[#F5F0E8] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 md:p-10 border border-[#2A2A2A]/10 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-[#9A9A8A] mt-1">{unreadCount} non lue(s)</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs uppercase tracking-widest text-[#C9A84C] font-bold hover:text-[#E8C97A] transition-colors"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={48} className="mx-auto text-[#9A9A8A]/50 mb-4" />
            <p className="text-[#9A9A8A] text-lg mb-2">Aucune notification</p>
            <p className="text-[#9A9A8A] text-sm">Vous serez notifié des mises à jour importantes ici.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || typeIcons.default;
              return (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  className={`flex items-start gap-4 p-5 border transition-colors cursor-pointer ${
                    notif.read
                      ? "border-[#2A2A2A]/5 bg-white"
                      : "border-[#C9A84C]/20 bg-[#F5F0E8]/50"
                  }`}
                >
                  <div className={`p-2 rounded-full flex-shrink-0 ${notif.read ? "bg-[#F5F0E8]" : "bg-[#C9A84C]/10"}`}>
                    <Icon size={16} className={notif.read ? "text-[#9A9A8A]" : "text-[#C9A84C]"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-sm font-bold truncate ${notif.read ? "text-[#9A9A8A]" : "text-[#0A0A0A]"}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 bg-[#C9A84C] rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-[#9A9A8A] mt-1">{notif.body}</p>
                    <p className="text-[10px] text-[#9A9A8A]/70 mt-2">
                      {new Date(notif.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
