import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  userId: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  name?: string;
}

const AvatarUpload = ({ userId, currentUrl, onUploaded, name }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Fel", description: "Välj en bildfil (JPG, PNG, etc.)", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Fel", description: "Bilden får vara max 5 MB", variant: "destructive" });
      return;
    }

    // Show local preview immediately
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/avatar.${ext}`;

    // Remove old avatar files first
    const { data: existing } = await supabase.storage.from("avatars").list(userId);
    if (existing?.length) {
      await supabase.storage.from("avatars").remove(existing.map(f => `${userId}/${f.name}`));
    }

    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });

    if (error) {
      toast({ title: "Uppladdningsfel", description: error.message, variant: "destructive" });
      setPreview(null);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    // Update profile avatar_url
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", userId);

    onUploaded(publicUrl);
    setUploading(false);
    toast({ title: "Klart!", description: "Profilbilden har uppdaterats." });
  };

  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
        <Avatar className="h-24 w-24 border-2 border-border">
          <AvatarImage src={preview || currentUrl || undefined} alt="Profilbild" />
          <AvatarFallback className="text-lg bg-muted">
            {initials || <User className="h-8 w-8" />}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "Laddar upp..." : "Byt profilbild"}
      </Button>
    </div>
  );
};

export default AvatarUpload;
