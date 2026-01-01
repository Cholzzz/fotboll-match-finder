import { useState } from "react";
import Layout from "@/components/layout/Layout";
import TrialCard from "@/components/TrialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Users, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock trials data
const mockTrials = [
  {
    id: "1",
    clubName: "Djurgårdens IF",
    date: "15 januari 2026",
    time: "18:00 - 20:00",
    location: "Stockholms Stadion, Stockholm",
    positions: ["Central mittfältare", "Anfallare"],
    spotsLeft: 8,
  },
  {
    id: "2",
    clubName: "Hammarby IF",
    date: "18 januari 2026",
    time: "17:00 - 19:00",
    location: "Tele2 Arena, Stockholm",
    positions: ["Målvakt", "Mittback"],
    spotsLeft: 5,
  },
  {
    id: "3",
    clubName: "AIK",
    date: "22 januari 2026",
    time: "16:00 - 18:00",
    location: "Friends Arena, Solna",
    positions: ["Högerback", "Ytter mittfältare", "Anfallare"],
    spotsLeft: 12,
  },
  {
    id: "4",
    clubName: "IFK Göteborg",
    date: "25 januari 2026",
    time: "18:30 - 20:30",
    location: "Gamla Ullevi, Göteborg",
    positions: ["Defensiv mittfältare"],
    spotsLeft: 6,
  },
];

// Mock applied trials for player view
const mockAppliedTrials = ["2"];

const Trials = () => {
  const [appliedTrials, setAppliedTrials] = useState<string[]>(mockAppliedTrials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApply = (trialId: string) => {
    setAppliedTrials([...appliedTrials, trialId]);
    toast({
      title: "Anmälan skickad!",
      description: "Du har anmält dig till provträningen.",
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Provträningar</h1>
            <p className="text-muted-foreground mt-2">
              Anmäl dig till provträningar eller skapa egna för din klubb
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Skapa provträning
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-display">Skapa provträning</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Datum</Label>
                    <Input id="date" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Tid</Label>
                    <Input id="time" type="time" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Plats</Label>
                  <Input id="location" placeholder="T.ex. Stockholms Stadion" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="positions">Positioner som söks</Label>
                  <Input id="positions" placeholder="T.ex. Anfallare, Mittfältare" required />
                  <p className="text-xs text-muted-foreground">Separera med komma</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Beskrivning</Label>
                  <Textarea
                    id="description"
                    placeholder="Beskriv provträningen..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Avbryt
                  </Button>
                  <Button type="submit" onClick={(e) => {
                    e.preventDefault();
                    setIsDialogOpen(false);
                    toast({
                      title: "Provträning skapad!",
                      description: "Din provträning är nu publicerad.",
                    });
                  }}>
                    Publicera
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="available" className="gap-2">
              <Calendar className="h-4 w-4" />
              Tillgängliga
            </TabsTrigger>
            <TabsTrigger value="applied" className="gap-2">
              <Check className="h-4 w-4" />
              Mina anmälningar
            </TabsTrigger>
            <TabsTrigger value="managing" className="gap-2">
              <Users className="h-4 w-4" />
              Mina provträningar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-0">
            <div className="grid md:grid-cols-2 gap-4">
              {mockTrials.map((trial) => (
                <TrialCard
                  key={trial.id}
                  {...trial}
                  isApplied={appliedTrials.includes(trial.id)}
                  onApply={() => handleApply(trial.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applied" className="mt-0">
            <div className="grid md:grid-cols-2 gap-4">
              {mockTrials
                .filter((trial) => appliedTrials.includes(trial.id))
                .map((trial) => (
                  <TrialCard
                    key={trial.id}
                    {...trial}
                    isApplied={true}
                  />
                ))}
            </div>
            {appliedTrials.length === 0 && (
              <div className="text-center py-16 bg-muted/30 rounded-xl">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Du har inte anmält dig till några provträningar ännu</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="managing" className="mt-0">
            <div className="bg-card rounded-xl border border-border p-8 shadow-card">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Hantera dina provträningar
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Här kan du se anmälda spelare och hantera dina provträningar som klubb.
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Skapa provträning
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Trials;
