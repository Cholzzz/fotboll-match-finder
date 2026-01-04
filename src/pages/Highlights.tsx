import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Play, User, ChevronUp, ChevronDown, Volume2, VolumeX } from "lucide-react";

const mockHighlights = [
  { id: "1", playerId: "1", playerName: "Erik Lindqvist", position: "CM" },
  { id: "2", playerId: "2", playerName: "Marcus Andersson", position: "ST" },
  { id: "3", playerId: "3", playerName: "Johan Svensson", position: "CB" },
  { id: "4", playerId: "4", playerName: "Oscar Nilsson", position: "LW" },
  { id: "5", playerId: "5", playerName: "Alexander Berg", position: "RB" },
];

const Highlights = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const goToNext = () => {
    if (currentIndex < mockHighlights.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentHighlight = mockHighlights[currentIndex];

  return (
    <Layout hideFooter>
      <div className="fixed inset-0 top-16 bg-foreground flex items-center justify-center">
        {/* Video Container */}
        <div className="relative h-full w-full max-w-md mx-auto">
          {/* Video Placeholder */}
          <div className="absolute inset-0 bg-foreground flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-background/10 flex items-center justify-center">
              <Play className="h-10 w-10 text-background ml-1" />
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-background/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronUp className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex === mockHighlights.length - 1}
              className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-background/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronDown className="h-6 w-6" />
            </button>
          </div>

          {/* Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="absolute right-4 top-4 w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-background/20 transition-colors z-10"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          {/* Player Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground via-foreground/80 to-transparent z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-neon flex items-center justify-center">
                <span className="font-display text-lg font-bold text-neon-foreground">
                  {currentHighlight.playerName.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div>
                <p className="font-display font-semibold text-background text-lg">
                  {currentHighlight.playerName}
                </p>
                <p className="text-background/60 text-sm">{currentHighlight.position}</p>
              </div>
            </div>

            <Link to={`/player/${currentHighlight.playerId}`}>
              <Button variant="neon" className="w-full">
                <User className="mr-2 h-4 w-4" />
                Visa profil
              </Button>
            </Link>
          </div>

          {/* Progress Indicators */}
          <div className="absolute top-4 left-4 right-16 flex gap-1 z-10">
            {mockHighlights.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index === currentIndex ? "bg-background" : "bg-background/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Highlights;