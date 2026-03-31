import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface NotificationItem {
  id: string;
  type: "connection_request" | "unread_message" | "booking_update";
  title: string;
  description: string;
  link: string;
  createdAt: string;
}

export function useNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      const items: NotificationItem[] = [];

      // 1. Pending connection requests received
      const { data: pendingConnections } = await supabase
        .from("connections")
        .select("id, requester_id, created_at")
        .eq("receiver_id", user!.id)
        .eq("status", "pending");

      if (pendingConnections?.length) {
        const requesterIds = pendingConnections.map((c) => c.requester_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", requesterIds);
        const profileMap = Object.fromEntries(
          (profiles || []).map((p) => [p.user_id, p.full_name])
        );

        for (const conn of pendingConnections) {
          items.push({
            id: `conn-${conn.id}`,
            type: "connection_request",
            title: "Kontaktförfrågan",
            description: profileMap[conn.requester_id] || "Okänd användare",
            link: "/connections",
            createdAt: conn.created_at,
          });
        }
      }

      // 2. Unread messages
      const { data: unreadMessages } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at, conversation_id")
        .neq("sender_id", user!.id)
        .is("read_at", null)
        .order("created_at", { ascending: false })
        .limit(10);

      if (unreadMessages?.length) {
        const senderIds = [...new Set(unreadMessages.map((m) => m.sender_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", senderIds);
        const profileMap = Object.fromEntries(
          (profiles || []).map((p) => [p.user_id, p.full_name])
        );

        // Group by conversation, show latest per conversation
        const seen = new Set<string>();
        for (const msg of unreadMessages) {
          if (seen.has(msg.conversation_id)) continue;
          seen.add(msg.conversation_id);
          items.push({
            id: `msg-${msg.id}`,
            type: "unread_message",
            title: profileMap[msg.sender_id] || "Nytt meddelande",
            description: msg.content.length > 60 ? msg.content.slice(0, 60) + "…" : msg.content,
            link: "/messages",
            createdAt: msg.created_at,
          });
        }
      }

      // 3. Booking updates (confirmed/rejected bookings for the user, recent)
      const { data: bookingUpdates } = await supabase
        .from("bookings")
        .select("id, staff_user_id, client_user_id, status, service_name, updated_at, booking_date")
        .or(`staff_user_id.eq.${user!.id},client_user_id.eq.${user!.id}`)
        .in("status", ["confirmed", "pending"])
        .order("updated_at", { ascending: false })
        .limit(5);

      if (bookingUpdates?.length) {
        const otherIds = bookingUpdates.map((b) =>
          b.staff_user_id === user!.id ? b.client_user_id : b.staff_user_id
        );
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", otherIds);
        const profileMap = Object.fromEntries(
          (profiles || []).map((p) => [p.user_id, p.full_name])
        );

        for (const booking of bookingUpdates) {
          const isStaff = booking.staff_user_id === user!.id;
          const otherId = isStaff ? booking.client_user_id : booking.staff_user_id;
          const statusLabel = booking.status === "confirmed" ? "Bekräftad" : "Ny förfrågan";
          items.push({
            id: `booking-${booking.id}`,
            type: "booking_update",
            title: `Bokning: ${statusLabel}`,
            description: `${profileMap[otherId] || "Okänd"} – ${booking.service_name || "Session"} (${booking.booking_date})`,
            link: isStaff ? "/my-staff-profile" : "/my-profile",
            createdAt: booking.updated_at,
          });
        }
      }

      // Sort all by date descending
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return items;
    },
    enabled: !!user,
    refetchInterval: 30000, // Poll every 30s
  });
}

export function useNotificationCount() {
  const { data } = useNotifications();
  const connectionRequests = data?.filter((n) => n.type === "connection_request").length || 0;
  const unreadMessages = data?.filter((n) => n.type === "unread_message").length || 0;
  return {
    total: connectionRequests + unreadMessages,
    connectionRequests,
    unreadMessages,
  };
}
