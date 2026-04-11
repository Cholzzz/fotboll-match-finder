import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AvatarUpload from "@/components/AvatarUpload";
import { toast } from "@/hooks/use-toast";
import { ArrowRight, ArrowLeft, User, MapPin, FileText, Trophy, Briefcase, CheckCircle2 } from "lucide-react";

type Role = "player" | "club" | "coach" | "physiotherapist" | "analyst" | "scout" | "nutritionist" | "mental_coach";

interface StepConfig {
  title: string;
  description: string;
  icon: React.ElementType;
}

const positionOptions = [
  "Målvakt", "Högerback", "Vänsterback", "Mittback", "Defensiv mittfältare",
  "Centralt mittfält", "Offensivt mittfält", "Högerytter", "Vänsterytter", "Anfallare"
];

const regionOptions = [
  "Norrbotten", "Västerbotten", "Jämtland", "Västernorrland", "Gävleborg",
  "Dalarna", "Värmland", "Örebro", "Västmanland", "Uppsala", "Stockholm",
  "Södermanland", "Östergötland", "Jönköping", "Kronoberg", "Kalmar",
  "Gotland", "Blekinge", "Skåne", "Halland", "Västra Götaland"
];

const footOptions = ["Höger", "Vänster", "Bägge"];

const Onboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  // Shared
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  // Player
  const [position, setPosition] = useState("");
  const [age, setAge] = useState("");
  const [preferredFoot, setPreferredFoot] = useState("");
  const [currentClub, setCurrentClub] = useState("");
  const [region, setRegion] = useState("");

  // Staff
  const [specialization, setSpecialization] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const fetchRole = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (data?.role) {
        setRole(data.role as Role);
      }

      // Pre-fill existing data
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (profile) {
        setAvatarUrl(profile.avatar_url);
        setBio(profile.bio || "");
        setLocation(profile.location || "");
      }

      setRoleLoading(false);
    };

    fetchRole();
  }, [user, authLoading, navigate]);

  const staffRoles: Role[] = ["coach", "physiotherapist", "analyst", "scout", "nutritionist", "mental_coach"];
  const isStaff = role && staffRoles.includes(role);

  const getSteps = (): StepConfig[] => {
    if (role === "player") {
      return [
        { title: "Profilbild", description: "Ladda upp en bild så att klubbar känner igen dig", icon: User },
        { title: "Spelarinfo", description: "Position, ålder och föredragen fot", icon: Trophy },
        { title: "Plats & Klubb", description: "Var spelar du och vilken region?", icon: MapPin },
        { title: "Om dig", description: "Berätta kort om dig som spelare", icon: FileText },
      ];
    }
    if (role === "club") {
      return [
        { title: "Klubblogga", description: "Ladda upp klubbens logotyp", icon: User },
        { title: "Plats", description: "Var befinner sig klubben?", icon: MapPin },
        { title: "Om klubben", description: "Berätta om klubben och vad ni söker", icon: FileText },
      ];
    }
    // Staff
    return [
      { title: "Profilbild", description: "Ladda upp en professionell bild", icon: User },
      { title: "Erfarenhet", description: "Specialisering och erfarenhet", icon: Briefcase },
      { title: "Plats & Beskrivning", description: "Var jobbar du och vad erbjuder du?", icon: MapPin },
    ];
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    if (!user || !role) return;
    setLoading(true);

    try {
      // Update profile
      await supabase.from("profiles").update({
        avatar_url: avatarUrl,
        bio,
        location,
      }).eq("user_id", user.id);

      // Role-specific updates
      if (role === "player") {
        const { data: existing } = await supabase
          .from("player_profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        const playerData = {
          position,
          age: age ? parseInt(age) : null,
          preferred_foot: preferredFoot,
          current_club: currentClub,
          region,
          bio,
        };

        if (existing) {
          await supabase.from("player_profiles").update(playerData).eq("user_id", user.id);
        } else {
          await supabase.from("player_profiles").insert({ user_id: user.id, ...playerData });
        }
      }

      if (isStaff) {
        await supabase.from("staff_profiles").update({
          specialization,
          experience_years: experienceYears ? parseInt(experienceYears) : null,
        }).eq("user_id", user.id);
      }

      toast({ title: "Profil klar!", description: "Välkommen till SportsIN!" });

      // Navigate based on role
      if (role === "player") navigate("/feed");
      else if (role === "club") navigate("/feed");
      else navigate("/my-staff-profile");
    } catch (error: any) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderPlayerStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col items-center gap-6">
            <AvatarUpload
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
              userId={user!.id}
            />
            <p className="text-sm text-muted-foreground text-center">
              En bra profilbild ökar chansen att bli kontaktad av klubbar
            </p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger><SelectValue placeholder="Välj position" /></SelectTrigger>
                <SelectContent>
                  {positionOptions.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ålder</Label>
              <Input type="number" min={15} max={45} placeholder="T.ex. 19" value={age} onChange={e => setAge(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Föredragen fot</Label>
              <Select value={preferredFoot} onValueChange={setPreferredFoot}>
                <SelectTrigger><SelectValue placeholder="Välj fot" /></SelectTrigger>
                <SelectContent>
                  {footOptions.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger><SelectValue placeholder="Välj region" /></SelectTrigger>
                <SelectContent>
                  {regionOptions.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nuvarande klubb</Label>
              <Input placeholder="T.ex. IFK Göteborg" value={currentClub} onChange={e => setCurrentClub(e.target.value)} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Om dig</Label>
              <Textarea
                placeholder="Berätta kort om dig som spelare, dina styrkor och mål..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderClubStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col items-center gap-6">
            <AvatarUpload avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} userId={user!.id} />
            <p className="text-sm text-muted-foreground text-center">Ladda upp klubbens logotyp</p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ort / Adress</Label>
              <Input placeholder="T.ex. Göteborg" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Om klubben</Label>
              <Textarea
                placeholder="Berätta om klubben, vilka positioner ni söker, vilka åldersgrupper..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderStaffStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col items-center gap-6">
            <AvatarUpload avatarUrl={avatarUrl} onAvatarChange={setAvatarUrl} userId={user!.id} />
            <p className="text-sm text-muted-foreground text-center">En professionell bild bygger förtroende</p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Specialisering</Label>
              <Input placeholder="T.ex. Rehabilitering, Styrketräning" value={specialization} onChange={e => setSpecialization(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>År av erfarenhet</Label>
              <Input type="number" min={0} max={50} placeholder="T.ex. 5" value={experienceYears} onChange={e => setExperienceYears(e.target.value)} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plats / Adress</Label>
              <Input placeholder="T.ex. Stockholm, Strandvägen 1" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Om dig & dina tjänster</Label>
              <Textarea
                placeholder="Berätta om din erfarenhet och vad du erbjuder..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
      </div>
    );
  }

  const isLastStep = currentStep === totalSteps - 1;
  const currentStepConfig = steps[currentStep];

  const roleLabels: Record<Role, string> = {
    player: "Spelare",
    club: "Klubb",
    coach: "Tränare",
    physiotherapist: "Fysioterapeut",
    analyst: "Analytiker",
    scout: "Scout",
    nutritionist: "Nutritionist",
    mental_coach: "Mentalcoach",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground">
              <span className="font-display text-lg font-bold text-background">S</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">SportsIN</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground mb-4">
            {role && roleLabels[role]}
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            {currentStepConfig?.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentStepConfig?.description}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Steg {currentStep + 1} av {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 min-h-[200px]">
          {role === "player" && renderPlayerStep()}
          {role === "club" && renderClubStep()}
          {isStaff && renderStaffStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {currentStep > 0 ? (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                if (role === "player") navigate("/feed");
                else if (role === "club") navigate("/feed");
                else navigate("/my-staff-profile");
              }}
              className="text-muted-foreground text-sm"
            >
              Hoppa över
            </Button>
          )}

          {isLastStep ? (
            <Button onClick={handleFinish} disabled={loading} className="flex-1">
              {loading ? "Sparar..." : "Slutför"}
              <CheckCircle2 className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1">
              Nästa
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? "w-8 bg-primary" : i < currentStep ? "w-2 bg-primary/50" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
