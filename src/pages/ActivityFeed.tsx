import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Link2, Loader2, Dumbbell, Video, BarChart3 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { Navigate } from "react-router-dom";

type FeedItem = {
  id: string;
  type: "trial_app" | "booking" | "connection" | "performance" | "highlight" | "stats";
  title: string;
  description: string;
  created_at: string;
  icon: typeof Calendar;
};

const ActivityFeed = () => {
  const { user, loading: authLoading } = useAuth();

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

  const { data: trialApps } = useQuery({
    queryKey: ["feed-trial-apps", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("trial_applications")
        .select("id, status, created_at, message, trials(title, trial_date, location)")
        .eq("player_user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: performance } = useQuery({
    queryKey: ["feed-performance", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("player_performance")
        .select("id, test_name, test_type, value, unit, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: highlights } = useQuery({
    queryKey: ["feed-highlights", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("highlights")
        .select("id, title, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ["feed-stats", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("player_statistics")
        .select("id, season, matches, goals, assists, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
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

  bookings?.forEach((b) => {
    const statusText = b.status === "confirmed" ? "Bekräftad" : b.status === "cancelled" ? "Avbokad" : "Väntar";
    feedItems.push({
      id: `booking-${b.id}`,
      type: "booking",
      title: b.service_name || "Bokning",
      description: `${format(new Date(b.booking_date), "d MMM", { locale: sv })} kl ${b.start_time?.slice(0, 5)} — ${statusText}`,
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

  trialApps?.forEach((a: any) => {
    const statusText = a.status === "accepted" ? "Godkänd" : a.status === "rejected" ? "Nekad" : "Väntande";
    feedItems.push({
      id: `trial-app-${a.id}`,
      type: "trial_app",
      title: `Ansökan: ${a.trials?.title || "Provträning"}`,
      description: `${a.trials?.location || ""} — ${statusText}`,
      created_at: a.created_at,
      icon: Calendar,
    });
  });

  performance?.forEach((p: any) => {
    feedItems.push({
      id: `perf-${p.id}`,
      type: "performance",
      title: `Nytt testresultat: ${p.test_name}`,
      description: `${p.value} ${p.unit}`,
      created_at: p.created_at,
      icon: Dumbbell,
    });
  });

  highlights?.forEach((h) => {
    feedItems.push({
      id: `highlight-${h.id}`,
      type: "highlight",
      title: h.title || "Ny highlight",
      description: "Highlight uppladdad",
      created_at: h.created_at,
      icon: Video,
    });
  });

  stats?.forEach((s) => {
    feedItems.push({
      id: `stats-${s.id}`,
      type: "stats",
      title: `Statistik uppdaterad (${s.season})`,
      description: `${s.matches} matcher, ${s.goals} mål, ${s.assists} assist`,
      created_at: s.created_at,
      icon: BarChart3,
    });
  });

  feedItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const iconColor: Record<FeedItem["type"], string> = {
    trial_app: "text-primary",
    booking: "text-neon",
    connection: "text-accent-foreground",
    performance: "text-neon",
    highlight: "text-electric",
    stats: "text-muted-foreground",
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Min aktivitet</h1>
          <p className="text-sm text-muted-foreground mt-1">Dina senaste händelser och uppdateringar</p>
        </div>

        {feedItems.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Ingen aktivitet ännu. Börja med att fylla i din profil!</p>
          </div>
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
