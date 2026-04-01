import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Calendar, DollarSign, Check, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  // Bookings for this staff member
  const { data: myBookings = [] } = useQuery({
    queryKey: ["staff-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("staff_user_id", user!.id)
        .order("booking_date", { ascending: false });

      if (!data?.length) return [];

      // Get client names
      const clientIds = [...new Set(data.map((b) => b.client_user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", clientIds);
      const profileMap = Object.fromEntries(
        (profiles || []).map((p) => [p.user_id, p])
      );

      return data.map((b) => ({
        ...b,
        clientName: profileMap[b.client_user_id]?.full_name || "Okänd",
        clientAvatar: profileMap[b.client_user_id]?.avatar_url || null,
      }));
    },
    enabled: !!user,
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-bookings"] });
      toast({ title: "Uppdaterad!" });
    },
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
        <div className="container py-8 max-w-3xl space-y-6">
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

  const pendingBookings = myBookings.filter((b: any) => b.status === "pending");
  const confirmedBookings = myBookings.filter((b: any) => b.status === "confirmed");
  const totalRevenue = confirmedBookings.length * (parseInt(sessionPrice) || 0);

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Min personalprofil</h1>
        <p className="text-muted-foreground mb-8">Hantera din profil, bokningar och intäkter</p>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="profile" className="gap-2">
              <Save className="h-4 w-4" /> Profil
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="h-4 w-4" /> Bokningar
              {pendingBookings.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-neon text-neon-foreground text-xs font-medium">
                  {pendingBookings.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-display font-semibold text-foreground">Om dig</h2>
                <div className="space-y-2">
                  <Label>Specialisering</Label>
                  <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="T.ex. Ungdomsutveckling" />
                </div>
                <div className="space-y-2">
                  <Label>Erfarenhet (år)</Label>
                  <Input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="0" min="0" />
                </div>
                <div className="space-y-2">
                  <Label>Biografi</Label>
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Beskriv din bakgrund..." rows={4} />
                </div>
              </div>

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

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-display font-semibold text-foreground">Tillgänglighet</h2>
                <div className="space-y-2">
                  <Label>Tillgängliga dagar</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button key={day.value} onClick={() => toggleDay(day.value)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          availableDays.includes(day.value)
                            ? "bg-neon text-neon-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}>
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
          </TabsContent>

          <TabsContent value="bookings">
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{pendingBookings.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Väntande</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{confirmedBookings.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Bekräftade</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{totalRevenue} kr</p>
                <p className="text-xs text-muted-foreground mt-1">Beräknade intäkter</p>
              </div>
            </div>

            {myBookings.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-2xl">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Inga bokningar ännu</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myBookings.map((booking: any) => (
                  <div key={booking.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-xl">
                          <AvatarImage src={booking.clientAvatar || undefined} />
                          <AvatarFallback className="rounded-xl bg-foreground text-background text-sm">
                            {booking.clientName?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground text-sm">{booking.clientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.booking_date} • {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)}
                          </p>
                          {booking.service_name && (
                            <p className="text-xs text-muted-foreground">{booking.service_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" ? (
                          <>
                            <Button size="sm" variant="outline"
                              onClick={() => updateBookingMutation.mutate({ id: booking.id, status: "confirmed" })}>
                              <Check className="h-3 w-3 mr-1" /> Godkänn
                            </Button>
                            <Button size="sm" variant="ghost"
                              onClick={() => updateBookingMutation.mutate({ id: booking.id, status: "cancelled" })}>
                              <X className="h-3 w-3 mr-1" /> Neka
                            </Button>
                          </>
                        ) : (
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            booking.status === "confirmed" ? "bg-neon/10 text-neon" :
                            booking.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                            "bg-muted-foreground/10 text-muted-foreground"
                          }`}>
                            {booking.status === "confirmed" ? "Bekräftad" :
                             booking.status === "cancelled" ? "Avbokad" : booking.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyStaffProfile;
