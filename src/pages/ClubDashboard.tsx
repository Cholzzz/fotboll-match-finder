import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Bookmark, 
  BookmarkCheck,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  StickyNote,
  X
} from "lucide-react";

const mockPlayers = [
  { 
    id: "1", 
    name: "Erik Lindqvist", 
    position: "CM", 
    age: 23, 
    region: "Stockholm",
    contractStatus: "Kontraktslös",
    stats: { matches: 28, goals: 7, assists: 12 },
    saved: true
  },
  { 
    id: "2", 
    name: "Marcus Andersson", 
    position: "ST", 
    age: 21, 
    region: "Göteborg",
    contractStatus: "Kontraktslös",
    stats: { matches: 24, goals: 15, assists: 4 },
    saved: false
  },
  { 
    id: "3", 
    name: "Johan Svensson", 
    position: "CB", 
    age: 24, 
    region: "Malmö",
    contractStatus: "Utgår 2024",
    stats: { matches: 30, goals: 2, assists: 1 },
    saved: true
  },
  { 
    id: "4", 
    name: "Oscar Nilsson", 
    position: "LW", 
    age: 19, 
    region: "Stockholm",
    contractStatus: "Kontraktslös",
    stats: { matches: 18, goals: 8, assists: 6 },
    saved: false
  },
  { 
    id: "5", 
    name: "Alexander Berg", 
    position: "RB", 
    age: 22, 
    region: "Uppsala",
    contractStatus: "Kontraktslös",
    stats: { matches: 26, goals: 1, assists: 9 },
    saved: false
  },
  { 
    id: "6", 
    name: "Viktor Holm", 
    position: "GK", 
    age: 25, 
    region: "Stockholm",
    contractStatus: "Utgår 2024",
    stats: { matches: 28, goals: 0, assists: 0 },
    saved: false
  },
];

const watchlistNotes = [
  { playerId: "1", note: "Bra speluppfattning, passar vår spelidé. Boka in provträning efter säsongen." },
  { playerId: "3", note: "Stabil försvarare, behöver se mer video." },
];

const ClubDashboard = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [players, setPlayers] = useState(mockPlayers);
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");

  const toggleSave = (playerId: string) => {
    setPlayers(players.map(p => 
      p.id === playerId ? { ...p, saved: !p.saved } : p
    ));
  };

  const filteredPlayers = players.filter(player => {
    if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (positionFilter !== "all" && player.position !== positionFilter) {
      return false;
    }
    if (ageFilter !== "all") {
      const [min, max] = ageFilter.split("-").map(Number);
      if (player.age < min || player.age > max) return false;
    }
    if (regionFilter !== "all" && player.region !== regionFilter) {
      return false;
    }
    return true;
  });

  const savedPlayers = players.filter(p => p.saved);

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Klubb Dashboard</h1>
          <p className="text-muted-foreground mt-2">Sök och hantera spelare för din klubb</p>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="search" className="gap-2">
              <Search className="h-4 w-4" />
              Sök spelare
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Bevakningslista
              {savedPlayers.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-neon text-neon-foreground text-xs font-medium">
                  {savedPlayers.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search">
            {/* Filters */}
            <div className="rounded-2xl border border-border bg-card p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Sök spelare..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Select value={positionFilter} onValueChange={setPositionFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla positioner</SelectItem>
                      <SelectItem value="GK">Målvakt</SelectItem>
                      <SelectItem value="CB">Mittback</SelectItem>
                      <SelectItem value="RB">Högerback</SelectItem>
                      <SelectItem value="LB">Vänsterback</SelectItem>
                      <SelectItem value="DM">Defensiv mitt</SelectItem>
                      <SelectItem value="CM">Central mitt</SelectItem>
                      <SelectItem value="AM">Offensiv mitt</SelectItem>
                      <SelectItem value="RW">Högerving</SelectItem>
                      <SelectItem value="LW">Vänsterving</SelectItem>
                      <SelectItem value="ST">Anfallare</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={ageFilter} onValueChange={setAgeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Ålder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla åldrar</SelectItem>
                      <SelectItem value="15-18">15-18 år</SelectItem>
                      <SelectItem value="18-21">18-21 år</SelectItem>
                      <SelectItem value="21-25">21-25 år</SelectItem>
                      <SelectItem value="25-28">25-28 år</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alla regioner</SelectItem>
                      <SelectItem value="Stockholm">Stockholm</SelectItem>
                      <SelectItem value="Göteborg">Göteborg</SelectItem>
                      <SelectItem value="Malmö">Malmö</SelectItem>
                      <SelectItem value="Uppsala">Uppsala</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-foreground text-background" : "hover:bg-muted"}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-foreground text-background" : "hover:bg-muted"}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{filteredPlayers.length} spelare hittade</p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlayers.map((player) => (
                  <div key={player.id} className="rounded-2xl border border-border bg-card p-5 hover:border-foreground/20 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
                          <span className="font-display text-lg font-bold text-background">
                            {player.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{player.name}</h3>
                          <p className="text-sm text-muted-foreground">{player.position} • {player.age} år</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSave(player.id)}
                        className={`p-2 rounded-lg transition-colors ${player.saved ? "text-neon" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {player.saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      {player.region}
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span className="px-2 py-1 rounded bg-muted text-xs font-medium">
                        {player.stats.matches} matcher
                      </span>
                      <span className="px-2 py-1 rounded bg-muted text-xs font-medium">
                        {player.stats.goals} mål
                      </span>
                      <span className="px-2 py-1 rounded bg-muted text-xs font-medium">
                        {player.stats.assists} assist
                      </span>
                    </div>

                    <span className="inline-flex px-2 py-1 rounded bg-neon/10 text-neon text-xs font-medium mb-4">
                      {player.contractStatus}
                    </span>

                    <Link to={`/player/${player.id}`}>
                      <Button variant="outline" className="w-full">
                        <Eye className="mr-2 h-4 w-4" />
                        Visa profil
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Spelare</th>
                      <th>Position</th>
                      <th>Ålder</th>
                      <th>Region</th>
                      <th>Statistik</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.map((player) => (
                      <tr key={player.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                              <span className="font-display text-xs font-bold text-background">
                                {player.name.split(" ").map(n => n[0]).join("")}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">{player.name}</span>
                          </div>
                        </td>
                        <td>{player.position}</td>
                        <td>{player.age} år</td>
                        <td>{player.region}</td>
                        <td>
                          <span className="text-xs text-muted-foreground">
                            {player.stats.goals}M, {player.stats.assists}A
                          </span>
                        </td>
                        <td>
                          <span className="px-2 py-1 rounded bg-neon/10 text-neon text-xs font-medium">
                            {player.contractStatus}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSave(player.id)}
                              className={`p-1.5 rounded transition-colors ${player.saved ? "text-neon" : "text-muted-foreground hover:text-foreground"}`}
                            >
                              {player.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                            </button>
                            <Link to={`/player/${player.id}`}>
                              <Button variant="ghost" size="sm">
                                Visa
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist">
            {savedPlayers.length === 0 ? (
              <div className="text-center py-16">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Din bevakningslista är tom
                </h3>
                <p className="text-muted-foreground mb-6">
                  Spara spelare du vill följa upp för att se dem här.
                </p>
                <Button variant="outline" onClick={() => {}}>
                  Sök spelare
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPlayers.map((player) => {
                  const note = watchlistNotes.find(n => n.playerId === player.id);
                  return (
                    <div key={player.id} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-foreground flex items-center justify-center">
                            <span className="font-display text-xl font-bold text-background">
                              {player.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-lg">{player.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {player.position} • {player.age} år • {player.region}
                            </p>
                            <div className="flex gap-3 mt-2">
                              <span className="text-sm text-muted-foreground">
                                <strong className="text-foreground">{player.stats.matches}</strong> matcher
                              </span>
                              <span className="text-sm text-muted-foreground">
                                <strong className="text-foreground">{player.stats.goals}</strong> mål
                              </span>
                              <span className="text-sm text-muted-foreground">
                                <strong className="text-foreground">{player.stats.assists}</strong> assist
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Link to={`/player/${player.id}`}>
                            <Button variant="outline" size="sm">
                              Visa profil
                            </Button>
                          </Link>
                          <button
                            onClick={() => toggleSave(player.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {note && (
                        <div className="mt-4 p-3 rounded-lg bg-muted/50 flex items-start gap-2">
                          <StickyNote className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-muted-foreground">{note.note}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ClubDashboard;