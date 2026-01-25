import { useState } from "react";
import Layout from "@/components/layout/Layout";
import StaffCard, { StaffRole, StaffCardProps } from "@/components/StaffCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Users } from "lucide-react";

const mockStaff: StaffCardProps[] = [
  { 
    id: "s1", 
    name: "Anders Johansson", 
    role: "coach", 
    specialization: "Ungdomsutveckling",
    experience: 15,
    region: "Stockholm",
    certifications: ["UEFA A-licens", "SvFF Elitlicens"]
  },
  { 
    id: "s2", 
    name: "Maria Lindberg", 
    role: "physio", 
    specialization: "Idrottsskador & Rehabilitering",
    experience: 10,
    region: "Göteborg",
    certifications: ["Leg. Fysioterapeut", "Sportmedicin"]
  },
  { 
    id: "s3", 
    name: "Erik Sundqvist", 
    role: "analyst", 
    specialization: "Videoanalys & Taktik",
    experience: 7,
    region: "Malmö",
    certifications: ["UEFA B-licens", "Data Analytics"]
  },
  { 
    id: "s4", 
    name: "Sofia Bergström", 
    role: "scout", 
    specialization: "Skandinavisk talangspaning",
    experience: 12,
    region: "Stockholm",
    certifications: ["SvFF Scoututbildning"]
  },
  { 
    id: "s5", 
    name: "Johan Ekström", 
    role: "coach", 
    specialization: "Fysisk träning & Kondition",
    experience: 8,
    region: "Uppsala",
    certifications: ["UEFA B-licens", "Strength & Conditioning"]
  },
  { 
    id: "s6", 
    name: "Emma Karlsson", 
    role: "nutritionist", 
    specialization: "Idrottsnutrition",
    experience: 6,
    region: "Stockholm",
    certifications: ["Leg. Dietist", "Sports Nutrition Cert."]
  },
  { 
    id: "s7", 
    name: "Peter Holmgren", 
    role: "physio", 
    specialization: "Prestationsoptimering",
    experience: 14,
    region: "Göteborg",
    certifications: ["Leg. Fysioterapeut", "Manual Terapi"]
  },
  { 
    id: "s8", 
    name: "Anna Nilsson", 
    role: "analyst", 
    specialization: "Motståndaranalys",
    experience: 5,
    region: "Malmö",
    certifications: ["SvFF Analytikerutbildning"]
  },
];

const roleOptions: { value: StaffRole | "all"; label: string }[] = [
  { value: "all", label: "Alla roller" },
  { value: "coach", label: "Tränare" },
  { value: "physio", label: "Fysioterapeut" },
  { value: "analyst", label: "Analytiker" },
  { value: "scout", label: "Scout" },
  { value: "nutritionist", label: "Nutritionist" },
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

const experienceLevels = [
  { value: "all", label: "Alla erfarenhetsnivåer" },
  { value: "0-5", label: "0-5 år" },
  { value: "5-10", label: "5-10 år" },
  { value: "10+", label: "10+ år" },
];

const SearchStaff = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all");
  const [region, setRegion] = useState("Alla regioner");
  const [experienceFilter, setExperienceFilter] = useState("all");

  const filteredStaff = mockStaff.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesRegion = region === "Alla regioner" || staff.region === region;
    
    let matchesExperience = true;
    if (experienceFilter === "0-5") {
      matchesExperience = staff.experience <= 5;
    } else if (experienceFilter === "5-10") {
      matchesExperience = staff.experience > 5 && staff.experience <= 10;
    } else if (experienceFilter === "10+") {
      matchesExperience = staff.experience > 10;
    }
    
    return matchesSearch && matchesRole && matchesRegion && matchesExperience;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setRegion("Alla regioner");
    setExperienceFilter("all");
  };

  const hasActiveFilters =
    searchQuery ||
    roleFilter !== "all" ||
    region !== "Alla regioner" ||
    experienceFilter !== "all";

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-neon/10">
              <Users className="h-6 w-6 text-neon" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Sök personal</h1>
          </div>
          <p className="text-muted-foreground">
            Hitta tränare, fysioterapeuter, analytiker och annan personal för ditt lag
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
                  <Label className="text-sm">Roll</Label>
                  <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as StaffRole | "all")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Erfarenhet</Label>
                  <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
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
                  placeholder="Sök på namn eller specialisering..."
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
                    <Label className="text-sm">Roll</Label>
                    <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as StaffRole | "all")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
              {filteredStaff.length} personal hittades
            </p>

            {/* Staff Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredStaff.map((staff) => (
                <StaffCard key={staff.id} {...staff} />
              ))}
            </div>

            {filteredStaff.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Ingen personal matchade din sökning</p>
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

export default SearchStaff;
