import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Ruler, Footprints, FileText, Play, MessageCircle, Clock, Building2 } from "lucide-react";

const mockPlayer = {
  id: "1",
  name: "Erik Lindqvist",
  position: "Central mittfältare",
  age: 23,
  height: 182,
  strongFoot: "Höger",
  region: "Stockholm",
  bio: "Teknisk och spelskicklig mittfältare med god speluppfattning. Trivs med att styra tempot i spelet och har ett starkt passningsspel. Letar efter nya utmaningar på hög nivå.",
  clubs: [
    { name: "IF Brommapojkarna U21", years: "2021-2023" },
    { name: "Vasalunds IF", years: "2019-2021" },
  ],
  contractStatus: "Kontraktslös",
  highlights: [
    { id: "1", title: "Säsongshöjdpunkter 2023", thumbnail: "" },
    { id: "2", title: "Mål och assist kompilering", thumbnail: "" },
  ],
};

const PlayerProfile = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="container py-8">
        {/* Profile Header */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="bg-foreground p-8 pb-20" />
          
          <div className="px-6 md:px-8 pb-6 -mt-12">
            <div className="flex flex-col md:flex-row md:items-end gap-5">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-neon border-4 border-card flex items-center justify-center flex-shrink-0">
                <span className="font-display text-3xl font-bold text-neon-foreground">
                  {mockPlayer.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {mockPlayer.name}
                </h1>
                <p className="text-muted-foreground mt-1">{mockPlayer.position}</p>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {mockPlayer.age} år
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Ruler className="h-4 w-4" />
                    {mockPlayer.height} cm
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Footprints className="h-4 w-4" />
                    {mockPlayer.strongFoot} fot
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {mockPlayer.region}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="md:ml-auto">
                <Button variant="neon" size="lg">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Kontakta spelare
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Om mig
              </h2>
              <p className="text-muted-foreground leading-relaxed">{mockPlayer.bio}</p>
            </div>

            {/* Highlights */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Play className="h-5 w-5" />
                Highlights
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {mockPlayer.highlights.map((video) => (
                  <div
                    key={video.id}
                    className="group relative aspect-video rounded-xl bg-muted overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <div className="w-14 h-14 rounded-full bg-neon flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-neon-foreground ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent">
                      <p className="text-sm font-medium text-background">{video.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Physical Status Placeholder */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Fysisk status
              </h2>
              <div className="bg-muted rounded-xl p-8 text-center">
                <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">Fysiska tester – kommer snart</p>
                <p className="text-sm text-muted-foreground/80 mt-1">
                  Snart kan du se spelarens fysiska data här
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contract Status */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-3">Kontraktsstatus</h3>
              <span className="inline-flex px-3 py-1.5 rounded-lg bg-neon/10 text-neon text-sm font-medium">
                {mockPlayer.contractStatus}
              </span>
            </div>

            {/* Career */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Karriär
              </h3>
              <div className="space-y-4">
                {mockPlayer.clubs.map((club, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-foreground mt-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{club.name}</p>
                      <p className="text-sm text-muted-foreground">{club.years}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlayerProfile;