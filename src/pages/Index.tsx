import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Building2, 
  ArrowRight, 
  BarChart3, 
  Activity, 
  MessageCircle, 
  Calendar,
  Shield,
  TrendingUp,
  Video,
  Target,
  CheckCircle2
} from "lucide-react";

const Index = () => {
  const features = [
    { 
      icon: BarChart3, 
      title: "Spelarprofiler med statistik", 
      description: "Säsongsdata, mål, assist och spelade minuter – allt samlat på ett ställe." 
    },
    { 
      icon: Activity, 
      title: "Fysiska tester & prestationsdata", 
      description: "Sprint, uthållighet och explosivitet med verifieringsnivåer." 
    },
    { 
      icon: MessageCircle, 
      title: "Direktkontakt med klubbar", 
      description: "Kommunicera direkt utan mellanhänder eller agenter." 
    },
    { 
      icon: Calendar, 
      title: "Provträningsinbjudningar", 
      description: "Klubbar kan bjuda in spelare till provträningar direkt via plattformen." 
    },
  ];

  const playerBenefits = [
    "Visa din prestation med data, inte bara kontakter",
    "Ladda upp verifierade fysiska testresultat",
    "Bli upptäckt av klubbar som söker din profil",
    "Kommunicera direkt med intresserade klubbar",
  ];

  const clubBenefits = [
    "Sök spelare baserat på position, ålder och region",
    "Granska statistik och prestationsdata innan kontakt",
    "Spara spelare i din bevakningslista",
    "Bjud in till provträning direkt via plattformen",
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-foreground text-background">
        <div className="container py-20 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/10 text-background/80 text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              Datadriven fotbollsrekrytering
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Visa din prestation – inte bara ditt nätverk
            </h1>
            <p className="mt-6 text-lg md:text-xl text-background/70 max-w-2xl">
              Fotbollin kopplar samman ambitiösa fotbollsspelare med klubbar genom statistik, 
              prestationsdata och direktkontakt. Utan mellanhänder, utan agenter.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link to="/register?role=player">
                <Button variant="neon" size="xl" className="w-full sm:w-auto">
                  <User className="mr-2 h-5 w-5" />
                  Jag är spelare
                </Button>
              </Link>
              <Link to="/register?role=club">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  <Building2 className="mr-2 h-5 w-5" />
                  Jag representerar en klubb
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Allt du behöver för modern rekrytering
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              En komplett plattform för datadriven fotbollsrekrytering
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center mb-4 group-hover:bg-neon/10 transition-colors">
                  <feature.icon className="h-6 w-6 text-foreground group-hover:text-neon transition-colors" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Players */}
      <section className="py-20 lg:py-24 bg-muted/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background text-sm font-medium mb-6">
                <User className="h-4 w-4" />
                För spelare
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Din prestation talar för sig själv
              </h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Sluta vänta på att rätt kontakter ska öppna dörrar. Med Fotbollin visar du upp 
                din statistik, fysiska data och highlights – och låter klubbarna komma till dig.
              </p>

              <ul className="mt-8 space-y-3">
                {playerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-neon flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register?role=player" className="inline-block mt-8">
                <Button variant="default" size="lg">
                  Skapa spelarprofil
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Player Profile Preview */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-foreground flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-background">EL</span>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground">Erik Lindqvist</h4>
                  <p className="text-sm text-muted-foreground">Central mittfältare • 23 år</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <div className="stat-card">
                  <div className="stat-value">28</div>
                  <div className="stat-label">Matcher</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">2,340</div>
                  <div className="stat-label">Minuter</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">7</div>
                  <div className="stat-label">Mål</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">12</div>
                  <div className="stat-label">Assist</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Fysiska tester</p>
                <div className="flex flex-wrap gap-2">
                  <span className="badge-gps-verified px-2 py-1 rounded text-xs font-medium">Sprint: 10.8s</span>
                  <span className="badge-coach-verified px-2 py-1 rounded text-xs font-medium">Uthållighet: Nivå 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Clubs */}
      <section className="py-20 lg:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Club Dashboard Preview */}
            <div className="order-2 lg:order-1 bg-foreground rounded-2xl p-6 text-background">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-display font-semibold">Sök spelare</h4>
                <span className="text-sm text-background/60">127 resultat</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 rounded-lg bg-background/10 text-sm">Mittfältare</span>
                <span className="px-3 py-1.5 rounded-lg bg-background/10 text-sm">18-25 år</span>
                <span className="px-3 py-1.5 rounded-lg bg-background/10 text-sm">Stockholm</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "Erik Lindqvist", pos: "CM", age: 23, stats: "7 mål, 12 assist" },
                  { name: "Marcus Andersson", pos: "CM", age: 21, stats: "3 mål, 8 assist" },
                  { name: "Johan Svensson", pos: "DM", age: 24, stats: "1 mål, 5 assist" },
                ].map((player, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neon flex items-center justify-center">
                        <span className="font-display text-sm font-bold text-neon-foreground">
                          {player.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-background">{player.name}</p>
                        <p className="text-xs text-background/60">{player.pos} • {player.age} år</p>
                      </div>
                    </div>
                    <span className="text-xs text-background/60">{player.stats}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                För klubbar
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Hitta rätt spelare med data
              </h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Sluta leta i blindo. Med Fotbollin kan du söka, filtrera och jämföra spelare 
                baserat på faktisk prestationsdata – inte rykten eller kontakter.
              </p>

              <ul className="mt-8 space-y-3">
                {clubBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-electric flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register?role=club" className="inline-block mt-8">
                <Button variant="default" size="lg">
                  Registrera klubb
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Video Highlights Section */}
      <section className="py-20 lg:py-24 bg-muted/50">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 text-foreground text-sm font-medium mb-6">
              <Video className="h-4 w-4" />
              Highlight-flöde
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Komplettera din data med highlights
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Videoklipp ger klubbar en känsla för hur du spelar – men statistiken förblir i fokus.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[9/16] bg-foreground rounded-2xl overflow-hidden relative group cursor-pointer">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background/20 flex items-center justify-center group-hover:bg-neon group-hover:scale-110 transition-all">
                    <Video className="h-7 w-7 text-background" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground to-transparent">
                  <p className="text-sm font-medium text-background">Spelare {i}</p>
                  <p className="text-xs text-background/60">Visa profil →</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/highlights">
              <Button variant="outline" size="lg">
                Utforska highlights
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 lg:py-24 bg-background border-t border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon/10 text-neon text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Byggt för klubbar. Ägt av spelare.
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              En plattform du kan lita på
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Fotbollin är byggt för att ge spelare kontroll över sin karriär och klubbar tillgång till 
              pålitlig data. Ingen spammar, inga mellanhänder – bara direkt kontakt mellan 
              talang och möjlighet.
            </p>
            
            <div className="mt-10">
              <Link to="/register">
                <Button variant="neon" size="xl">
                  Kom igång gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;