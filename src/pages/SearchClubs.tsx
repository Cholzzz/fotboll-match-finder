import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X, Grid3X3, List, MapPin, Trophy, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const regions = [
  "Alla regioner", "Stockholm", "Göteborg", "Malmö", "Skåne", "Västra Götaland",
  "Östergötland", "Uppsala", "Norrbotten", "Västerbotten", "Jämtland",
  "Dalarna", "Gävleborg", "Södermanland", "Värmland", "Örebro",
  "Västmanland", "Halland", "Blekinge", "Kronoberg", "Kalmar", "Gotland"
];

const SearchClubs = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState("Alla regioner");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["clubs"],
    queryFn: async () => {
      // Get all user_ids with club role
      const { data: clubRoles, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "club");
      if (roleError) throw roleError;
      if (!clubRoles || clubRoles.length === 0) return [];

      const clubIds = clubRoles.map((r) => r.user_id);

      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", clubIds);
      if (profileError) throw profileError;

      // Get trial counts per club
      const { data: trials } = await supabase
        .from("trials")
        .select("club_user_id")
        .in("club_user_id", clubIds);

      const trialCounts: Record<string, number> = {};
      (trials || []).forEach((t: any) => {
        trialCounts[t.club_user_id] = (trialCounts[t.club_user_id] || 0) + 1;
      });

      return (profiles || []).map((p: any) => ({
        id: p.user_id,
        name: p.full_name,
        location: p.location || "",
        avatarUrl: p.avatar_url,
        bio: p.bio || "",
        trialCount: trialCounts[p.user_id] || 0,
      }));
    },
  });

  const filtered = clubs.filter((club) => {
    const matchesSearch = !searchQuery || club.name.toLowerCase().includes(searchQuery.toLowerCase()) || club.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = region === "Alla regioner" || club.location.toLowerCase().includes(region.toLowerCase());
    return matchesSearch && matchesRegion;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setRegion("Alla regioner");
  };

  const hasActiveFilters = searchQuery || region !== "Alla regioner";

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Sök klubbar</h1>
          <p className="text-muted-foreground">Hitta klubbar som söker spelare och har provträningar</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sök på klubbnamn eller ort..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          <div className="flex border border-border rounded-md">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="rounded-2xl border border-border bg-card p-4 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filter</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="mr-1 h-3 w-3" /> Rensa filter
                </Button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} klubbar hittade</p>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Inga klubbar hittades</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((club) => (
              <Link key={club.id} to={`/club/${club.id}`} className="block">
                <div className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={club.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                        {club.name?.charAt(0) || "K"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{club.name}</h3>
                      {club.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {club.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {club.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{club.bio}</p>
                  )}
                  <div className="flex gap-2">
                    {club.trialCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="mr-1 h-3 w-3" /> {club.trialCount} provträning{club.trialCount > 1 ? "ar" : ""}
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((club) => (
              <Link key={club.id} to={`/club/${club.id}`} className="block">
                <div className="rounded-xl border border-border bg-card p-4 hover:shadow-md transition-shadow flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={club.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {club.name?.charAt(0) || "K"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{club.name}</h3>
                    {club.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {club.location}
                      </p>
                    )}
                  </div>
                  {club.trialCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Calendar className="mr-1 h-3 w-3" /> {club.trialCount}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchClubs;
