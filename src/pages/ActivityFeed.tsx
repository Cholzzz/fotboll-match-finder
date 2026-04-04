import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, UserPlus, Clock, Link2, Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { Navigate } from "react-router-dom";

type FeedItem = {
  id: string;
  type: "trial" | "booking" | "connection" | "new_player";
  title: string;
  description: string;
  created_at: string;
  icon: typeof Calendar;
};

const ActivityFeed = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ["my-profile-region", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("player_profiles")
        .select("region")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: trials } = useQuery({
    queryKey: ["feed-trials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("trials")
        .select("id, title, location, trial_date, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: bookings } = useQuery({
    queryKey: ["feed-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, booking_date, start_time, status, created_at, service_name")
        .or(`client_user_id.eq.${user!.id},staff_user_id.eq.${user!.id}`)
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: connections } = useQuery({
    queryKey: ["feed-connections", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("connections")
        .select("id, status, created_at, requester_id, receiver_id")
        .or(`requester_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: newPlayers } = useQuery({
    queryKey: ["feed-new-players"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const feedItems: FeedItem[] = [];

  trials?.forEach((t) => {
    feedItems.push({
      id: `trial-${t.id}`,
      type: "trial",
      title: t.title || "Ny provträning",
      description: `${t.location} — ${format(new Date(t.trial_date), "d MMM yyyy", { locale: sv })}`,
      created_at: t.created_at,
      icon: Calendar,
    });
  });

  bookings?.forEach((b) => {
    feedItems.push({
      id: `booking-${b.id}`,
      type: "booking",
      title: b.service_name || "Bokning",
      description: `${format(new Date(b.booking_date), "d MMM", { locale: sv })} kl ${b.start_time?.slice(0, 5)} — ${b.status === "confirmed" ? "Bekräftad" : b.status === "cancelled" ? "Avbokad" : "Väntar"}`,
      created_at: b.created_at,
      icon: Clock,
    });
  });

  connections?.forEach((c) => {
    const isSender = c.requester_id === user.id;
    feedItems.push({
      id: `conn-${c.id}`,
      type: "connection",
      title: isSender ? "Kontaktförfrågan skickad" : "Ny kontaktförfrågan",
      description: c.status === "accepted" ? "Accepterad" : c.status === "pending" ? "Väntar på svar" : "Avvisad",
      created_at: c.created_at,
      icon: Link2,
    });
  });

  newPlayers?.forEach((p) => {
    if (p.user_id === user.id) return;
    feedItems.push({
      id: `player-${p.user_id}`,
      type: "new_player",
      title: `${p.full_name} gick med`,
      description: "Ny användare på plattformen",
      created_at: p.created_at,
      icon: UserPlus,
    });
  });

  feedItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const iconColor: Record<FeedItem["type"], string> = {
    trial: "text-primary",
    booking: "text-neon",
    connection: "text-accent-foreground",
    new_player: "text-muted-foreground",
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8 space-y-6">
        <h1 className="text-2xl font-bold">Aktivitetsflöde</h1>

        {feedItems.length === 0 ? (
          <p className="text-muted-foreground">Inga händelser att visa ännu.</p>
        ) : (
          <div className="space-y-3">
            {feedItems.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.id}>
                  <CardContent className="flex items-start gap-4 py-4">
                    <div className={`mt-0.5 ${iconColor[item.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: sv })}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ActivityFeed;
