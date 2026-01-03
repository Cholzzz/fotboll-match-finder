import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check stored role and navigate accordingly
    const role = localStorage.getItem("fotbollin_role");
    navigate(role === "club" ? "/club-dashboard" : "/feed");
  };

  return (
    <>
      <Helmet>
        <title>Log In | Fotbollin</title>
        <meta
          name="description"
          content="Log in to your Fotbollin account to continue your football journey."
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
        <div className="flex-1 px-6 pb-8 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            {/* Logo */}
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                Fotboll<span className="text-neon">in</span>
              </h1>
              <p className="text-muted-foreground">Welcome back</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-xs text-neon hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
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
              >
                Log in
              </Button>
            </form>

            {/* Register link */}
            <p className="text-center text-muted-foreground text-sm mt-8">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-neon font-medium hover:underline"
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}