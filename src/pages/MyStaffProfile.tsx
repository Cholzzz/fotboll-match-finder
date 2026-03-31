import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const daysOfWeek = [
  { value: "monday", label: "Måndag" },
  { value: "tuesday", label: "Tisdag" },
  { value: "wednesday", label: "Onsdag" },
  { value: "thursday", label: "Torsdag" },
  { value: "friday", label: "Fredag" },
  { value: "saturday", label: "Lördag" },
  { value: "sunday", label: "Söndag" },
];

const MyStaffProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [sessionPrice, setSessionPrice] = useState("");
  const [sessionDuration, setSessionDuration] = useState("60");
  const [packagePrice, setPackagePrice] = useState("");
  const [packageSessions, setPackageSessions] = useState("5");
  const [availableDays, setAvailableDays] = useState<string[]>(["monday", "tuesday", "wednesday", "thursday", "friday"]);
  const [hoursStart, setHoursStart] = useState("09:00");
  const [hoursEnd, setHoursEnd] = useState("17:00");
  const [bio, setBio] = useState("");

  const { data: staffProfile, isLoading } = useQuery({
    queryKey: ["my-staff-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["my-profile-bio", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("bio").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (staffProfile) {
      setSpecialization(staffProfile.specialization || "");
      setExperienceYears(staffProfile.experience_years?.toString() || "");
      setSessionPrice(staffProfile.session_price?.toString() || "");
      setSessionDuration(staffProfile.session_duration?.toString() || "60");
      setPackagePrice(staffProfile.package_price?.toString() || "");
      setPackageSessions(staffProfile.package_sessions?.toString() || "5");
      setAvailableDays((staffProfile.available_days as string[]) || ["monday", "tuesday", "wednesday", "thursday", "friday"]);
      setHoursStart(staffProfile.available_hours_start?.slice(0, 5) || "09:00");
      setHoursEnd(staffProfile.available_hours_end?.slice(0, 5) || "17:00");
    }
    if (profile) setBio(profile.bio || "");
  }, [staffProfile, profile]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = {
        specialization,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        session_price: sessionPrice ? parseInt(sessionPrice) : null,
        session_duration: sessionDuration ? parseInt(sessionDuration) : 60,
        package_price: packagePrice ? parseInt(packagePrice) : null,
        package_sessions: packageSessions ? parseInt(packageSessions) : 5,
        available_days: availableDays,
        available_hours_start: hoursStart,
        available_hours_end: hoursEnd,
      };

      const { error } = await supabase
        .from("staff_profiles")
        .update(updates)
        .eq("user_id", user!.id);
      if (error) throw error;

      await supabase.from("profiles").update({ bio }).eq("user_id", user!.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-staff-profile"] });
      toast({ title: "Profil sparad!", description: "Dina ändringar har sparats." });
    },
    onError: (err: any) => {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    },
  });

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container py-8 max-w-2xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  const toggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Min personalprofil</h1>
        <p className="text-muted-foreground mb-8">Fyll i din profil så att spelare och klubbar kan hitta dig</p>

        <div className="space-y-6">
          {/* Bio */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground">Om dig</h2>
            <div className="space-y-2">
              <Label>Specialisering</Label>
              <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="T.ex. Ungdomsutveckling, Skaderehabilitering" />
            </div>
            <div className="space-y-2">
              <Label>Erfarenhet (år)</Label>
              <Input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="0" min="0" />
            </div>
            <div className="space-y-2">
              <Label>Biografi</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Beskriv din bakgrund och expertis..." rows={4} />
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground">Priser</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sessionspris (kr)</Label>
                <Input type="number" value={sessionPrice} onChange={(e) => setSessionPrice(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Sessionstid (min)</Label>
                <Input type="number" value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} placeholder="60" />
              </div>
              <div className="space-y-2">
                <Label>Paketpris (kr)</Label>
                <Input type="number" value={packagePrice} onChange={(e) => setPackagePrice(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Sessioner i paket</Label>
                <Input type="number" value={packageSessions} onChange={(e) => setPackageSessions(e.target.value)} placeholder="5" />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground">Tillgänglighet</h2>
            <div className="space-y-2">
              <Label>Tillgängliga dagar</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      availableDays.includes(day.value)
                        ? "bg-neon text-neon-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Starttid</Label>
                <Input type="time" value={hoursStart} onChange={(e) => setHoursStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Sluttid</Label>
                <Input type="time" value={hoursEnd} onChange={(e) => setHoursEnd(e.target.value)} />
              </div>
            </div>
          </div>

          <Button className="w-full btn-glow" size="lg" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sparar...</>) : (<><Save className="h-4 w-4 mr-2" />Spara profil</>)}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default MyStaffProfile;
