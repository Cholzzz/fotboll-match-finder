import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Award, 
  Mail, 
  Phone, 
  Calendar,
  GraduationCap,
  FileText,
  Star,
  Users,
  Trophy,
  CreditCard,
  Clock,
  Check,
  CalendarDays,
  Loader2
} from "lucide-react";
import { StaffRole, StaffPricing } from "@/components/StaffCard";
import BookingCalendar from "@/components/BookingCalendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  specialization: string;
  experience: number;
  region: string;
  email: string;
  phone: string;
  bio: string;
  certifications: string[];
  education: { degree: string; institution: string; year: number }[];
  previousClubs: { club: string; role: string; years: string }[];
  achievements: string[];
  availability: string;
  pricing: StaffPricing;
  services: { name: string; description: string; price: number; duration: number }[];
  availableDays?: string[];
  availableHoursStart?: string;
  availableHoursEnd?: string;
}

const roleLabels: Record<StaffRole, string> = {
  coach: "Tränare",
  physio: "Fysioterapeut",
  analyst: "Analytiker",
  scout: "Scout",
  nutritionist: "Nutritionist",
};

const roleColors: Record<StaffRole, string> = {
  coach: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  physio: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  analyst: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  scout: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  nutritionist: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

// Mock data - would come from API
const mockStaffData: Record<string, StaffMember> = {
  s1: {
    id: "s1",
    name: "Anders Johansson",
    role: "coach",
    specialization: "Ungdomsutveckling",
    experience: 15,
    region: "Stockholm",
    email: "anders.johansson@example.com",
    phone: "+46 70 123 45 67",
    bio: "Erfaren ungdomstränare med fokus på teknisk utveckling och spelförståelse. Har arbetat med flera av Sveriges främsta ungdomsakademier och utvecklat talanger som nått professionell nivå.",
    certifications: ["UEFA A-licens", "SvFF Elitlicens", "Mental Coach"],
    education: [
      { degree: "Idrottsvetenskap", institution: "GIH Stockholm", year: 2008 },
      { degree: "UEFA A-licens", institution: "Svenska Fotbollförbundet", year: 2015 }
    ],
    previousClubs: [
      { club: "AIK Fotboll", role: "U19 Huvudtränare", years: "2020-2024" },
      { club: "Djurgårdens IF", role: "U17 Ass. Tränare", years: "2016-2020" },
      { club: "Hammarby IF", role: "Ungdomstränare", years: "2012-2016" }
    ],
    achievements: [
      "SM-guld U19 med AIK 2023",
      "Utvecklat 5 spelare till A-lagsnivå",
      "Bästa ungdomstränare SvFF 2022"
    ],
    availability: "Tillgänglig från juli 2024",
    pricing: {
      sessionPrice: 1200,
      sessionDuration: 60,
      packagePrice: 5000,
      packageSessions: 5
    },
    services: [
      { name: "Individuell träning", description: "Personligt anpassad teknikträning", price: 1200, duration: 60 },
      { name: "Videoanalys", description: "Analys av ditt spel med feedback", price: 800, duration: 45 },
      { name: "Mental coaching", description: "Fokus på mental styrka och prestation", price: 1000, duration: 60 },
      { name: "Gruppträning (max 4)", description: "Träning i liten grupp", price: 600, duration: 90 }
    ],
    availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    availableHoursStart: "09:00",
    availableHoursEnd: "18:00"
  },
  s2: {
    id: "s2",
    name: "Maria Lindberg",
    role: "physio",
    specialization: "Idrottsskador & Rehabilitering",
    experience: 10,
    region: "Göteborg",
    email: "maria.lindberg@example.com",
    phone: "+46 70 234 56 78",
    bio: "Legitimerad fysioterapeut specialiserad på fotbollsskador och rehabilitering. Omfattande erfarenhet av att arbeta med elitspelare och hjälpa dem tillbaka till toppform efter skador.",
    certifications: ["Leg. Fysioterapeut", "Sportmedicin", "Ortopedisk Medicin"],
    education: [
      { degree: "Fysioterapi", institution: "Göteborgs Universitet", year: 2014 },
      { degree: "Sportmedicin", institution: "Karolinska Institutet", year: 2018 }
    ],
    previousClubs: [
      { club: "IFK Göteborg", role: "Huvudfysioterapeut", years: "2019-2024" },
      { club: "BK Häcken", role: "Fysioterapeut", years: "2016-2019" }
    ],
    achievements: [
      "Minskat skadefrekvensen med 30% hos IFK Göteborg",
      "Utvecklat rehabiliteringsprogram för korsbandsskador",
      "Föreläsare vid SvFF:s medicinska konferens"
    ],
    availability: "Tillgänglig omgående",
    pricing: {
      sessionPrice: 900,
      sessionDuration: 45,
      packagePrice: 4000,
      packageSessions: 5
    },
    services: [
      { name: "Bedömning & Diagnostik", description: "Initial utvärdering av skada/problem", price: 900, duration: 45 },
      { name: "Rehabiliteringspass", description: "Guidad rehab för skador", price: 900, duration: 45 },
      { name: "Skadeförebyggande", description: "Screening och preventivt arbete", price: 1100, duration: 60 },
      { name: "Tejpning & Behandling", description: "Akut behandling och tejpning", price: 500, duration: 30 },
      { name: "Rehab-program (5 pass)", description: "Komplett rehabiliteringspaket", price: 4000, duration: 45 }
    ],
    availableDays: ["monday", "wednesday", "friday"],
    availableHoursStart: "08:00",
    availableHoursEnd: "17:00"
  }
};

// Mock booked slots
const mockBookedSlots = [
  { date: "2026-02-05", startTime: "10:00" },
  { date: "2026-02-05", startTime: "14:00" },
  { date: "2026-02-06", startTime: "09:00" },
  { date: "2026-02-07", startTime: "11:00" },
];

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const staff = id ? mockStaffData[id] : null;
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!staff) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Profil hittades inte
          </h1>
          <Link to="/search-staff">
            <Button>Tillbaka till sökning</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleBookService = (serviceName: string) => {
    setSelectedService(serviceName);
    setBookingOpen(true);
  };

  const handleSlotSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleSubmitBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedService) return;

    setIsSubmitting(true);

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Logga in",
          description: "Du måste vara inloggad för att boka.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // For demo purposes, just show success
      // In production, this would save to the bookings table
      toast({
        title: "Bokningsförfrågan skickad!",
        description: `Din förfrågan för ${selectedService} den ${format(selectedDate, "d MMMM", { locale: sv })} kl. ${selectedTime} har skickats.`,
      });

      setBookingOpen(false);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedService(null);
      setBookingNotes("");
    } catch (error: any) {
      toast({
        title: "Fel",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceDetails = staff.services.find(s => s.name === selectedService);

  return (
    <Layout>
      <div className="container py-8">
        {/* Back Button */}
        <Link to="/search-staff" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Tillbaka till sökning</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-foreground flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-4xl md:text-5xl font-bold text-background">
                    {staff.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start gap-3 mb-3">
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {staff.name}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${roleColors[staff.role]}`}>
                      {roleLabels[staff.role]}
                    </span>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-4">{staff.specialization}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {staff.experience} års erfarenhet
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {staff.region}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {staff.availability}
                    </span>
                  </div>

                  {/* Certifications */}
                  <div className="flex flex-wrap gap-2">
                    {staff.certifications.map((cert, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neon/10 text-neon text-xs font-medium">
                        <Award className="h-3 w-3" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="mb-6 w-full justify-start overflow-x-auto">
                <TabsTrigger value="about" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Om
                </TabsTrigger>
                <TabsTrigger value="services" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Tjänster & Priser
                </TabsTrigger>
                <TabsTrigger value="booking" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Boka tid
                </TabsTrigger>
                <TabsTrigger value="experience" className="gap-2">
                  <Briefcase className="h-4 w-4" />
                  Erfarenhet
                </TabsTrigger>
                <TabsTrigger value="achievements" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Meriter
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Biografi</h3>
                    <p className="text-muted-foreground leading-relaxed">{staff.bio}</p>
                  </div>
                  
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">Utbildning</h3>
                    <div className="space-y-3">
                      {staff.education.map((edu, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                          <GraduationCap className="h-5 w-5 text-neon mt-0.5" />
                          <div>
                            <h4 className="font-medium text-foreground">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">{edu.institution} • {edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="services">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-6">Tillgängliga tjänster</h3>
                  <div className="space-y-4">
                    {staff.services.map((service, index) => (
                      <div key={index} className="p-4 rounded-xl border border-border bg-background hover:border-neon/30 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{service.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {service.duration} min
                              </span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-display font-bold text-lg text-foreground">{service.price} kr</div>
                            <Button 
                              size="sm" 
                              className="mt-2 btn-glow"
                              onClick={() => handleBookService(service.name)}
                            >
                              <CalendarDays className="h-3.5 w-3.5 mr-1" />
                              Boka
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="booking">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">Boka tid</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Välj datum och tid för din session med {staff.name}
                  </p>
                  
                  <BookingCalendar
                    availableDays={staff.availableDays}
                    availableHoursStart={staff.availableHoursStart}
                    availableHoursEnd={staff.availableHoursEnd}
                    sessionDuration={staff.pricing.sessionDuration}
                    bookedSlots={mockBookedSlots}
                    onSelectSlot={handleSlotSelect}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                  />

                  {selectedDate && selectedTime && (
                    <div className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes">Meddelande (valfritt)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Beskriv kort vad du behöver hjälp med..."
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                          className="resize-none"
                          rows={3}
                        />
                      </div>
                      <Button 
                        className="w-full btn-glow" 
                        size="lg"
                        onClick={() => {
                          setSelectedService(staff.services[0]?.name || "Session");
                          handleSubmitBooking();
                        }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Skickar...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Skicka bokningsförfrågan
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="experience">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-6">Tidigare klubbar</h3>
                  <div className="space-y-4">
                    {staff.previousClubs.map((club, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                        <div className="w-12 h-12 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
                          <Users className="h-6 w-6 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{club.club}</h4>
                          <p className="text-sm text-muted-foreground">{club.role}</p>
                          <p className="text-xs text-muted-foreground mt-1">{club.years}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="achievements">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-6">Meriter & Utmärkelser</h3>
                  <div className="space-y-3">
                    {staff.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                        <Star className="h-5 w-5 text-neon flex-shrink-0" />
                        <span className="text-foreground">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Pricing & Booking */}
          <div className="space-y-4">
            {/* Quick Pricing Card */}
            <div className="rounded-2xl border border-neon/30 bg-card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-neon" />
                <h3 className="font-display text-lg font-semibold text-foreground">Priser</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neon/5 border border-neon/20">
                  <div className="text-sm text-muted-foreground mb-1">Enskild session</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold text-foreground">{staff.pricing.sessionPrice} kr</span>
                    <span className="text-sm text-muted-foreground">/ {staff.pricing.sessionDuration} min</span>
                  </div>
                </div>

                {staff.pricing.packagePrice && staff.pricing.packageSessions && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-muted-foreground">Paketpris ({staff.pricing.packageSessions} sessioner)</span>
                      <span className="px-1.5 py-0.5 rounded bg-neon/10 text-neon text-xs font-medium">Spara {Math.round((1 - (staff.pricing.packagePrice / (staff.pricing.sessionPrice * staff.pricing.packageSessions))) * 100)}%</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-2xl font-bold text-foreground">{staff.pricing.packagePrice} kr</span>
                      <span className="text-sm text-muted-foreground">({Math.round(staff.pricing.packagePrice / staff.pricing.packageSessions)} kr/session)</span>
                    </div>
                  </div>
                )}

                <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full btn-glow" size="lg">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      Boka session
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-display">Boka {selectedService || "session"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                            <span className="font-display font-bold text-background">
                              {staff.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{staff.name}</div>
                            <div className="text-sm text-muted-foreground">{roleLabels[staff.role]}</div>
                          </div>
                        </div>
                        {selectedServiceDetails && (
                          <div className="text-sm text-muted-foreground">
                            <span className="text-foreground font-medium">{selectedService}</span>
                            <span className="mx-2">•</span>
                            <span>{selectedServiceDetails.duration} min</span>
                            <span className="mx-2">•</span>
                            <span className="text-neon font-medium">{selectedServiceDetails.price} kr</span>
                          </div>
                        )}
                      </div>

                      {/* Booking Calendar in Modal */}
                      <BookingCalendar
                        availableDays={staff.availableDays}
                        availableHoursStart={staff.availableHoursStart}
                        availableHoursEnd={staff.availableHoursEnd}
                        sessionDuration={selectedServiceDetails?.duration || staff.pricing.sessionDuration}
                        bookedSlots={mockBookedSlots}
                        onSelectSlot={handleSlotSelect}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                      />

                      {selectedDate && selectedTime && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="modal-notes">Meddelande (valfritt)</Label>
                            <Textarea
                              id="modal-notes"
                              placeholder="Beskriv kort vad du behöver hjälp med..."
                              value={bookingNotes}
                              onChange={(e) => setBookingNotes(e.target.value)}
                              className="resize-none"
                              rows={3}
                            />
                          </div>
                          
                          <div className="space-y-2 pt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-neon" />
                              Bekräftelse skickas via email
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-neon" />
                              Avbokning möjlig 24h innan
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-neon" />
                              Betalning sker vid besök
                            </div>
                          </div>

                          <Button 
                            className="w-full btn-glow" 
                            size="lg"
                            onClick={handleSubmitBooking}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Skickar...
                              </>
                            ) : (
                              <>
                                <Mail className="h-4 w-4 mr-2" />
                                Skicka bokningsförfrågan
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{staff.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{staff.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffProfile;
