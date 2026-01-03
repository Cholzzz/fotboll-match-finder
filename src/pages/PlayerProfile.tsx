import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, MessageCircle, ArrowLeft, Zap, Trophy, BarChart3, Share2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

const mockPlayer = {
  id: "1",
  name: "Marcus Lindqvist",
  heroVideo: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=1200&fit=crop",
  bio: "Creative and technical midfielder with excellent vision and passing ability. I thrive in controlling the tempo of the game and creating chances for my teammates. Currently looking for new challenges at a competitive level where I can develop further as a player.",
  strengths: [
    "Excellent ball control and first touch",
    "Creative passing and vision",
    "Set-piece specialist",
    "High work rate and stamina",
    "Leadership on the pitch",
  ],
  clubs: [
    { name: "IF Brommapojkarna", period: "2022 - Present", role: "First Team" },
    { name: "AIK U21", period: "2020 - 2022", role: "Youth Team" },
    { name: "Djurgårdens IF U19", period: "2018 - 2020", role: "Academy" },
  ],
  stats: {
    matches: 45,
    goals: 12,
    assists: 18,
    avgRating: 7.4,
  },
};

const PlayerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{mockPlayer.name} | Player Profile | Fotbollin</title>
        <meta
          name="description"
          content={`View ${mockPlayer.name}'s football profile, highlights, and career history on Fotbollin.`}
        />
      </Helmet>

      <div className="min-h-[100dvh] bg-background">
        {/* Hero Video Section */}
        <div className="relative h-[60vh] min-h-[400px]">
          <img
            src={mockPlayer.heroVideo}
            alt={mockPlayer.name}
            className="w-full h-full object-cover"
          />
          <div className="video-overlay-gradient absolute inset-0" />

          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-20 p-2 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Share button */}
          <button className="absolute top-6 right-6 z-20 p-2 rounded-full bg-background/30 backdrop-blur-sm text-foreground hover:bg-background/50 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <button className="w-20 h-20 rounded-full bg-neon/90 flex items-center justify-center hover:scale-110 transition-transform animate-pulse-neon">
              <Play className="w-8 h-8 text-neon-foreground ml-1" />
            </button>
          </div>

          {/* Player name overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              {mockPlayer.name}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* CTA Button */}
          <Button className="w-full btn-neon rounded-xl py-6 text-base font-semibold">
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact player
          </Button>

          {/* Bio */}
          <div className="card-elevated p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              About me
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {mockPlayer.bio}
            </p>
          </div>

          {/* Strengths */}
          <div className="card-elevated p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-neon" />
              Strengths
            </h2>
            <div className="space-y-3">
              {mockPlayer.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary"
                >
                  <div className="w-2 h-2 rounded-full bg-neon flex-shrink-0" />
                  <span className="text-foreground">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Club History */}
          <div className="card-elevated p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-neon" />
              Club history
            </h2>
            <div className="space-y-4">
              {mockPlayer.clubs.map((club, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{club.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {club.period} · {club.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="card-elevated p-6">
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-neon" />
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary text-center">
                <p className="text-3xl font-display font-bold text-neon">
                  {mockPlayer.stats.matches}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Matches</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary text-center">
                <p className="text-3xl font-display font-bold text-neon">
                  {mockPlayer.stats.goals}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Goals</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary text-center">
                <p className="text-3xl font-display font-bold text-neon">
                  {mockPlayer.stats.assists}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Assists</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary text-center">
                <p className="text-3xl font-display font-bold text-neon">
                  {mockPlayer.stats.avgRating}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Avg Rating</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              * Statistics are placeholder data for prototype purposes
            </p>
          </div>

          {/* Bottom spacing */}
          <div className="h-6" />
        </div>
      </div>
    </>
  );
};

export default PlayerProfile;