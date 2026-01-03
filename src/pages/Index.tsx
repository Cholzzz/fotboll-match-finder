import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Users, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Index() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Fotbollin | Where Football Talent Meets Opportunity</title>
        <meta
          name="description"
          content="Fotbollin is the platform where football players showcase their skills and clubs discover new talent. Upload highlights, get discovered, take control of your career."
        />
      </Helmet>

      <div className="min-h-[100dvh] bg-background flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground mb-3">
              Fotboll<span className="text-neon">in</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Where talent meets opportunity
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-md">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
              <Play className="w-4 h-4 text-neon" />
              <span className="text-sm text-foreground">Video highlights</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
              <Users className="w-4 h-4 text-neon" />
              <span className="text-sm text-foreground">Direct connections</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
              <Trophy className="w-4 h-4 text-neon" />
              <span className="text-sm text-foreground">Trial invites</span>
            </div>
          </div>

          {/* Video preview mockup */}
          <div className="relative w-48 h-80 rounded-3xl overflow-hidden mb-12 glow-border">
            <img
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&h=500&fit=crop"
              alt="Football highlight"
              className="w-full h-full object-cover"
            />
            <div className="video-overlay-gradient absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-neon/90 flex items-center justify-center animate-pulse-neon">
                <Play className="w-6 h-6 text-neon-foreground ml-0.5" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-sm font-medium text-foreground">
                Discover players
              </p>
              <p className="text-xs text-muted-foreground">Swipe to explore</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-neon" />
            <p className="text-muted-foreground">
              TikTok meets LinkedIn for football
            </p>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="p-6 space-y-3">
          <Button
            onClick={() => navigate("/role-select")}
            className="w-full btn-neon rounded-xl py-6 text-base font-semibold flex items-center justify-center gap-2"
          >
            Get started
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/login")}
            className="w-full rounded-xl py-6 text-base font-semibold"
          >
            I already have an account
          </Button>
        </div>

        {/* Demo links for prototype */}
        <div className="p-6 pt-0">
          <div className="border-t border-border pt-6">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Prototype quick access
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => navigate("/feed")}
                className="text-xs text-neon hover:underline"
              >
                Player Feed
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => navigate("/club-dashboard")}
                className="text-xs text-neon hover:underline"
              >
                Club Dashboard
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => navigate("/player/1")}
                className="text-xs text-neon hover:underline"
              >
                Player Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}