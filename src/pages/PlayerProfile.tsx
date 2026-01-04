import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Calendar, 
  Ruler, 
  Footprints, 
  FileText, 
  Play, 
  MessageCircle, 
  Building2,
  TrendingUp,
  Activity,
  Timer,
  Zap,
  Heart,
  CheckCircle2,
  AlertCircle,
  Shield,
  Weight
} from "lucide-react";

const mockPlayer = {
  id: "1",
  name: "Erik Lindqvist",
  position: "Central mittfältare",
  age: 23,
  height: 182,
  weight: 76,
  strongFoot: "Höger",
  region: "Stockholm",
  city: "Solna",
  contractStatus: "Kontraktslös",
  bio: "Teknisk och spelskicklig mittfältare med god speluppfattning. Trivs med att styra tempot i spelet och har ett starkt passningsspel. Letar efter nya utmaningar på hög nivå. Jag är en lagspelare som alltid ger 100% på träning och match.",
  clubs: [
    { name: "IF Brommapojkarna U21", years: "2021-2023", division: "Superettan" },
    { name: "Vasalunds IF", years: "2019-2021", division: "Division 1" },
    { name: "Sollentuna FK", years: "2017-2019", division: "Division 2" },
  ],
  seasonStats: [
    { season: "2023", matches: 28, minutes: 2340, goals: 7, assists: 12 },
    { season: "2022", matches: 24, minutes: 1980, goals: 4, assists: 8 },
    { season: "2021", matches: 18, minutes: 1240, goals: 2, assists: 5 },
  ],
  physicalTests: [
    { 
      name: "Sprint 40m", 
      value: "5.2s", 
      date: "2024-01-15", 
      source: "gps",
      percentile: 85
    },
    { 
      name: "Uthållighet (Yo-Yo)", 
      value: "Nivå 18.5", 
      date: "2024-01-10", 
      source: "coach",
      percentile: 78
    },
    { 
      name: "Vertikal hopp", 
      value: "58 cm", 
      date: "2024-01-15", 
      source: "gps",
      percentile: 82
    },
    { 
      name: "5-10-5 Agility", 
      value: "4.8s", 
      date: "2024-01-12", 
      source: "self",
      percentile: null
    },
  ],
  highlights: [
    { id: "1", title: "Säsongshöjdpunkter 2023" },
    { id: "2", title: "Mål mot Djurgården U21" },
    { id: "3", title: "Assist-kompilering" },
  ],
};

const getSourceBadge = (source: string) => {
  switch (source) {
    case "gps":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium badge-gps-verified">
          <Shield className="h-3 w-3" />
          GPS-verifierad
        </span>
      );
    case "coach":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium badge-coach-verified">
          <CheckCircle2 className="h-3 w-3" />
          Coachverifierad
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium badge-self-reported">
          <AlertCircle className="h-3 w-3" />
          Egenrapporterad
        </span>
      );
  }
};

const PlayerProfile = () => {
  const { id } = useParams();
  
  const totalStats = mockPlayer.seasonStats.reduce(
    (acc, s) => ({
      matches: acc.matches + s.matches,
      minutes: acc.minutes + s.minutes,
      goals: acc.goals + s.goals,
      assists: acc.assists + s.assists,
    }),
    { matches: 0, minutes: 0, goals: 0, assists: 0 }
  );

  return (
    <Layout>
      <div className="container py-8">
        {/* Profile Header */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="bg-foreground p-8 pb-24" />
          
          <div className="px-6 md:px-8 pb-6 -mt-16">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl bg-neon border-4 border-card flex items-center justify-center flex-shrink-0">
                <span className="font-display text-4xl font-bold text-neon-foreground">
                  {mockPlayer.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    {mockPlayer.name}
                  </h1>
                  <span className="inline-flex px-3 py-1 rounded-lg bg-neon/10 text-neon text-sm font-medium">
                    {mockPlayer.contractStatus}
                  </span>
                </div>
                <p className="text-muted-foreground text-lg">{mockPlayer.position}</p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {mockPlayer.age} år
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Ruler className="h-4 w-4" />
                    {mockPlayer.height} cm
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Weight className="h-4 w-4" />
                    {mockPlayer.weight} kg
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Footprints className="h-4 w-4" />
                    {mockPlayer.strongFoot} fot
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {mockPlayer.city}, {mockPlayer.region}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3 lg:ml-auto">
                <Button variant="outline" size="lg">
                  Spara
                </Button>
                <Button variant="neon" size="lg">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Kontakta spelare
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="stat-card">
            <div className="stat-value">{totalStats.matches}</div>
            <div className="stat-label">Totalt matcher</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.floor(totalStats.minutes / 60)}h</div>
            <div className="stat-label">Spelade timmar</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalStats.goals}</div>
            <div className="stat-label">Mål</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalStats.assists}</div>
            <div className="stat-label">Assist</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="stats" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Statistik
              </TabsTrigger>
              <TabsTrigger 
                value="physical" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
              >
                <Activity className="h-4 w-4 mr-2" />
                Fysiska tester
              </TabsTrigger>
              <TabsTrigger 
                value="highlights" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
              >
                <Play className="h-4 w-4 mr-2" />
                Highlights
              </TabsTrigger>
              <TabsTrigger 
                value="about" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-6 py-3"
              >
                <FileText className="h-4 w-4 mr-2" />
                Om
              </TabsTrigger>
            </TabsList>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-display font-semibold text-foreground">Säsongsstatistik</h3>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Säsong</th>
                          <th>Matcher</th>
                          <th>Minuter</th>
                          <th>Mål</th>
                          <th>Assist</th>
                          <th>Min/Mål</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPlayer.seasonStats.map((stat) => (
                          <tr key={stat.season}>
                            <td className="font-medium text-foreground">{stat.season}</td>
                            <td>{stat.matches}</td>
                            <td>{stat.minutes}</td>
                            <td className="font-medium text-foreground">{stat.goals}</td>
                            <td className="font-medium text-foreground">{stat.assists}</td>
                            <td className="text-muted-foreground">
                              {stat.goals > 0 ? Math.round(stat.minutes / stat.goals) : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="space-y-6">
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
                            <p className="text-sm text-muted-foreground">{club.years} • {club.division}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Physical Tests Tab */}
            <TabsContent value="physical" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {mockPlayer.physicalTests.map((test, index) => (
                  <div key={index} className="rounded-2xl border border-border bg-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {test.name.includes("Sprint") && <Timer className="h-5 w-5 text-muted-foreground" />}
                        {test.name.includes("Uthållighet") && <Heart className="h-5 w-5 text-muted-foreground" />}
                        {test.name.includes("hopp") && <Zap className="h-5 w-5 text-muted-foreground" />}
                        {test.name.includes("Agility") && <Activity className="h-5 w-5 text-muted-foreground" />}
                        <h4 className="font-medium text-foreground">{test.name}</h4>
                      </div>
                      {getSourceBadge(test.source)}
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="font-display text-3xl font-bold text-foreground">{test.value}</p>
                        <p className="text-sm text-muted-foreground mt-1">Testad {test.date}</p>
                      </div>
                      {test.percentile && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Percentil</p>
                          <p className="font-display text-xl font-bold text-neon">{test.percentile}%</p>
                        </div>
                      )}
                    </div>
                    
                    {test.percentile && (
                      <div className="mt-4">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-neon rounded-full transition-all"
                            style={{ width: `${test.percentile}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Om verifieringsnivåer:</strong> GPS-verifierad data kommer från 
                  professionella mätsystem. Coachverifierad data är bekräftad av en registrerad tränare. 
                  Egenrapporterad data har ännu inte verifierats.
                </p>
              </div>
            </TabsContent>

            {/* Highlights Tab */}
            <TabsContent value="highlights" className="mt-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPlayer.highlights.map((video) => (
                  <div
                    key={video.id}
                    className="group relative aspect-video rounded-2xl bg-foreground overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-background/20 flex items-center justify-center group-hover:bg-neon group-hover:scale-110 transition-all">
                        <Play className="h-7 w-7 text-background ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/90 to-transparent">
                      <p className="font-medium text-background">{video.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-6 text-center">
                Videoklipp är komplement till statistik och prestationsdata.
              </p>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                      Om mig som fotbollsspelare
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{mockPlayer.bio}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6">
                    <h3 className="font-display font-semibold text-foreground mb-4">Personlig info</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Ålder</dt>
                        <dd className="font-medium text-foreground">{mockPlayer.age} år</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Längd</dt>
                        <dd className="font-medium text-foreground">{mockPlayer.height} cm</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Vikt</dt>
                        <dd className="font-medium text-foreground">{mockPlayer.weight} kg</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Starkaste fot</dt>
                        <dd className="font-medium text-foreground">{mockPlayer.strongFoot}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Region</dt>
                        <dd className="font-medium text-foreground">{mockPlayer.region}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default PlayerProfile;