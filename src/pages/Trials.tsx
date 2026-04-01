import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Users, Check, MapPin, Clock, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

const Trials = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    trial_date: "",
    start_time: "",
    end_time: "",
    location: "",
    positions: "",
    max_spots: "20",
    description: "",
  });

  // Check user role
  const { data: userRole } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      return data?.role || null;
    },
    enabled: !!user,
  });

  const isClub = userRole === "club";

  // Fetch all trials with club name
  const { data: trials = [], isLoading } = useQuery({
    queryKey: ["trials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trials")
        .select("*")
        .order("trial_date", { ascending: true });
      if (error) throw error;

      // Get club names
      const clubIds = [...new Set((data || []).map((t: any) => t.club_user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", clubIds);

      const nameMap = new Map((profiles || []).map((p: any) => [p.user_id, p.full_name]));

      return (data || []).map((t: any) => ({
        ...t,
        clubName: nameMap.get(t.club_user_id) || "Okänd klubb",
        positions: Array.isArray(t.positions) ? t.positions : [],
      }));
    },
  });

  // Fetch user's applications
  const { data: myApplications = [] } = useQuery({
    queryKey: ["my-trial-applications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("trial_applications")
        .select("trial_id")
        .eq("player_user_id", user.id);
      return (data || []).map((a: any) => a.trial_id);
    },
    enabled: !!user,
  });

  // Fetch application counts per trial (for club owners)
  const { data: applicationCounts = {} } = useQuery({
    queryKey: ["trial-application-counts", user?.id],
    queryFn: async () => {
      if (!user) return {};
      const myTrialIds = trials.filter((t: any) => t.club_user_id === user.id).map((t: any) => t.id);
      if (!myTrialIds.length) return {};
      const { data } = await supabase
        .from("trial_applications")
        .select("trial_id")
        .in("trial_id", myTrialIds);
      const counts: Record<string, number> = {};
      (data || []).forEach((a: any) => {
        counts[a.trial_id] = (counts[a.trial_id] || 0) + 1;
      });
      return counts;
    },
    enabled: !!user && isClub && trials.length > 0,
  });

  // Apply mutation
  const applyMutation = useMutation({
    mutationFn: async (trialId: string) => {
      const { error } = await supabase
        .from("trial_applications")
        .insert({ trial_id: trialId, player_user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-trial-applications"] });
      toast({ title: "Anmälan skickad!", description: "Du har anmält dig till provträningen." });
    },
    onError: (err: any) => {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    },
  });

  // Create trial mutation
  const createMutation = useMutation({
    mutationFn: async () => {
      const positions = formData.positions.split(",").map((p) => p.trim()).filter(Boolean);
      const { error } = await supabase.from("trials").insert({
        club_user_id: user!.id,
        title: formData.title || null,
        trial_date: formData.trial_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location,
        positions,
        max_spots: parseInt(formData.max_spots) || 20,
        description: formData.description || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trials"] });
      setIsDialogOpen(false);
      setFormData({ title: "", trial_date: "", start_time: "", end_time: "", location: "", positions: "", max_spots: "20", description: "" });
      toast({ title: "Provträning skapad!", description: "Din provträning är nu publicerad." });
    },
    onError: (err: any) => {
      toast({ title: "Fel", description: err.message, variant: "destructive" });
    },
  });

  const myTrials = trials.filter((t: any) => t.club_user_id === user?.id);
  const appliedTrials = trials.filter((t: any) => myApplications.includes(t.id));

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "d MMMM yyyy", { locale: sv });
    } catch {
      return dateStr;
    }
  };

  const TrialCard = ({ trial, isApplied }: { trial: any; isApplied: boolean }) => (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display font-semibold text-foreground">
            {trial.title || trial.clubName}
          </h3>
          <p className="text-sm text-muted-foreground">{trial.clubName}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatDate(trial.trial_date)}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {trial.start_time?.slice(0, 5)} - {trial.end_time?.slice(0, 5)}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {trial.location}
        </div>
      </div>

      {trial.positions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {trial.positions.map((pos: string) => (
            <span key={pos} className="px-2 py-0.5 rounded bg-neon/10 text-neon text-xs font-medium">
              {pos}
            </span>
          ))}
        </div>
      )}

      {trial.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{trial.description}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {isClub && trial.club_user_id === user?.id
            ? `${(applicationCounts as any)[trial.id] || 0} anmälda`
            : `Max ${trial.max_spots} platser`}
        </span>
        {!isClub && user && (
          isApplied ? (
            <Button variant="outline" size="sm" disabled>
              <Check className="mr-1 h-3 w-3" /> Anmäld
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => applyMutation.mutate(trial.id)}
              disabled={applyMutation.isPending}
            >
              Anmäl dig
            </Button>
          )
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Provträningar</h1>
            <p className="text-muted-foreground mt-2">
              {isClub ? "Skapa och hantera provträningar för din klubb" : "Anmäl dig till provträningar"}
            </p>
          </div>

          {isClub && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="neon">
                  <Plus className="mr-2 h-4 w-4" /> Skapa provträning
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-display">Skapa provträning</DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4 mt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    createMutation.mutate();
                  }}
                >
                  <div className="space-y-2">
                    <Label>Titel (valfritt)</Label>
                    <Input
                      placeholder="T.ex. Vårens provspel"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Datum</Label>
                      <Input
                        type="date"
                        required
                        value={formData.trial_date}
                        onChange={(e) => setFormData({ ...formData, trial_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start</Label>
                      <Input
                        type="time"
                        required
                        value={formData.start_time}
                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Slut</Label>
                      <Input
                        type="time"
                        required
                        value={formData.end_time}
                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Plats</Label>
                    <Input
                      placeholder="T.ex. Stockholms Stadion"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Positioner som söks</Label>
                      <Input
                        placeholder="Anfallare, Mittfältare"
                        required
                        value={formData.positions}
                        onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">Separera med komma</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Max antal platser</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.max_spots}
                        onChange={(e) => setFormData({ ...formData, max_spots: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Beskrivning</Label>
                    <Textarea
                      placeholder="Beskriv provträningen..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Avbryt
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Skapar...</>
                      ) : (
                        "Publicera"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-6 bg-muted p-1 rounded-xl">
            <TabsTrigger value="available" className="gap-2 rounded-lg data-[state=active]:bg-background">
              <Calendar className="h-4 w-4" /> Tillgängliga
            </TabsTrigger>
            {!isClub && (
              <TabsTrigger value="applied" className="gap-2 rounded-lg data-[state=active]:bg-background">
                <Check className="h-4 w-4" /> Mina anmälningar
              </TabsTrigger>
            )}
            {isClub && (
              <TabsTrigger value="managing" className="gap-2 rounded-lg data-[state=active]:bg-background">
                <Users className="h-4 w-4" /> Mina provträningar
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="available" className="mt-0">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
              </div>
            ) : trials.length === 0 ? (
              <div className="text-center py-16 bg-muted/30 rounded-2xl">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Inga provträningar publicerade ännu</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {trials.map((trial: any) => (
                  <TrialCard key={trial.id} trial={trial} isApplied={myApplications.includes(trial.id)} />
                ))}
              </div>
            )}
          </TabsContent>

          {!isClub && (
            <TabsContent value="applied" className="mt-0">
              {appliedTrials.length === 0 ? (
                <div className="text-center py-16 bg-muted/30 rounded-2xl">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Du har inte anmält dig till några provträningar ännu</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {appliedTrials.map((trial: any) => (
                    <TrialCard key={trial.id} trial={trial} isApplied={true} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {isClub && (
            <TabsContent value="managing" className="mt-0">
              {myTrials.length === 0 ? (
                <div className="text-center py-16 bg-muted/30 rounded-2xl">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    Du har inga provträningar
                  </h3>
                  <p className="text-muted-foreground mb-6">Skapa din första provträning.</p>
                  <Button variant="neon" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Skapa provträning
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {myTrials.map((trial: any) => (
                    <TrialCard key={trial.id} trial={trial} isApplied={false} />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Trials;
