import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Play, User, ChevronUp, ChevronDown, Volume2, VolumeX, Upload, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Highlight {
  id: string;
  user_id: string;
  title: string | null;
  description: string | null;
  video_url: string;
  position: string | null;
  created_at: string;
  player_name?: string;
}

const Highlights = () => {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    fetchHighlights();

    const channel = supabase
      .channel("highlights-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "highlights" }, () => {
        fetchHighlights();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchHighlights = async () => {
    const { data, error } = await supabase
      .from("highlights")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching highlights:", error);
      return;
    }

    // Fetch profile names for each highlight
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map((h) => h.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const nameMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) ?? []);

      setHighlights(
        data.map((h) => ({ ...h, player_name: nameMap.get(h.user_id) || "Okänd" }))
      );
    } else {
      setHighlights([]);
    }

    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Välj en videofil");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error("Max filstorlek: 50 MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("highlights")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("highlights")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("highlights").insert({
        user_id: user.id,
        video_url: urlData.publicUrl,
        title: file.name.replace(/\.[^/.]+$/, ""),
      });

      if (insertError) throw insertError;

      toast.success("Highlight uppladdad!");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Uppladdning misslyckades");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const goToNext = () => {
    if (currentIndex < highlights.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const currentHighlight = highlights[currentIndex];

  return (
    <Layout hideFooter>
      <div className="fixed inset-0 top-16 bg-foreground flex items-center justify-center">
        <div className="relative h-full w-full max-w-md mx-auto">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-background animate-spin" />
            </div>
          ) : highlights.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
              <Play className="h-16 w-16 text-background/30" />
              <p className="text-background/60 text-center text-lg">Inga highlights ännu</p>
              {user && (
                <Button variant="neon" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Ladda upp din första highlight
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Video */}
              <div className="absolute inset-0 bg-foreground">
                <video
                  ref={videoRef}
                  src={currentHighlight?.video_url}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                />
              </div>

              {/* Navigation */}
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
                  disabled={currentIndex === highlights.length - 1}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-background/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown className="h-6 w-6" />
                </button>
              </div>

              {/* Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute right-4 top-4 w-10 h-10 rounded-full bg-background/10 flex items-center justify-center text-background hover:bg-background/20 transition-colors z-10"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              {/* Player Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground via-foreground/80 to-transparent z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-neon flex items-center justify-center">
                    <span className="font-display text-lg font-bold text-neon-foreground">
                      {currentHighlight?.player_name?.split(" ").map((n) => n[0]).join("") ?? "?"}
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-background text-lg">
                      {currentHighlight?.player_name}
                    </p>
                    {currentHighlight?.position && (
                      <p className="text-background/60 text-sm">{currentHighlight.position}</p>
                    )}
                    {currentHighlight?.title && (
                      <p className="text-background/40 text-xs">{currentHighlight.title}</p>
                    )}
                  </div>
                </div>

                <Link to={`/player/${currentHighlight?.user_id}`}>
                  <Button variant="neon" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Visa profil
                  </Button>
                </Link>
              </div>

              {/* Progress Indicators */}
              <div className="absolute top-4 left-4 right-16 flex gap-1 z-10">
                {highlights.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      index === currentIndex ? "bg-background" : "bg-background/30"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Upload Button (floating) */}
          {user && highlights.length > 0 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute left-4 bottom-6 w-12 h-12 rounded-full bg-neon flex items-center justify-center text-neon-foreground hover:bg-neon/80 transition-colors z-20 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            </button>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Highlights;
