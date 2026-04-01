import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, User, Calendar, Eye, ClipboardList, EyeOff, BarChart3, XCircle } from "lucide-react";
import AvatarUpload from "@/components/AvatarUpload";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

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

const contractStatuses = [
  { value: "free_agent", label: "Kontraktslös" },
  { value: "looking", label: "Söker klubb" },
  { value: "has_club", label: "Har klubb" },
];

const MyProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [position, setPosition] = useState("");
  const [preferredFoot, setPreferredFoot] = useState("");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [bio, setBio] = useState("");
  const [profileName, setProfileName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [contractStatus, setContractStatus] = useState("free_agent");
  const [visibility, setVisibility] = useState("visible");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const fetchData = async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profile) {
        setProfileName(profile.full_name);
        setAvatarUrl(profile.avatar_url);
      }

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
        setContractStatus((data as any).contract_status || "free_agent");
        setVisibility((data as any).visibility || "visible");
      }
      setLoading(false);
    };
    fetchData();
  }, [user, authLoading, navigate]);

  // Dashboard data
  const { data: myBookings = [] } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("client_user_id", user!.id)
        .order("booking_date", { ascending: true });
      return data || [];
    },
    enabled: !!user && !loading,
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: ["my-trial-apps-dashboard", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("trial_applications")
        .select("*, trials(*)")
        .eq("player_user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user && !loading,
  });

  const { data: profileViewCount = 0 } = useQuery({
    queryKey: ["my-profile-views", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("profile_views" as any)
        .select("*", { count: "exact", head: true })
        .eq("player_user_id", user!.id);
      return count || 0;
    },
    enabled: !!user && !loading,
  });

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
      contract_status: contractStatus,
      visibility,
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
      setSaving(false);
    } else {
      toast({ title: "Sparad!", description: "Din profil har uppdaterats." });
      setSaving(false);
      navigate(`/player/${user.id}`);
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container py-8 max-w-3xl space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <div className="flex flex-col items-center gap-4 mb-8">
          <AvatarUpload
            userId={user!.id}
            currentUrl={avatarUrl}
            onUploaded={setAvatarUrl}
            name={profileName}
          />
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">Min profil</h1>
            <p className="text-muted-foreground text-sm">
              {profileName ? `Hej ${profileName}!` : "Fyll i din spelarinformation"}
            </p>
          </div>
        </div>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="edit" className="gap-2">
              <User className="h-4 w-4" /> Redigera profil
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <ClipboardList className="h-4 w-4" /> Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
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
                    id="age" type="number" min="10" max="50"
                    placeholder="T.ex. 22" value={age}
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={contractStatus} onValueChange={setContractStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {contractStatuses.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Profilsynlighet</Label>
                  <div className="flex items-center gap-3 pt-2">
                    <Switch
                      checked={visibility === "visible"}
                      onCheckedChange={(checked) => setVisibility(checked ? "visible" : "hidden")}
                    />
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                      {visibility === "visible" ? (
                        <><Eye className="h-4 w-4" /> Synlig för klubbar</>
                      ) : (
                        <><EyeOff className="h-4 w-4" /> Dold för klubbar</>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Om mig</Label>
                <Textarea
                  id="bio" placeholder="Berätta om dig själv som fotbollsspelare..."
                  value={bio} onChange={e => setBio(e.target.value)} rows={4}
                />
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full" size="lg">
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Sparar..." : "Spara profil"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{profileViewCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Profilvisningar</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{myApplications.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Anmälningar</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{myBookings.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Bokningar</p>
              </div>
            </div>

            {/* Trial applications */}
            <div className="rounded-2xl border border-border bg-card p-6 mb-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Mina provträningsanmälningar
              </h3>
              {myApplications.length === 0 ? (
                <p className="text-sm text-muted-foreground">Inga anmälningar ännu.</p>
              ) : (
                <div className="space-y-3">
                  {myApplications.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-muted">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {app.trials?.title || "Provträning"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {app.trials?.trial_date} • {app.trials?.location}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        app.status === "accepted" ? "bg-neon/10 text-neon" :
                        app.status === "rejected" ? "bg-destructive/10 text-destructive" :
                        "bg-muted-foreground/10 text-muted-foreground"
                      }`}>
                        {app.status === "accepted" ? "Godkänd" :
                         app.status === "rejected" ? "Nekad" : "Väntande"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookings */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <ClipboardList className="h-5 w-5" /> Mina bokningar
              </h3>
              {myBookings.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-3">Inga bokningar ännu.</p>
                  <Link to="/search-staff">
                    <Button variant="outline" size="sm">Hitta personal</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myBookings.map((b: any) => (
                    <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {b.service_name || "Session"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {b.booking_date} • {b.start_time?.slice(0, 5)} - {b.end_time?.slice(0, 5)}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        b.status === "confirmed" ? "bg-neon/10 text-neon" :
                        b.status === "cancelled" ? "bg-destructive/10 text-destructive" :
                        "bg-muted-foreground/10 text-muted-foreground"
                      }`}>
                        {b.status === "confirmed" ? "Bekräftad" :
                         b.status === "cancelled" ? "Avbokad" : "Väntande"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyProfile;
