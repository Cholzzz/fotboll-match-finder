import { useState } from "react";
import Layout from "@/components/layout/Layout";
import PlayerCard from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

const mockPlayers = [
  { id: "1", name: "Erik Lindqvist", position: "Central mittfältare", age: 23, region: "Stockholm" },
  { id: "2", name: "Marcus Eriksson", position: "Anfallare", age: 21, region: "Göteborg" },
  { id: "3", name: "Oscar Nilsson", position: "Högerback", age: 25, region: "Malmö" },
  { id: "4", name: "Viktor Andersson", position: "Målvakt", age: 22, region: "Uppsala" },
  { id: "5", name: "Johan Pettersson", position: "Mittback", age: 24, region: "Stockholm" },
  { id: "6", name: "Alexander Holm", position: "Ytter mittfältare", age: 20, region: "Västerås" },
  { id: "7", name: "Daniel Bergström", position: "Defensiv mittfältare", age: 26, region: "Göteborg" },
  { id: "8", name: "Filip Johansson", position: "Vänsterback", age: 23, region: "Malmö" },
];

const positions = [
  "Alla positioner",
  "Målvakt",
  "Högerback",
  "Mittback",
  "Vänsterback",
  "Defensiv mittfältare",
  "Central mittfältare",
  "Ytter mittfältare",
  "Anfallare",
];

const regions = [
  "Alla regioner",
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Västerås",
  "Örebro",
  "Linköping",
];

const contractStatuses = [
  "Alla",
  "Kontraktslös",
  "Kontrakt löper ut",
  "Under kontrakt",
];

const SearchPlayers = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState("Alla positioner");
  const [region, setRegion] = useState("Alla regioner");
  const [ageRange, setAgeRange] = useState({ min: "", max: "" });
  const [contractStatus, setContractStatus] = useState("Alla");

  const filteredPlayers = mockPlayers.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = position === "Alla positioner" || player.position === position;
    const matchesRegion = region === "Alla regioner" || player.region === region;
    const matchesAge =
      (!ageRange.min || player.age >= parseInt(ageRange.min)) &&
      (!ageRange.max || player.age <= parseInt(ageRange.max));
    return matchesSearch && matchesPosition && matchesRegion && matchesAge;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setPosition("Alla positioner");
    setRegion("Alla regioner");
    setAgeRange({ min: "", max: "" });
    setContractStatus("Alla");
  };

  const hasActiveFilters =
    searchQuery ||
    position !== "Alla positioner" ||
    region !== "Alla regioner" ||
    ageRange.min ||
    ageRange.max ||
    contractStatus !== "Alla";

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Sök spelare</h1>
          <p className="text-muted-foreground mt-2">
            Hitta talanger som passar ditt lags behov
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="rounded-2xl border border-border bg-card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Rensa
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm">Position</Label>
                  <Select value={position} onValueChange={setPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Ålder</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Från"
                      value={ageRange.min}
                      onChange={(e) => setAgeRange({ ...ageRange, min: e.target.value })}
                      min="16"
                      max="45"
                    />
                    <Input
                      type="number"
                      placeholder="Till"
                      value={ageRange.max}
                      onChange={(e) => setAgeRange({ ...ageRange, max: e.target.value })}
                      min="16"
                      max="45"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((reg) => (
                        <SelectItem key={reg} value={reg}>
                          {reg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Kontraktsstatus</Label>
                  <Select value={contractStatus} onValueChange={setContractStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {contractStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Sök på spelarnamn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden rounded-2xl border border-border bg-card p-5 mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-foreground">Filter</h2>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Position</Label>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Region</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((reg) => (
                          <SelectItem key={reg} value={reg}>
                            {reg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4 w-full">
                    Rensa filter
                  </Button>
                )}
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-4">
              {filteredPlayers.length} spelare hittades
            </p>

            {/* Player Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPlayers.map((player) => (
                <PlayerCard key={player.id} {...player} />
              ))}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Inga spelare matchade din sökning</p>
                <Button variant="ghost" onClick={clearFilters} className="mt-4">
                  Rensa filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPlayers;