import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Grid3X3, List, Bookmark, BookmarkCheck,
  MapPin, Eye, X, Calendar, Users, Building2, Save
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import AvatarUpload from "@/components/AvatarUpload";

const ClubDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  // Club profile editing state
  const [clubName, setClubName] = useState("");
  const [clubBio, setClubBio] = useState("");
  const [clubLocation, setClubLocation] = useState("");
  const [clubPhone, setClubPhone] = useState("");
  const [clubAvatarUrl, setClubAvatarUrl] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Fetch club profile
  useQuery({
    queryKey: ["club-own-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (data) {
        setClubName(data.full_name);
        setClubBio(data.bio || "");
        setClubLocation(data.location || "");
        setClubPhone(data.phone || "");
        setClubAvatarUrl(data.avatar_url);
        setProfileLoaded(true);
      }
      return data;
    },
    enabled: !!user,
  });

  // Fetch real players from DB
  const { data: players = [], isLoading } = useQuery({
    queryKey: ["club-dashboard-players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_profiles")
        .select("*, profiles!inner(full_name, avatar_url, user_id)");
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: p.user_id,
        name: p.profiles.full_name,
        position: p.position || "Okänd",
        age: p.age || 0,
        region: p.region || "Okänd",
        avatarUrl: p.profiles.avatar_url,
      }));
    },
  });

  // Fetch saved players from DB
  const { data: savedPlayerIds = new Set<string>() } = useQuery({
    queryKey: ["saved-players", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("saved_players")
        .select("player_user_id")
        .eq("club_user_id", user!.id);
      return new Set((data || []).map((r: any) => r.player_user_id));
    },
    enabled: !!user,
  });

  const saveMutation = useMutation({
    mutationFn: async (playerId: string) => {
      if (savedPlayerIds.has(playerId)) {
        await supabase
          .from("saved_players")
          .delete()
          .eq("club_user_id", user!.id)
          .eq("player_user_id", playerId);
      } else {
        await supabase.from("saved_players").insert({
          club_user_id: user!.id,
          player_user_id: playerId,
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-players"] }),
  });

  // Fetch club's trials
  const { data: myTrials = [] } = useQuery({
    queryKey: ["club-trials", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("trials")
        .select("*")
        .eq("club_user_id", user.id)
        .order("trial_date", { ascending: true });
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch trial applications for club's trials
  const { data: trialApplications = [] } = useQuery({
    queryKey: ["club-trial-applications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data: trials } = await supabase
        .from("trials")
        .select("id")
        .eq("club_user_id", user.id);
      if (!trials?.length) return [];
      const trialIds = trials.map((t: any) => t.id);
      const { data } = await supabase
        .from("trial_applications")
        .select("*, trials(title, trial_date, location)")
        .in("trial_id", trialIds)
        .order("created_at", { ascending: false });
      
      if (!data?.length) return [];
      const playerIds = [...new Set(data.map((a: any) => a.player_user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", playerIds);
      const profileMap = Object.fromEntries(
        (profiles || []).map((p: any) => [p.user_id, p])
      );
      return data.map((a: any) => ({
        ...a,
        playerName: profileMap[a.player_user_id]?.full_name || "Okänd",
        playerAvatar: profileMap[a.player_user_id]?.avatar_url || null,
      }));
    },
    enabled: !!user,
  });

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: clubName,
        bio: clubBio || null,
        location: clubLocation || null,
        phone: clubPhone || null,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sparad!", description: "Klubbprofilen har uppdaterats." });
    }
    setSavingProfile(false);
  };

  const filteredPlayers = players.filter((player: any) => {
    if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (positionFilter !== "all" && player.position !== positionFilter) return false;
    if (ageFilter !== "all") {
      const [min, max] = ageFilter.split("-").map(Number);
      if (player.age < min || player.age > max) return false;
    }
    if (regionFilter !== "all" && player.region !== regionFilter) return false;
    return true;
  });

  const savedPlayers = players.filter((p: any) => savedPlayerIds.has(p.id));
  const uniquePositions = [...new Set(players.map((p: any) => p.position).filter((p: string) => p !== "Okänd"))];
  const uniqueRegions = [...new Set(players.map((p: any) => p.region).filter((r: string) => r !== "Okänd"))];
  const initials = (name: string) => name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Klubb Dashboard</h1>
          <p className="text-muted-foreground mt-2">Sök och hantera spelare för din klubb</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{players.length}</p>
            <p className="text-xs text-muted-foreground">Registrerade spelare</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{savedPlayers.length}</p>
            <p className="text-xs text-muted-foreground">Bevakade</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{myTrials.length}</p>
            <p className="text-xs text-muted-foreground">Provträningar</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{trialApplications.filter((a: any) => a.status === "pending").length}</p>
            <p className="text-xs text-muted-foreground">Nya ansökningar</p>
          </div>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="search" className="gap-2">
              <Search className="h-4 w-4" /> Sök spelare
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="gap-2">
              <Bookmark className="h-4 w-4" /> Bevakningslista
              {savedPlayers.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-neon text-neon-foreground text-xs font-medium">
                  {savedPlayers.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="trials" className="gap-2">
              <Calendar className="h-4 w-4" /> Provträningar
            </TabsTrigger>
            <TabsTrigger value="club-profile" className="gap-2">
              <Building2 className="h-4 w-4" /> Klubbprofil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <div className="rounded-2xl border border-border bg-card p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Sök spelare..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="Position" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla positioner</SelectItem>
                      {uniquePositions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger className="w-[130px]"><SelectValue placeholder="Ålder" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla åldrar</SelectItem>
                      <SelectItem value="15-18">15-18 år</SelectItem>
                      <SelectItem value="18-21">18-21 år</SelectItem>
                      <SelectItem value="21-25">21-25 år</SelectItem>
                      <SelectItem value="25-30">25-30 år</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Region" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla regioner</SelectItem>
                      {uniqueRegions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <button onClick={() => setViewMode("grid")} className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-muted"}`}>
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button onClick={() => setViewMode("list")} className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "hover:bg-muted"}`}>
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{filteredPlayers.length} spelare hittade</p>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlayers.map((player: any) => (
                  <div key={player.id} className="rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 rounded-xl">
                          <AvatarImage src={player.avatarUrl || undefined} />
                          <AvatarFallback className="rounded-xl bg-foreground text-background font-display text-lg">{initials(player.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{player.name}</h3>
                          <p className="text-sm text-muted-foreground">{player.position} • {player.age} år</p>
                        </div>
                      </div>
                      <button onClick={() => saveMutation.mutate(player.id)} className={`p-2 rounded-lg transition-colors ${savedPlayerIds.has(player.id) ? "text-neon" : "text-muted-foreground hover:text-foreground"}`}>
                        {savedPlayerIds.has(player.id) ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" /> {player.region}
                    </div>
                    <Link to={`/player/${player.id}`}>
                      <Button variant="outline" className="w-full"><Eye className="mr-2 h-4 w-4" /> Visa profil</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <table className="data-table">
                  <thead><tr><th>Spelare</th><th>Position</th><th>Ålder</th><th>Region</th><th></th></tr></thead>
                  <tbody>
                    {filteredPlayers.map((player: any) => (
                      <tr key={player.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 rounded-lg">
                              <AvatarImage src={player.avatarUrl || undefined} />
                              <AvatarFallback className="rounded-lg bg-foreground text-background text-xs">{initials(player.name)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-foreground">{player.name}</span>
                          </div>
                        </td>
                        <td>{player.position}</td>
                        <td>{player.age} år</td>
                        <td>{player.region}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button onClick={() => saveMutation.mutate(player.id)} className={`p-1.5 rounded transition-colors ${savedPlayerIds.has(player.id) ? "text-neon" : "text-muted-foreground hover:text-foreground"}`}>
                              {savedPlayerIds.has(player.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                            </button>
                            <Link to={`/player/${player.id}`}><Button variant="ghost" size="sm">Visa</Button></Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="watchlist">
            {savedPlayers.length === 0 ? (
              <div className="text-center py-16">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Din bevakningslista är tom</h3>
                <p className="text-muted-foreground">Spara spelare du vill följa upp.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPlayers.map((player: any) => (
                  <div key={player.id} className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 rounded-xl">
                        <AvatarImage src={player.avatarUrl || undefined} />
                        <AvatarFallback className="rounded-xl bg-foreground text-background font-display text-xl">{initials(player.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{player.name}</h3>
                        <p className="text-sm text-muted-foreground">{player.position} • {player.age} år • {player.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/player/${player.id}`}><Button variant="outline" size="sm">Visa profil</Button></Link>
                      <button onClick={() => saveMutation.mutate(player.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trials">
            {myTrials.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Inga provträningar</h3>
                <p className="text-muted-foreground mb-6">Skapa din första provträning under Provträningar-sidan.</p>
                <Link to="/trials"><Button variant="neon">Gå till provträningar</Button></Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {myTrials.map((trial: any) => (
                  <div key={trial.id} className="rounded-2xl border border-border bg-card p-5">
                    <h3 className="font-display font-semibold text-foreground mb-2">{trial.title || "Provträning"}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" /> {trial.trial_date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <MapPin className="h-4 w-4" /> {trial.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" /> Max {trial.max_spots} platser
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="club-profile">
            <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
              <div className="flex flex-col items-center gap-4">
                {profileLoaded && (
                  <AvatarUpload userId={user!.id} currentUrl={clubAvatarUrl} onUploaded={setClubAvatarUrl} name={clubName} />
                )}
                <h2 className="font-display text-xl font-semibold text-foreground">Redigera klubbprofil</h2>
              </div>
              <div className="space-y-2">
                <Label>Klubbnamn</Label>
                <Input value={clubName} onChange={(e) => setClubName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Plats</Label>
                <Input placeholder="T.ex. Stockholm" value={clubLocation} onChange={(e) => setClubLocation(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input placeholder="070-XXX XX XX" value={clubPhone} onChange={(e) => setClubPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Om klubben</Label>
                <Textarea placeholder="Beskriv klubben..." value={clubBio} onChange={(e) => setClubBio(e.target.value)} rows={4} />
              </div>
              <Button onClick={handleSaveProfile} disabled={savingProfile} className="w-full" size="lg">
                <Save className="mr-2 h-4 w-4" /> {savingProfile ? "Sparar..." : "Spara profil"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClubDashboard;
