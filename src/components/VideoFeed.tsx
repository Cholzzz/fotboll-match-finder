import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, User, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface VideoItem {
  id: string;
  playerName: string;
  playerId: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

const mockVideos: VideoItem[] = [
  {
    id: "1",
    playerName: "Marcus Lindqvist",
    playerId: "1",
    videoUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=1000&fit=crop",
    likes: 1247,
    comments: 89,
    isLiked: false,
    isSaved: false,
  },
  {
    id: "2",
    playerName: "Erik Johansson",
    playerId: "2",
    videoUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=1000&fit=crop",
    likes: 892,
    comments: 45,
    isLiked: true,
    isSaved: false,
  },
  {
    id: "3",
    playerName: "Oscar Nilsson",
    playerId: "3",
    videoUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=1000&fit=crop",
    likes: 2103,
    comments: 156,
    isLiked: false,
    isSaved: true,
  },
  {
    id: "4",
    playerName: "Alexander Berg",
    playerId: "4",
    videoUrl: "",
    thumbnailUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=1000&fit=crop",
    likes: 567,
    comments: 23,
    isLiked: false,
    isSaved: false,
  },
];

export function VideoFeed() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videos, setVideos] = useState(mockVideos);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const currentVideo = videos[currentIndex];

  useEffect(() => {
    // Simulate video progress
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = touchStartY.current - touchEndY.current;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 0) handleNext();
    if (e.deltaY < 0) handlePrev();
  };

  const toggleLike = () => {
    setVideos((prev) =>
      prev.map((v, i) =>
        i === currentIndex
          ? { ...v, isLiked: !v.isLiked, likes: v.isLiked ? v.likes - 1 : v.likes + 1 }
          : v
      )
    );
  };

  const toggleSave = () => {
    setVideos((prev) =>
      prev.map((v, i) =>
        i === currentIndex ? { ...v, isSaved: !v.isSaved } : v
      )
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[100dvh] w-full bg-background overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        <img
          src={currentVideo.thumbnailUrl}
          alt={currentVideo.playerName}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {/* Gradient overlay */}
        <div className="video-overlay-gradient absolute inset-0" />
      </div>

      {/* Navigation hints */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-background/30 backdrop-blur-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
        {currentIndex < videos.length - 1 && (
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-background/30 backdrop-blur-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-20">
        <button
          onClick={toggleLike}
          className="flex flex-col items-center gap-1 transition-transform active:scale-90"
        >
          <div
            className={`p-3 rounded-full ${
              currentVideo.isLiked
                ? "bg-red-500 text-white"
                : "bg-background/30 backdrop-blur-sm text-foreground"
            } transition-colors`}
          >
            <Heart className={`w-6 h-6 ${currentVideo.isLiked ? "fill-current" : ""}`} />
          </div>
          <span className="text-xs font-medium text-foreground">{currentVideo.likes}</span>
        </button>

        <button className="flex flex-col items-center gap-1 transition-transform active:scale-90">
          <div className="p-3 rounded-full bg-background/30 backdrop-blur-sm text-foreground">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-foreground">{currentVideo.comments}</span>
        </button>

        <button
          onClick={toggleSave}
          className="flex flex-col items-center gap-1 transition-transform active:scale-90"
        >
          <div
            className={`p-3 rounded-full ${
              currentVideo.isSaved
                ? "bg-neon text-neon-foreground"
                : "bg-background/30 backdrop-blur-sm text-foreground"
            } transition-colors`}
          >
            <Bookmark className={`w-6 h-6 ${currentVideo.isSaved ? "fill-current" : ""}`} />
          </div>
          <span className="text-xs font-medium text-foreground">Save</span>
        </button>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        {/* Player info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center ring-2 ring-neon">
            <User className="w-5 h-5 text-neon" />
          </div>
          <span className="font-display font-semibold text-lg text-foreground">
            {currentVideo.playerName}
          </span>
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => navigate(`/player/${currentVideo.playerId}`)}
          className="w-full btn-neon rounded-xl py-6 text-base font-semibold"
        >
          View player profile
        </Button>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-foreground/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-neon transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Video indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {videos.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-6 bg-neon" : "w-1.5 bg-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}