import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Calendar, Check, X, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

type WeekSchedule = Record<string, DaySchedule>;

const daysOfWeek = [
  { value: "monday", label: "Måndag" },
  { value: "tuesday", label: "Tisdag" },
  { value: "wednesday", label: "Onsdag" },
  { value: "thursday", label: "Torsdag" },
  { value: "friday", label: "Fredag" },
  { value: "saturday", label: "Lördag" },
  { value: "sunday", label: "Söndag" },
];

const defaultSchedule: WeekSchedule = {
  monday: { enabled: true, start: "09:00", end: "17:00" },
  tuesday: { enabled: true, start: "09:00", end: "17:00" },
  wednesday: { enabled: true, start: "09:00", end: "17:00" },
  thursday: { enabled: true, start: "09:00", end: "17:00" },
  friday: { enabled: true, start: "09:00", end: "17:00" },
  saturday: { enabled: false, start: "10:00", end: "14:00" },
  sunday: { enabled: false, start: "10:00", end: "14:00" },
};

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
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>(defaultSchedule);
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

  const { data: myBookings = [] } = useQuery({
    queryKey: ["staff-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("staff_user_id", user!.id)
        .order("booking_date", { ascending: false });

      if (!data?.length) return [];

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

      // Load per-day schedules
      const savedSchedule = staffProfile.day_schedules as WeekSchedule | null;
      if (savedSchedule && Object.keys(savedSchedule).length > 0) {
        setWeekSchedule({ ...defaultSchedule, ...savedSchedule });
      } else {
        // Migrate from old format
        const oldDays = (staffProfile.available_days as string[]) || [];
        const oldStart = staffProfile.available_hours_start?.slice(0, 5) || "09:00";
        const oldEnd = staffProfile.available_hours_end?.slice(0, 5) || "17:00";
        const migrated: WeekSchedule = {};
        for (const day of daysOfWeek) {
          migrated[day.value] = {
            enabled: oldDays.includes(day.value),
            start: oldStart,
            end: oldEnd,
          };
        }
        setWeekSchedule(migrated);
      }
    }
    if (profile) setBio(profile.bio || "");
  }, [staffProfile, profile]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Derive legacy fields from new schedule for backwards compatibility
      const enabledDays = Object.entries(weekSchedule)
        .filter(([, s]) => s.enabled)
        .map(([day]) => day);

      const firstEnabled = enabledDays.length > 0 ? weekSchedule[enabledDays[0]] : null;

      const updates = {
        specialization,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        session_price: sessionPrice ? parseInt(sessionPrice) : null,
        session_duration: sessionDuration ? parseInt(sessionDuration) : 60,
        package_price: packagePrice ? parseInt(packagePrice) : null,
        package_sessions: packageSessions ? parseInt(packageSessions) : 5,
        available_days: enabledDays,
        available_hours_start: firstEnabled?.start || "09:00",
        available_hours_end: firstEnabled?.end || "17:00",
        day_schedules: weekSchedule,
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

  const updateDaySchedule = (day: string, field: keyof DaySchedule, value: string | boolean) => {
    setWeekSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const pendingBookings = myBookings.filter((b: any) => b.status === "pending");
  const confirmedBookings = myBookings.filter((b: any) => b.status === "confirmed");
  const totalRevenue = confirmedBookings.length * (parseInt(sessionPrice) || 0);

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Min personalprofil</h1>
        <p className="text-muted-foreground mb-8">Hantera din profil, schema och bokningar</p>

        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="schedule" className="gap-2">
              <Clock className="h-4 w-4" /> Schema
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="h-4 w-4" /> Bokningar
              {pendingBookings.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-neon text-neon-foreground text-xs font-medium">
                  {pendingBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Save className="h-4 w-4" /> Profil
            </TabsTrigger>
          </TabsList>

          {/* SCHEDULE TAB - Primary focus */}
          <TabsContent value="schedule">
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-neon" />
                  <h2 className="font-display font-semibold text-foreground">Lediga tider per dag</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ange vilka dagar och tider du är tillgänglig. Klienter ser dessa tider när de bokar.
                </p>

                <div className="space-y-3 mt-4">
                  {daysOfWeek.map((day) => {
                    const schedule = weekSchedule[day.value];
                    return (
                      <div
                        key={day.value}
                        className={`rounded-xl border p-4 transition-colors ${
                          schedule.enabled
                            ? "border-neon/30 bg-neon/5"
                            : "border-border bg-card opacity-60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={schedule.enabled}
                              onCheckedChange={(checked) =>
                                updateDaySchedule(day.value, "enabled", checked)
                              }
                            />
                            <span className={`font-medium text-sm ${schedule.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                              {day.label}
                            </span>
                          </div>

                          {schedule.enabled && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={schedule.start}
                                onChange={(e) =>
                                  updateDaySchedule(day.value, "start", e.target.value)
                                }
                                className="w-28 h-8 text-sm"
                              />
                              <span className="text-muted-foreground text-sm">–</span>
                              <Input
                                type="time"
                                value={schedule.end}
                                onChange={(e) =>
                                  updateDaySchedule(day.value, "end", e.target.value)
                                }
                                className="w-28 h-8 text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <h2 className="font-display font-semibold text-foreground">Sessionsinställningar</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sessionstid (min)</Label>
                    <Input type="number" value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} placeholder="60" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sessionspris (kr)</Label>
                    <Input type="number" value={sessionPrice} onChange={(e) => setSessionPrice(e.target.value)} placeholder="0" />
                  </div>
                </div>
              </div>

              <Button className="w-full btn-glow" size="lg" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sparar...</>) : (<><Save className="h-4 w-4 mr-2" />Spara schema</>)}
              </Button>
            </div>
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings">
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

          {/* PROFILE TAB */}
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
                <h2 className="font-display font-semibold text-foreground">Paketpriser</h2>
                <div className="grid grid-cols-2 gap-4">
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

              <Button className="w-full btn-glow" size="lg" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sparar...</>) : (<><Save className="h-4 w-4 mr-2" />Spara profil</>)}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyStaffProfile;
