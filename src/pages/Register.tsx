import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft, User, Building2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"player" | "club" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store role and navigate
    if (role) {
      localStorage.setItem("fotbollin_role", role);
      navigate(role === "player" ? "/feed" : "/club-dashboard");
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | Fotbollin</title>
        <meta
          name="description"
          content="Create your Fotbollin account to showcase your football skills or discover talented players."
        />
      </Helmet>

      <div className="min-h-[100dvh] bg-background flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 px-6 pb-8">
          <div className="max-w-sm mx-auto">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Create account
            </h1>
            <p className="text-muted-foreground mb-8">
              Join Fotbollin and take the next step
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role selection */}
              <div className="space-y-3">
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("player")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      role === "player"
                        ? "border-neon bg-neon/10"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <User
                      className={`w-6 h-6 mx-auto mb-2 ${
                        role === "player" ? "text-neon" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        role === "player" ? "text-neon" : "text-foreground"
                      }`}
                    >
                      Player
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("club")}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      role === "club"
                        ? "border-neon bg-neon/10"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Building2
                      className={`w-6 h-6 mx-auto mb-2 ${
                        role === "club" ? "text-neon" : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        role === "club" ? "text-neon" : "text-foreground"
                      }`}
                    >
                      Club
                    </span>
                  </button>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {role === "club" ? "Club name" : "Full name"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={role === "club" ? "Enter club name" : "Enter your name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-secondary border-0"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-secondary border-0"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-secondary border-0"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full btn-neon rounded-xl py-6 text-base font-semibold"
                disabled={!role}
              >
                Create account
              </Button>
            </form>

            {/* Login link */}
            <p className="text-center text-muted-foreground text-sm mt-8">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-neon font-medium hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}