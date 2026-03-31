import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import StaffCard, { StaffRole, StaffCardProps } from "@/components/StaffCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const roleMap: Record<string, StaffRole> = {
  coach: "coach",
  physiotherapist: "physio",
  analyst: "analyst",
  scout: "scout",
  nutritionist: "nutritionist",
};

const roleOptions: { value: StaffRole | "all"; label: string }[] = [
  { value: "all", label: "Alla roller" },
  { value: "coach", label: "Tränare" },
  { value: "physio", label: "Fysioterapeut" },
  { value: "analyst", label: "Analytiker" },
  { value: "scout", label: "Scout" },
  { value: "nutritionist", label: "Nutritionist" },
];

const regions = [
  "Alla regioner", "Stockholm", "Göteborg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping",
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

  const { data: staffList = [], isLoading } = useQuery({
    queryKey: ["staff-list"],
    queryFn: async () => {
      // Get staff profiles with their profile info and roles
      const { data: staffProfiles, error } = await supabase
        .from("staff_profiles")
        .select("*, profiles!inner(full_name, avatar_url, location, user_id)");

      if (error) throw error;

      // Get roles for these users
      const userIds = (staffProfiles || []).map((s: any) => s.user_id);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds);

      const roleByUser: Record<string, string> = {};
      (roles || []).forEach((r: any) => { roleByUser[r.user_id] = r.role; });

      return (staffProfiles || []).map((s: any): StaffCardProps => {
        const dbRole = roleByUser[s.user_id] || "coach";
        const mappedRole = roleMap[dbRole] || "coach";
        return {
          id: s.user_id,
          name: s.profiles.full_name,
          role: mappedRole,
          specialization: s.specialization || "Ej angiven",
          experience: s.experience_years || 0,
          region: s.profiles.location || "Ej angiven",
          certifications: Array.isArray(s.certifications) ? s.certifications as string[] : [],
          imageUrl: s.profiles.avatar_url || undefined,
          pricing: s.session_price ? {
            sessionPrice: s.session_price,
            sessionDuration: s.session_duration || 60,
            packagePrice: s.package_price || undefined,
            packageSessions: s.package_sessions || undefined,
          } : undefined,
        };
      });
    },
  });

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || staff.role === roleFilter;
    const matchesRegion = region === "Alla regioner" || staff.region === region;
    
    let matchesExperience = true;
    if (experienceFilter === "0-5") matchesExperience = staff.experience <= 5;
    else if (experienceFilter === "5-10") matchesExperience = staff.experience > 5 && staff.experience <= 10;
    else if (experienceFilter === "10+") matchesExperience = staff.experience > 10;
    
    return matchesSearch && matchesRole && matchesRegion && matchesExperience;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setRegion("Alla regioner");
    setExperienceFilter("all");
  };

  const hasActiveFilters = searchQuery || roleFilter !== "all" || region !== "Alla regioner" || experienceFilter !== "all";

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
                  <Label className="text-sm">Roll</Label>
                  <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as StaffRole | "all")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Erfarenhet</Label>
                  <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
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
                <Input type="text" placeholder="Sök på namn eller specialisering..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
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
                    <Label className="text-sm">Roll</Label>
                    <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as StaffRole | "all")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Region</Label>
                    <Select value={region} onValueChange={setRegion}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4 w-full">Rensa filter</Button>
                )}
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-4">
              {isLoading ? "Laddar..." : `${filteredStaff.length} personal hittades`}
            </p>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredStaff.map((staff) => (
                  <StaffCard key={staff.id} {...staff} />
                ))}
              </div>
            )}

            {!isLoading && filteredStaff.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Ingen personal matchade din sökning</p>
                <Button variant="ghost" onClick={clearFilters} className="mt-4">Rensa filter</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchStaff;
