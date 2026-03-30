import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Save, User } from "lucide-react";

const positions = [
  "Målvakt", "Högerback", "Vänsterback", "Mittback", "Defensiv mittfältare",
  "Central mittfältare", "Offensiv mittfältare", "Högerytter", "Vänsterytter",
  "Anfallare", "Second striker"
];

const regions = [
  "Stockholm", "Göteborg", "Malmö", "Skåne", "Västra Götaland",
  "Östergötland", "Uppsala", "Norrbotten", "Västerbotten", "Jämtland",
  "Dalarna", "Gävleborg", "Södermanland", "Värmland", "Örebro",
  "Västmanland", "Halland", "Blekinge", "Kronoberg", "Kalmar", "Gotland"
];

const MyProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [position, setPosition] = useState("");
  const [preferredFoot, setPreferredFoot] = useState("");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [bio, setBio] = useState("");
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const fetchData = async () => {
      // Get profile name
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile) setProfileName(profile.full_name);

      // Get player profile
      const { data } = await supabase
        .from("player_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setPosition(data.position || "");
        setPreferredFoot(data.preferred_foot || "");
        setAge(data.age?.toString() || "");
        setRegion(data.region || "");
        setBio(data.bio || "");
      }
      setLoading(false);
    };
    fetchData();
  }, [user, authLoading, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const payload = {
      user_id: user.id,
      position: position || null,
      preferred_foot: preferredFoot || null,
      age: age ? parseInt(age) : null,
      region: region || null,
      bio: bio || null,
    };

    const { data: existing } = await supabase
      .from("player_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from("player_profiles")
        .update(payload)
        .eq("user_id", user.id));
    } else {
      ({ error } = await supabase
        .from("player_profiles")
        .insert(payload));
    }

    if (error) {
      toast({ title: "Fel", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sparad!", description: "Din profil har uppdaterats." });
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground">Laddar...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-neon flex items-center justify-center">
              <User className="h-6 w-6 text-neon-foreground" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Min profil</h1>
              <p className="text-muted-foreground text-sm">
                {profileName ? `Hej ${profileName}! ` : ""}Fyll i din spelarinformation
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger><SelectValue placeholder="Välj position" /></SelectTrigger>
                  <SelectContent>
                    {positions.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Stark fot</Label>
                <Select value={preferredFoot} onValueChange={setPreferredFoot}>
                  <SelectTrigger><SelectValue placeholder="Välj fot" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Höger">Höger</SelectItem>
                    <SelectItem value="Vänster">Vänster</SelectItem>
                    <SelectItem value="Båda">Båda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Ålder</Label>
                <Input
                  id="age"
                  type="number"
                  min="10"
                  max="50"
                  placeholder="T.ex. 22"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger><SelectValue placeholder="Välj region" /></SelectTrigger>
                  <SelectContent>
                    {regions.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Om mig</Label>
              <Textarea
                id="bio"
                placeholder="Berätta om dig själv som fotbollsspelare..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Sparar..." : "Spara profil"}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyProfile;
