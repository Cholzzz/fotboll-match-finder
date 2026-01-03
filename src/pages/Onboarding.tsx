import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Users, Trophy, ChevronRight, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

const onboardingSlides = [
  {
    icon: Video,
    title: "Upload your highlights",
    description: "Showcase your best moments and skills with short highlight videos that clubs can discover.",
  },
  {
    icon: Users,
    title: "Get discovered by clubs",
    description: "Clubs browse the feed to find talented players. Your highlights put you directly in front of scouts.",
  },
  {
    icon: Trophy,
    title: "Take control of your career",
    description: "Connect with clubs, attend trials, and take the next step in your football journey.",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigate("/register");
    }
  };

  const handleSkip = () => {
    navigate("/register");
  };

  const slide = onboardingSlides[currentSlide];
  const Icon = slide.icon;

  return (
    <>
      <Helmet>
        <title>Welcome to Fotbollin</title>
        <meta
          name="description"
          content="Join Fotbollin - the platform where football players and clubs connect. Upload highlights, get discovered, and take control of your career."
        />
      </Helmet>

      <div className="min-h-[100dvh] bg-background flex flex-col">
        {/* Skip button */}
        <div className="flex justify-end p-6">
          <button
            onClick={handleSkip}
            className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-neon/10 flex items-center justify-center mb-8 animate-pulse-neon">
            <Icon className="w-12 h-12 text-neon" />
          </div>

          {/* Text */}
          <div className="text-center max-w-sm animate-fade-in" key={currentSlide}>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              {slide.title}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {slide.description}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="p-8">
          {/* Progress indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {onboardingSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-8 bg-neon"
                    : i < currentSlide
                    ? "w-2 bg-neon/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Next button */}
          <Button
            onClick={handleNext}
            className="w-full btn-neon rounded-xl py-6 text-base font-semibold flex items-center justify-center gap-2"
          >
            {currentSlide < onboardingSlides.length - 1 ? (
              <>
                Continue
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              <>
                Get started
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}