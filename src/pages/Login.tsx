import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Inloggad!",
        description: "Välkommen tillbaka.",
      });

      // Redirect based on user role
      if (data.user) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (roles?.role === 'club') {
          navigate('/dashboard');
        } else if (['physiotherapist', 'coach', 'analyst', 'scout', 'nutritionist', 'mental_coach'].includes(roles?.role || '')) {
          navigate('/my-staff-profile');
        } else if (roles?.role === 'player') {
          navigate('/my-profile');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast({
        title: "Fel vid inloggning",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
              <span className="font-display text-lg font-bold text-background">S</span>
            </div>
            <span className="font-display text-xl font-bold text-foreground">SportsIN</span>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
            Välkommen tillbaka
          </h1>
          <p className="text-muted-foreground mb-8">
            Logga in på ditt konto för att fortsätta
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Lösenord</Label>
                <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
                  Glömt lösenord?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Ange ditt lösenord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Loggar in..." : "Logga in"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Har du inget konto?{" "}
            <Link to="/register" className="text-foreground font-medium hover:underline">
              Skapa konto
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
            Klar för match?
          </h2>
          <p className="text-background/70">
            Logga in och se vilka klubbar som har visat intresse för din profil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
