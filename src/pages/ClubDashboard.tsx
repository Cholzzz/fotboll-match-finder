import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bookmark, BookmarkCheck, Search, SlidersHorizontal, Play, ArrowLeft, Users, Heart, Calendar } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  region: string;
  thumbnail: string;
  isSaved: boolean;
}

const mockPlayers: Player[] = [
  { id: "1", name: "Marcus Lindqvist", position: "Midfielder", age: 23, region: "Stockholm", thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop", isSaved: false },
  { id: "2", name: "Erik Johansson", position: "Forward", age: 21, region: "Göteborg", thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=500&fit=crop", isSaved: true },
  { id: "3", name: "Oscar Nilsson", position: "Defender", age: 25, region: "Malmö", thumbnail: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=400&h=500&fit=crop", isSaved: false },
  { id: "4", name: "Alexander Berg", position: "Goalkeeper", age: 22, region: "Uppsala", thumbnail: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=500&fit=crop", isSaved: false },
  { id: "5", name: "Johan Pettersson", position: "Midfielder", age: 24, region: "Stockholm", thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=500&fit=crop", isSaved: true },
  { id: "6", name: "Daniel Bergström", position: "Forward", age: 20, region: "Västerås", thumbnail: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=500&fit=crop", isSaved: false },
];

const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Forward"];
const regions = ["All", "Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås"];

export default function ClubDashboard() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(mockPlayers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<"discover" | "saved">("discover");

  const toggleSave = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = selectedPosition === "All" || player.position === selectedPosition;
    const matchesRegion = selectedRegion === "All" || player.region === selectedRegion;
    const matchesSaved = activeTab === "discover" || player.isSaved;
    return matchesSearch && matchesPosition && matchesRegion && matchesSaved;
  });

  const savedCount = players.filter((p) => p.isSaved).length;

  return (
    <>
      <Helmet>
        <title>Club Dashboard | Fotbollin</title>
        <meta
          name="description"
          content="Discover talented football players, save favorites, and invite them to trials on Fotbollin."
        />
      </Helmet>

      <div className="min-h-[100dvh] bg-background">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-dark p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display text-xl font-bold text-foreground">
              Club Dashboard
            </h1>
            <div className="w-9" />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                activeTab === "discover"
                  ? "bg-neon text-neon-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Discover
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                activeTab === "saved"
                  ? "bg-neon text-neon-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <Heart className="w-4 h-4 inline-block mr-2" />
              Saved ({savedCount})
            </button>
          </div>
        </header>

        {/* Search & Filters */}
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-0"
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-neon text-neon-foreground" : ""}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter chips */}
          {showFilters && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Position</p>
                <div className="flex flex-wrap gap-2">
                  {positions.map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setSelectedPosition(pos)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedPosition === pos
                          ? "bg-neon text-neon-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Region</p>
                <div className="flex flex-wrap gap-2">
                  {regions.map((reg) => (
                    <button
                      key={reg}
                      onClick={() => setSelectedRegion(reg)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedRegion === reg
                          ? "bg-neon text-neon-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="px-4 pb-2">
          <p className="text-sm text-muted-foreground">
            {filteredPlayers.length} player{filteredPlayers.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Player Grid */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              className="card-elevated overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4]">
                <img
                  src={player.thumbnail}
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
                <div className="video-overlay-gradient absolute inset-0" />

                {/* Play icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-neon/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-neon-foreground ml-0.5" />
                  </div>
                </div>

                {/* Save button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(player.id);
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                    player.isSaved
                      ? "bg-neon text-neon-foreground"
                      : "bg-background/50 backdrop-blur-sm text-foreground"
                  }`}
                >
                  {player.isSaved ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                {/* Player info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-semibold text-foreground text-sm truncate">
                    {player.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {player.position} · {player.age}y
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 space-y-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => navigate(`/player/${player.id}`)}
                >
                  View profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs border-neon/30 text-neon hover:bg-neon hover:text-neon-foreground"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  Invite to trial
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-16 px-4">
            <p className="text-muted-foreground">
              {activeTab === "saved"
                ? "No saved players yet. Start discovering!"
                : "No players match your filters."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}