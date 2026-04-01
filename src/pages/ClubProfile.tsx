import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Users, Trophy, Calendar, ArrowLeft } from "lucide-react";

const ClubProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: club, isLoading } = useQuery({
    queryKey: ["club-profile", id],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", id!)
        .maybeSingle();

      if (!profile) throw new Error("Klubb hittades inte");

      // Count active trials
      const { count: trialCount } = await supabase
        .from("trials")
        .select("*", { count: "exact", head: true })
        .eq("club_user_id", id!);

      return {
        ...profile,
        trialCount: trialCount || 0,
      };
    },
    enabled: !!id,
  });

  // Fetch club's trials
  const { data: trials = [] } = useQuery({
    queryKey: ["club-trials-profile", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("trials")
        .select("*")
        .eq("club_user_id", id!)
        .order("trial_date", { ascending: true });
      return data || [];
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (!club) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Klubb hittades inte</h2>
          <Link to="/search">
            <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Tillbaka</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const initials = club.full_name?.split(" ")[0]?.substring(0, 3)?.toUpperCase() || "?";

  return (
    <Layout>
      <div className="container py-8">
        {/* Profile Header */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="bg-foreground p-8 pb-20" />
          
          <div className="px-6 md:px-8 pb-6 -mt-12">
            <div className="flex flex-col md:flex-row md:items-end gap-5">
              <div className="w-24 h-24 rounded-2xl bg-background border-4 border-card flex items-center justify-center flex-shrink-0 overflow-hidden">
                {club.avatar_url ? (
                  <img src={club.avatar_url} alt={club.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-2xl font-bold text-foreground">{initials}</span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {club.full_name}
                </h1>
                <div className="flex flex-wrap gap-4 mt-3">
                  {club.location && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {club.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" /> {club.trialCount} aktiva provträningar
                  </span>
                </div>
              </div>

              <div className="md:ml-auto flex gap-2">
                <Link to={`/messages?to=${id}`}>
                  <Button variant="neon" size="lg">Kontakta klubb</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {club.bio && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">Om klubben</h2>
                <p className="text-muted-foreground leading-relaxed">{club.bio}</p>
              </div>
            )}

            {/* Trials */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Provträningar</h2>
              {trials.length === 0 ? (
                <p className="text-muted-foreground text-sm">Inga provträningar publicerade.</p>
              ) : (
                <div className="space-y-3">
                  {trials.map((trial: any) => (
                    <div key={trial.id} className="p-4 rounded-xl bg-muted">
                      <h3 className="font-semibold text-foreground text-sm">{trial.title || "Provträning"}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {trial.trial_date} • {trial.start_time?.slice(0, 5)} - {trial.end_time?.slice(0, 5)} • {trial.location}
                      </p>
                      {Array.isArray(trial.positions) && trial.positions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {trial.positions.map((pos: string) => (
                            <span key={pos} className="px-2 py-0.5 rounded bg-neon/10 text-neon text-xs">{pos}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" /> Kontakt
              </h3>
              {club.phone && (
                <p className="text-sm text-muted-foreground mb-2">📞 {club.phone}</p>
              )}
              <Link to={`/messages?to=${id}`}>
                <Button variant="outline" className="w-full mt-2">Skicka meddelande</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClubProfile;
