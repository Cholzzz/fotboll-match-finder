import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Trophy
} from "lucide-react";
import { StaffRole } from "@/components/StaffCard";

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
    availability: "Tillgänglig från juli 2024"
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
    availability: "Tillgänglig omgående"
  }
};

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const staff = id ? mockStaffData[id] : null;

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

  return (
    <Layout>
      <div className="container py-8">
        {/* Back Button */}
        <Link to="/search-staff" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Tillbaka till sökning</span>
        </Link>

        {/* Header */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-6">
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

            {/* Contact Button */}
            <div className="flex-shrink-0">
              <Button className="w-full md:w-auto btn-glow">
                <Mail className="h-4 w-4 mr-2" />
                Kontakta
              </Button>
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
            <TabsTrigger value="experience" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Erfarenhet
            </TabsTrigger>
            <TabsTrigger value="education" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Utbildning
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="h-4 w-4" />
              Meriter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Biografi</h3>
                  <p className="text-muted-foreground leading-relaxed">{staff.bio}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Kontakt</h3>
                  <div className="space-y-3">
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

                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Snabbfakta</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Roll</span>
                      <span className="text-foreground font-medium">{roleLabels[staff.role]}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Erfarenhet</span>
                      <span className="text-foreground font-medium">{staff.experience} år</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Region</span>
                      <span className="text-foreground font-medium">{staff.region}</span>
                    </div>
                  </div>
                </div>
              </div>
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

          <TabsContent value="education">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-6">Utbildning & Certifieringar</h3>
              <div className="space-y-4">
                {staff.education.map((edu, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                    <div className="w-12 h-12 rounded-lg bg-neon/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-neon" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground mt-1">{edu.year}</p>
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
    </Layout>
  );
};

export default StaffProfile;
