import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building2, Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";

type Role = "player" | "club" | null;

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") as Role;
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register:", { role: selectedRole, email, password });
  };

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
              <span className="font-display text-lg font-bold text-background">F</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">fotbollin</span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Skapa konto
          </h1>
          <p className="text-muted-foreground mb-8">
            Välj din roll och kom igång på några sekunder
          </p>

          {!selectedRole ? (
            <div className="space-y-3">
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
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted mb-6">
                {selectedRole === "player" ? (
                  <User className="h-5 w-5 text-foreground" />
                ) : (
                  <Building2 className="h-5 w-5 text-foreground" />
                )}
                <span className="text-sm font-medium text-foreground">
                  {selectedRole === "player" ? "Spelarregistrering" : "Klubbregistrering"}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                >
                  Ändra
                </button>
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

              <Button type="submit" className="w-full" size="lg">
                Skapa konto
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
            <span className="font-display text-4xl font-bold text-neon-foreground">F</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-background mb-4">
            Välkommen till Fotbollin
          </h2>
          <p className="text-background/70">
            Plattformen som kopplar samman ambitiösa fotbollsspelare med klubbar som söker talang.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;