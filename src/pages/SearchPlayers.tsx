import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PlayerCard from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Grid3X3, List, MapPin, Footprints } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const positions = [
  "Alla positioner", "Målvakt", "Högerback", "Mittback", "Vänsterback",
  "Defensiv mittfältare", "Central mittfältare", "Offensiv mittfältare",
  "Högerytter", "Vänsterytter", "Anfallare", "Second striker",
];

const regions = [
  "Alla regioner", "Stockholm", "Göteborg", "Malmö", "Skåne", "Västra Götaland",
  "Östergötland", "Uppsala", "Norrbotten", "Västerbotten", "Jämtland",
  "Dalarna", "Gävleborg", "Södermanland", "Värmland", "Örebro",
  "Västmanland", "Halland", "Blekinge", "Kronoberg", "Kalmar", "Gotland"
];

const footOptions = ["Alla", "Höger", "Vänster", "Båda"];

const SearchPlayers = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState("Alla positioner");
  const [region, setRegion] = useState("Alla regioner");
  const [ageRange, setAgeRange] = useState({ min: "", max: "" });
  const [foot, setFoot] = useState("Alla");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: players = [], isLoading, error } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_profiles")
        .select("*, profiles!inner(full_name, avatar_url, user_id)");
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: p.user_id,
        name: p.profiles.full_name,
        position: p.position || "Okänd position",
        age: p.age || 0,
        region: p.region || "Okänd region",
        imageUrl: p.profiles.avatar_url || undefined,
        preferredFoot: p.preferred_foot || "",
        contractStatus: (p as any).contract_status || "free_agent",
        visibility: (p as any).visibility || "visible",
      }));
    },
  });

  // Only show visible players
  const visiblePlayers = players.filter((p) => p.visibility !== "hidden");

  const filteredPlayers = visiblePlayers.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = position === "Alla positioner" || player.position === position;
    const matchesRegion = region === "Alla regioner" || player.region === region;
    const matchesFoot = foot === "Alla" || player.preferredFoot === foot;
    const matchesAge =
      (!ageRange.min || player.age >= parseInt(ageRange.min)) &&
      (!ageRange.max || player.age <= parseInt(ageRange.max));
    return matchesSearch && matchesPosition && matchesRegion && matchesAge && matchesFoot;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setPosition("Alla positioner");
    setRegion("Alla regioner");
    setAgeRange({ min: "", max: "" });
    setFoot("Alla");
  };

  const hasActiveFilters =
    searchQuery || position !== "Alla positioner" || region !== "Alla regioner" ||
    ageRange.min || ageRange.max || foot !== "Alla";

  const initials = (name: string) => name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Sök spelare</h1>
          <p className="text-muted-foreground mt-2">Hitta talanger som passar ditt lags behov</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="rounded-2xl border border-border bg-card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filter
                </h2>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <X className="h-3 w-3" /> Rensa
                  </button>
                )}
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm">Position</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (<SelectItem key={pos} value={pos}>{pos}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Ålder</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Från" value={ageRange.min} onChange={(e) => setAgeRange({ ...ageRange, min: e.target.value })} min="15" max="45" />
                    <Input type="number" placeholder="Till" value={ageRange.max} onChange={(e) => setAgeRange({ ...ageRange, max: e.target.value })} min="15" max="45" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {regions.map((reg) => (<SelectItem key={reg} value={reg}>{reg}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Stark fot</Label>
                  <Select value={foot} onValueChange={setFoot}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {footOptions.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Sök på spelarnamn..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-muted"}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")}
                  className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "hover:bg-muted"}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filter
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden rounded-2xl border border-border bg-card p-5 mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-foreground">Filter</h2>
                  <button onClick={() => setShowFilters(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Position</Label>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{positions.map((pos) => (<SelectItem key={pos} value={pos}>{pos}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Region</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{regions.map((reg) => (<SelectItem key={reg} value={reg}>{reg}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Stark fot</Label>
                    <Select value={foot} onValueChange={setFoot}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{footOptions.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4 w-full">Rensa filter</Button>
                )}
              </div>
            )}

            {/* Results */}
            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-5 rounded-2xl border border-border bg-card">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-14 w-14 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive">Kunde inte hämta spelare. Försök igen senare.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">{filteredPlayers.length} spelare hittades</p>

                {viewMode === "grid" ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredPlayers.map((player) => (
                      <PlayerCard key={player.id} {...player} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">Spelare</th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">Position</th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">Ålder</th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">Region</th>
                          <th className="text-left p-3 text-sm font-medium text-muted-foreground">Fot</th>
                          <th className="p-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlayers.map((player) => (
                          <tr key={player.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 rounded-lg">
                                  <AvatarImage src={player.imageUrl} />
                                  <AvatarFallback className="rounded-lg bg-foreground text-background text-xs">
                                    {initials(player.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-foreground text-sm">{player.name}</span>
                              </div>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">{player.position}</td>
                            <td className="p-3 text-sm text-muted-foreground">{player.age} år</td>
                            <td className="p-3 text-sm text-muted-foreground">{player.region}</td>
                            <td className="p-3 text-sm text-muted-foreground">{player.preferredFoot || "–"}</td>
                            <td className="p-3">
                              <Link to={`/player/${player.id}`}>
                                <Button variant="ghost" size="sm">Visa</Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {filteredPlayers.length === 0 && (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground">Inga spelare matchade din sökning</p>
                    <Button variant="ghost" onClick={clearFilters} className="mt-4">Rensa filter</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPlayers;
