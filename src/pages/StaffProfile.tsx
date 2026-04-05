import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, MapPin, Briefcase, Award, Mail, Phone,
  FileText, CreditCard, Clock, Check, CalendarDays, Loader2
} from "lucide-react";
import BookingCalendar from "@/components/BookingCalendar";
import ConnectButton from "@/components/ConnectButton";
import { useConnectionCount } from "@/hooks/useConnections";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const roleLabels: Record<string, string> = {
  coach: "Tränare", physio: "Fysioterapeut", physiotherapist: "Fysioterapeut",
  analyst: "Analytiker", scout: "Scout", nutritionist: "Nutritionist", mental_coach: "Mental coach",
};

const roleColors: Record<string, string> = {
  coach: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  physio: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  physiotherapist: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  analyst: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  scout: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  nutritionist: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  mental_coach: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch staff profile
  const { data: staff, isLoading: staffLoading } = useQuery({
    queryKey: ["staff-profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff_profiles")
        .select("*")
        .eq("user_id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch profile separately (no FK)
  const { data: profileData } = useQuery({
    queryKey: ["staff-profile-info", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, location, phone, bio")
        .eq("user_id", id!)
        .maybeSingle();
      return data;
    },
    enabled: !!id,
  });

  // Fetch role
  const { data: roleData } = useQuery({
    queryKey: ["staff-role", id],
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", id!).maybeSingle();
      return data;
    },
    enabled: !!id,
  });

  // Fetch booked slots
  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["staff-bookings", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("booking_date, start_time")
        .eq("staff_user_id", id!)
        .in("status", ["pending", "confirmed"]);
      return (data || []).map((b) => ({ date: b.booking_date, startTime: b.start_time?.slice(0, 5) }));
    },
    enabled: !!id,
  });

  const isLoading = staffLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  if (!staff || !profileData) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Profil hittades inte</h1>
          <Link to="/search-staff"><Button>Tillbaka till sökning</Button></Link>
        </div>
      </Layout>
    );
  }

  const name = profileData.full_name;
  const role = roleData?.role || "coach";
  const services = (staff.services as any[] || []) as { name: string; description: string; price: number; duration: number }[];
  const certifications = (staff.certifications as string[] || []);
  const availableDays = (staff.available_days as string[] || ["monday", "tuesday", "wednesday", "thursday", "friday"]);
  const daySchedules = staff.day_schedules as unknown as Record<string, { enabled: boolean; start: string; end: string }> | undefined;

  const handleSlotSelect = (date: Date, time: string) => { setSelectedDate(date); setSelectedTime(time); };
  const handleBookService = (serviceName: string) => { setSelectedService(serviceName); setBookingOpen(true); };

  const handleSubmitBooking = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);
    try {
      if (!user) {
        toast({ title: "Logga in", description: "Du måste vara inloggad för att boka.", variant: "destructive" });
        navigate("/login");
        return;
      }
      const endTime = format(new Date(new Date(`2000-01-01T${selectedTime}:00`).getTime() + (staff.session_duration || 60) * 60000), "HH:mm");
      const { error } = await supabase.from("bookings").insert({
        staff_user_id: id!, client_user_id: user.id,
        booking_date: format(selectedDate, "yyyy-MM-dd"), start_time: selectedTime, end_time: endTime,
        service_name: selectedService || "Session", notes: bookingNotes || null,
      });
      if (error) throw error;
      toast({ title: "Bokningsförfrågan skickad!", description: `Din förfrågan för ${selectedService || "session"} den ${format(selectedDate, "d MMMM", { locale: sv })} kl. ${selectedTime} har skickats.` });
      setBookingOpen(false); setSelectedDate(null); setSelectedTime(null); setSelectedService(null); setBookingNotes("");
    } catch (error: any) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } finally { setIsSubmitting(false); }
  };

  const selectedServiceDetails = services.find(s => s.name === selectedService);

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/search-staff" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /><span className="text-sm">Tillbaka till sökning</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-foreground flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {profileData.avatar_url ? (
                    <img src={profileData.avatar_url} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-4xl md:text-5xl font-bold text-background">
                      {name.split(" ").map((n: string) => n[0]).join("")}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{name}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${roleColors[role] || roleColors.coach}`}>
                      {roleLabels[role] || role}
                    </span>
                  </div>
                  {staff.specialization && <p className="text-lg text-muted-foreground mb-4">{staff.specialization}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                    {staff.experience_years != null && <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{staff.experience_years} års erfarenhet</span>}
                    {profileData.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{profileData.location}</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <ConnectButton targetUserId={id!} size="sm" />
                  </div>
                  {certifications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {certifications.map((cert, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neon/10 text-neon text-xs font-medium"><Award className="h-3 w-3" />{cert}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                <TabsTrigger value="about" className="gap-2"><FileText className="h-4 w-4" />Om</TabsTrigger>
                {services.length > 0 && <TabsTrigger value="services" className="gap-2"><CreditCard className="h-4 w-4" />Tjänster & Priser</TabsTrigger>}
                <TabsTrigger value="booking" className="gap-2"><CalendarDays className="h-4 w-4" />Boka tid</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Biografi</h3>
                  <p className="text-muted-foreground leading-relaxed">{profileData.bio || "Ingen biografi ännu."}</p>
                </div>
              </TabsContent>

              {services.length > 0 && (
                <TabsContent value="services">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-6">Tillgängliga tjänster</h3>
                    <div className="space-y-4">
                      {services.map((service, index) => (
                        <div key={index} className="p-4 rounded-xl border border-border bg-background hover:border-neon/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">{service.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{service.duration} min</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-display font-bold text-lg text-foreground">{service.price} kr</div>
                              <Button size="sm" className="mt-2 btn-glow" onClick={() => handleBookService(service.name)}><CalendarDays className="h-3.5 w-3.5 mr-1" />Boka</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}

              <TabsContent value="booking">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">Boka tid</h3>
                  <p className="text-sm text-muted-foreground mb-6">Välj datum och tid för din session med {name}</p>
                  <BookingCalendar
                    availableDays={availableDays}
                    availableHoursStart={staff.available_hours_start?.slice(0, 5) || "09:00"}
                    availableHoursEnd={staff.available_hours_end?.slice(0, 5) || "17:00"}
                    daySchedules={daySchedules || undefined}
                    sessionDuration={staff.session_duration || 60}
                    bookedSlots={bookedSlots}
                    onSelectSlot={handleSlotSelect}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                  />
                  {selectedDate && selectedTime && (
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes">Beskriv ditt ärende</Label>
                        <Textarea
                          id="notes"
                          placeholder="Beskriv vad du behöver hjälp med, t.ex. var du har ont, hur skadan uppstod, eller vad du vill uppnå med besöket..."
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                          className="resize-none"
                          rows={5}
                        />
                        <p className="text-xs text-muted-foreground">Detta hjälper personalen förbereda sig inför ert möte.</p>
                      </div>
                      <Button className="w-full btn-glow" size="lg" onClick={() => { setSelectedService(services[0]?.name || "Session"); handleSubmitBooking(); }} disabled={isSubmitting}>
                        {isSubmitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Skickar...</>) : (<><Mail className="h-4 w-4 mr-2" />Skicka bokningsförfrågan</>)}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-neon/30 bg-card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-neon" />
                <h3 className="font-display text-lg font-semibold text-foreground">Priser</h3>
              </div>
              <div className="space-y-4">
                {staff.session_price && (
                  <div className="p-4 rounded-xl bg-neon/5 border border-neon/20">
                    <div className="text-sm text-muted-foreground mb-1">Enskild session</div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-3xl font-bold text-foreground">{staff.session_price} kr</span>
                      <span className="text-sm text-muted-foreground">/ {staff.session_duration || 60} min</span>
                    </div>
                  </div>
                )}
                {staff.package_price && staff.package_sessions && staff.session_price && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">Paketpris ({staff.package_sessions} sessioner)</span>
                      <span className="px-1.5 py-0.5 rounded bg-neon/10 text-neon text-xs font-medium">Spara {Math.round((1 - (staff.package_price / (staff.session_price * staff.package_sessions))) * 100)}%</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-bold text-foreground">{staff.package_price} kr</span>
                      <span className="text-sm text-muted-foreground">({Math.round(staff.package_price / staff.package_sessions)} kr/session)</span>
                    </div>
                  </div>
                )}

                <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full btn-glow" size="lg"><CalendarDays className="h-4 w-4 mr-2" />Boka session</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle className="font-display">Boka {selectedService || "session"}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                            <span className="font-display font-bold text-background">{name.split(" ").map((n: string) => n[0]).join("")}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{name}</div>
                            <div className="text-sm text-muted-foreground">{roleLabels[role] || role}</div>
                          </div>
                        </div>
                        {selectedServiceDetails && (
                          <div className="text-sm text-muted-foreground">
                            <span className="text-foreground font-medium">{selectedService}</span>
                            <span className="mx-2">•</span><span>{selectedServiceDetails.duration} min</span>
                            <span className="mx-2">•</span><span className="text-neon font-medium">{selectedServiceDetails.price} kr</span>
                          </div>
                        )}
                      </div>
                      <BookingCalendar
                        availableDays={availableDays}
                        availableHoursStart={staff.available_hours_start?.slice(0, 5) || "09:00"}
                        availableHoursEnd={staff.available_hours_end?.slice(0, 5) || "17:00"}
                        daySchedules={daySchedules || undefined}
                        sessionDuration={selectedServiceDetails?.duration || staff.session_duration || 60}
                        bookedSlots={bookedSlots}
                        onSelectSlot={handleSlotSelect}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                      />
                      {selectedDate && selectedTime && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="modal-notes">Beskriv ditt ärende</Label>
                            <Textarea
                              id="modal-notes"
                              placeholder="Beskriv vad du behöver hjälp med, t.ex. var du har ont, hur skadan uppstod, eller vad du vill uppnå med besöket..."
                              value={bookingNotes}
                              onChange={(e) => setBookingNotes(e.target.value)}
                              className="resize-none"
                              rows={5}
                            />
                            <p className="text-xs text-muted-foreground">Detta hjälper personalen förbereda sig inför ert möte.</p>
                          </div>
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-neon" />Bekräftelse skickas via email</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-neon" />Avbokning möjlig 24h innan</div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-neon" />Betalning sker vid besök</div>
                          </div>
                          <Button className="w-full btn-glow" size="lg" onClick={handleSubmitBooking} disabled={isSubmitting}>
                            {isSubmitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Skickar...</>) : (<><Mail className="h-4 w-4 mr-2" />Skicka bokningsförfrågan</>)}
                          </Button>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                {profileData.phone && <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{profileData.phone}</span></div>}
                {profileData.location && <div className="flex items-center gap-3 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span className="text-foreground">{profileData.location}</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffProfile;
