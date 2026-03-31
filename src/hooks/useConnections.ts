import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type ConnectionStatus = "pending" | "accepted" | "rejected" | "none";

export interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name: string;
    avatar_url: string | null;
  };
  role?: string;
}

export function useConnectionStatus(targetUserId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["connection-status", user?.id, targetUserId],
    queryFn: async () => {
      if (!user || !targetUserId || user.id === targetUserId) return { status: "self" as const, connection: null };

      const { data, error } = await supabase
        .from("connections")
        .select("*")
        .or(`and(requester_id.eq.${user.id},receiver_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},receiver_id.eq.${user.id})`)
        .maybeSingle();

      if (error) throw error;
      if (!data) return { status: "none" as ConnectionStatus, connection: null };

      return {
        status: data.status as ConnectionStatus,
        connection: data,
        isSender: data.requester_id === user.id,
      };
    },
    enabled: !!user && !!targetUserId,
  });
}

export function useConnectionActions() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const invalidate = (targetUserId?: string) => {
    qc.invalidateQueries({ queryKey: ["connection-status"] });
    qc.invalidateQueries({ queryKey: ["connections"] });
    qc.invalidateQueries({ queryKey: ["connection-count"] });
  };

  const sendRequest = useMutation({
    mutationFn: async (receiverId: string) => {
      const { error } = await supabase.from("connections").insert({
        requester_id: user!.id,
        receiver_id: receiverId,
      });
      if (error) throw error;
    },
    onSuccess: () => invalidate(),
  });

  const acceptRequest = useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await supabase
        .from("connections")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", connectionId);
      if (error) throw error;
    },
    onSuccess: () => invalidate(),
  });

  const rejectRequest = useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await supabase
        .from("connections")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", connectionId);
      if (error) throw error;
    },
    onSuccess: () => invalidate(),
  });

  const removeConnection = useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await supabase.from("connections").delete().eq("id", connectionId);
      if (error) throw error;
    },
    onSuccess: () => invalidate(),
  });

  return { sendRequest, acceptRequest, rejectRequest, removeConnection };
}

export function useConnections(filter: "accepted" | "pending_received" | "pending_sent" | "all" = "all") {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["connections", user?.id, filter],
    queryFn: async () => {
      let query = supabase.from("connections").select("*");

      if (filter === "accepted") {
        query = query.eq("status", "accepted");
      } else if (filter === "pending_received") {
        query = query.eq("status", "pending").eq("receiver_id", user!.id);
      } else if (filter === "pending_sent") {
        query = query.eq("status", "pending").eq("requester_id", user!.id);
      }

      const { data, error } = await query.order("updated_at", { ascending: false });
      if (error) throw error;

      // Fetch profiles for the other users
      const otherUserIds = (data || []).map((c) =>
        c.requester_id === user!.id ? c.receiver_id : c.requester_id
      );

      if (otherUserIds.length === 0) return [];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", otherUserIds);

      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", otherUserIds);

      const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));
      const roleMap = Object.fromEntries((roles || []).map((r) => [r.user_id, r.role]));

      return (data || []).map((c) => {
        const otherId = c.requester_id === user!.id ? c.receiver_id : c.requester_id;
        return {
          ...c,
          profile: profileMap[otherId],
          role: roleMap[otherId],
        } as Connection;
      });
    },
    enabled: !!user,
  });
}

export function useConnectionCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["connection-count", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("connections")
        .select("*", { count: "exact", head: true })
        .eq("status", "accepted")
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });
}
