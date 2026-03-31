import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, Calendar, Footprints, FileText, Play, MessageCircle,
  ArrowLeft, Users
} from "lucide-react";
import ConnectButton from "@/components/ConnectButton";
import { useConnectionCount } from "@/hooks/useConnections";
import { useAuth } from "@/contexts/AuthContext";

const PlayerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();

  // Log profile view
  const viewLogged = React.useRef(false);
  React.useEffect(() => {
    if (!id || viewLogged.current) return;
    viewLogged.current = true;
    (supabase as any).from("profile_views").insert({
      player_user_id: id,
      viewer_user_id: user?.id ?? null,
    });
  }, [id, user]);

  const { data: player, isLoading, error } = useQuery({
    queryKey: ["player-profile", id],
    queryFn: async () => {
      // id is user_id from the URL
      const { data: playerProfile, error: ppError } = await supabase
        .from("player_profiles")
        .select("*")
        .eq("user_id", id!)
        .maybeSingle();

      if (ppError) throw ppError;
      if (!playerProfile) throw new Error("Spelaren hittades inte");

      const { data: profile, error: prError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", id!)
        .maybeSingle();

      if (prError) throw prError;

      const { data: highlights } = await supabase
        .from("highlights")
        .select("*")
        .eq("user_id", id!)
        .order("created_at", { ascending: false });

      return {
        ...playerProfile,
        name: profile?.full_name || "Okänd spelare",
        avatarUrl: profile?.avatar_url,
        location: profile?.location,
        profileBio: profile?.bio,
        highlights: highlights || [],
      };
    },
    enabled: !!id,
  });

  const { data: connectionCount = 0 } = useConnectionCount(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (error || !player) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Spelaren hittades inte</h2>
          <p className="text-muted-foreground mb-6">Profilen kan ha tagits bort eller finns inte.</p>
          <Link to="/search">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka till sökning
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const initials = player.name.split(" ").map((n: string) => n[0]).join("");

  return (
    <Layout>
      <div className="container py-8">
        {/* Profile Header */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="bg-foreground p-8 pb-24" />
          
          <div className="px-6 md:px-8 pb-6 -mt-16">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              <div className="w-28 h-28 rounded-2xl bg-neon border-4 border-card flex items-center justify-center flex-shrink-0 overflow-hidden">
                {player.avatarUrl ? (
                  <img src={player.avatarUrl} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-4xl font-bold text-neon-foreground">{initials}</span>
                )}
              </div>

              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {player.name}
                </h1>
                <p className="text-muted-foreground text-lg">{player.position || "Position ej angiven"}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                  {player.age && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" /> {player.age} år
                    </span>
                  )}
                  {player.preferred_foot && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Footprints className="h-4 w-4" /> {player.preferred_foot} fot
                    </span>
                  )}
                  {player.region && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {player.region}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:ml-auto">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" /> {connectionCount} kontakter
                </span>
                <ConnectButton targetUserId={id!} size="lg" />
                <Link to={`/messages?to=${id}`}>
                  <Button variant="neon" size="lg">
                    <MessageCircle className="mr-2 h-4 w-4" /> Kontakta spelare
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8">
          <Tabs defaultValue="highlights" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger value="highlights" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3">
                <Play className="h-4 w-4 mr-2" /> Highlights
              </TabsTrigger>
              <TabsTrigger value="about" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3">
                <FileText className="h-4 w-4 mr-2" /> Om
              </TabsTrigger>
            </TabsList>

            <TabsContent value="highlights" className="mt-6">
              {player.highlights.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {player.highlights.map((video: any) => (
                    <div key={video.id} className="group relative aspect-video rounded-2xl bg-foreground overflow-hidden cursor-pointer">
                      <video src={video.video_url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-16 h-16 rounded-full bg-background/20 flex items-center justify-center group-hover:bg-neon group-hover:scale-110 transition-all">
                          <Play className="h-7 w-7 text-background ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/90 to-transparent">
                        <p className="font-medium text-background">{video.title || "Highlight"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Inga highlights uppladdade ännu.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Om mig</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {player.bio || player.profileBio || "Ingen bio har lagts till ännu."}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display font-semibold text-foreground mb-4">Personlig info</h3>
                  <dl className="space-y-3">
                    {player.age && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Ålder</dt>
                        <dd className="font-medium text-foreground">{player.age} år</dd>
                      </div>
                    )}
                    {player.preferred_foot && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Starkaste fot</dt>
                        <dd className="font-medium text-foreground">{player.preferred_foot}</dd>
                      </div>
                    )}
                    {player.region && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Region</dt>
                        <dd className="font-medium text-foreground">{player.region}</dd>
                      </div>
                    )}
                    {player.position && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Position</dt>
                        <dd className="font-medium text-foreground">{player.position}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default PlayerProfile;
