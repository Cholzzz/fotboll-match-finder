import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building2, Mail, Lock, ArrowRight, ArrowLeft, Stethoscope, BarChart3, Search, Users, Apple, Brain, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Role = "player" | "club" | "physiotherapist" | "coach" | "analyst" | "scout" | "nutritionist" | "mental_coach" | null;

interface RoleOption {
  id: Role;
  label: string;
  description: string;
  icon: React.ElementType;
  category: "main" | "staff";
}

const roleOptions: RoleOption[] = [
  { id: "player", label: "Spelare", description: "Skapa en profil och bli upptäckt", icon: User, category: "main" },
  { id: "club", label: "Klubb / Förening", description: "Sök och rekrytera spelare", icon: Building2, category: "main" },
  { id: "coach", label: "Tränare", description: "Erbjud träning och coachning", icon: Users, category: "staff" },
  { id: "physiotherapist", label: "Fysioterapeut", description: "Rehabilitering och skadeförebyggande", icon: Stethoscope, category: "staff" },
  { id: "analyst", label: "Analytiker", description: "Matchanalys och spelarstatistik", icon: BarChart3, category: "staff" },
  { id: "scout", label: "Scout", description: "Scouting och talangidentifiering", icon: Search, category: "staff" },
  { id: "nutritionist", label: "Nutritionist", description: "Kostplanering och näringslära", icon: Apple, category: "staff" },
  { id: "mental_coach", label: "Mentalcoach", description: "Mental träning och prestation", icon: Brain, category: "staff" },
];

const roleLabels: Record<Exclude<Role, null>, string> = {
  player: "Spelarregistrering",
  club: "Klubbregistrering",
  coach: "Tränarregistrering",
  physiotherapist: "Fysioterapeutregistrering",
  analyst: "Analytikerregistrering",
  scout: "Scoutregistrering",
  nutritionist: "Nutritionistregistrering",
  mental_coach: "Mentalcoach-registrering",
};

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = searchParams.get("role") as Role;
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStaffPicker, setShowStaffPicker] = useState(false);
  const staffRoles = roleOptions.filter(r => r.category === "staff");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: fullName,
            role: selectedRole,
          }
        }
      });

      if (authError) throw authError;

      toast({
        title: "Konto skapat!",
        description: "Verifiera din e-post för att slutföra registreringen.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Fel vid registrering",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedRoleOption = () => roleOptions.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" />
            Tillbaka
          </Link>

          <div className="flex items-center gap-2.5 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground">
              <span className="font-display text-lg font-bold text-background">S</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">SportsIN</span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Skapa konto
          </h1>
          <p className="text-muted-foreground mb-8">
            Välj din roll och kom igång på några sekunder
          </p>

          {!selectedRole ? (
            <div className="space-y-4">
              {!showStaffPicker ? (
                <div className="space-y-3">
                  {/* Player */}
                  <button
                    onClick={() => setSelectedRole("player")}
                    className="w-full p-5 rounded-2xl border-2 border-border bg-card hover:border-foreground/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
                        <User className="h-6 w-6 text-background" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">Jag är spelare</h3>
                        <p className="text-sm text-muted-foreground">Skapa en profil och bli upptäckt</p>
                      </div>
                    </div>
                  </button>

                  {/* Club */}
                  <button
                    onClick={() => setSelectedRole("club")}
                    className="w-full p-5 rounded-2xl border-2 border-border bg-card hover:border-foreground/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-background" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">Jag representerar en klubb</h3>
                        <p className="text-sm text-muted-foreground">Sök och rekrytera spelare</p>
                      </div>
                    </div>
                  </button>

                  {/* Professional staff */}
                  <button
                    onClick={() => setShowStaffPicker(true)}
                    className="w-full p-5 rounded-2xl border-2 border-border bg-card hover:border-foreground/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-background" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">Jag är professionell personal</h3>
                        <p className="text-sm text-muted-foreground">Tränare, fysioterapeut, analytiker m.m.</p>
                      </div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowStaffPicker(false)}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Tillbaka
                  </button>
                  <h2 className="font-display text-lg font-semibold text-foreground">Välj din roll</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {staffRoles.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className="p-4 rounded-xl border-2 border-border bg-card hover:border-neon/50 hover:bg-neon/5 transition-all text-left"
                        >
                          <div className="flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-lg bg-neon/10 flex items-center justify-center">
                              <IconComponent className="h-5 w-5 text-neon" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm">{role.label}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">{role.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted mb-6">
                {getSelectedRoleOption() && (
                  <>
                    {(() => {
                      const IconComponent = getSelectedRoleOption()!.icon;
                      return <IconComponent className="h-5 w-5 text-foreground" />;
                    })()}
                    <span className="text-sm font-medium text-foreground">
                      {roleLabels[selectedRole!]}
                    </span>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                >
                  Ändra
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Fullständigt namn</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Ditt namn"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-postadress</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="din@email.se"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minst 8 tecken"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Skapar konto..." : "Skapa konto"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Genom att skapa konto godkänner du våra{" "}
                <Link to="/terms" className="underline hover:text-foreground">villkor</Link>
              </p>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Har du redan konto?{" "}
            <Link to="/login" className="text-foreground font-medium hover:underline">
              Logga in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-foreground items-center justify-center p-12">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-neon mx-auto mb-8 flex items-center justify-center">
            <span className="font-display text-4xl font-bold text-neon-foreground">S</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-background mb-4">
            Välkommen till SportsIN
          </h2>
          <p className="text-background/70">
            Plattformen som kopplar samman fotbollsspelare, klubbar och professionell personal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
