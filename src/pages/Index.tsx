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
  Play,
  Heart,
  MessageSquare,
  Bookmark,
  Zap,
  Target,
  CheckCircle2
} from "lucide-react";

const Index = () => {
  const features = [
    { 
      icon: BarChart3, 
      title: "Statistik & Data", 
      description: "Säsongsdata, mål, assist – allt på ett ställe." 
    },
    { 
      icon: Activity, 
      title: "Fysiska Tester", 
      description: "Sprint, uthållighet, explosivitet – verifierat." 
    },
    { 
      icon: Video, 
      title: "Highlights", 
      description: "Visa din prestation med videoklipp." 
    },
    { 
      icon: MessageCircle, 
      title: "Direktkontakt", 
      description: "Kommunicera direkt med klubbar." 
    },
  ];

  const playerBenefits = [
    "Visa din prestation med data, inte kontakter",
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
      {/* Hero Section - Premium Dark */}
      <section className="hero-premium min-h-[90vh] flex items-center">
        {/* Animated grid background */}
        <div className="hero-grid" />
        
        {/* Floating particles */}
        <div className="hero-particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100 + 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
              }}
            />
          ))}
        </div>
        
        <div className="container relative z-10 py-20 lg:py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="badge-outline-neon mb-8 animate-fade-in">
              <Zap className="h-4 w-4" />
              Datadriven fotbollsrekrytering
            </div>
            
            {/* Main Headline */}
            <h1 className="headline-hero text-white mb-6 animate-slide-up">
              Visa vad du kan
              <br />
              <span className="text-gradient-neon">– inte vem du känner</span>
            </h1>
            
            {/* Subheadline */}
            <p className="subheadline max-w-2xl mb-4 animate-slide-up stagger-1">
              Data. Highlights. Direktkontakt.
            </p>
            <p className="text-white/50 text-lg max-w-xl mb-10 animate-slide-up stagger-2">
              Koppla samman din prestation med klubbar som söker talang. Utan mellanhänder.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-3">
              <Link to="/register?role=player">
                <Button variant="neon" size="xl" className="btn-glow w-full sm:w-auto group">
                  <User className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Jag är spelare
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/register?role=club">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto group">
                  <Building2 className="mr-2 h-5 w-5" />
                  Jag representerar en klubb
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-12 text-white/40 text-sm animate-fade-in stagger-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-neon" />
                Gratis att börja
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-neon" />
                Ingen agent krävs
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-neon" />
                Datadrivet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights - Clean Grid */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <div className="max-w-2xl mb-16">
            <span className="badge-outline-neon mb-6">
              <Target className="h-4 w-4" />
              Plattformen
            </span>
            <h2 className="headline-section text-foreground">
              Allt för modern rekrytering
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              En komplett plattform för datadriven fotbollsrekrytering
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-premium p-8 group"
              >
                <div className="icon-glow mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-foreground group-hover:text-neon transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok-style Video Preview Section */}
      <section className="py-24 lg:py-32 bg-gradient-hero relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text Content */}
            <div className="lg:w-1/2">
              <span className="badge-neon mb-6">
                <Video className="h-4 w-4" />
                Highlights
              </span>
              <h2 className="headline-section text-white mb-6">
                Swipa genom talang
              </h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Ett TikTok-inspirerat flöde där klubbar upptäcker spelare genom korta, 
                kraftfulla highlights. Prestation i fokus.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Heart className="h-4 w-4" />
                  Like
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  Kommentera
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Bookmark className="h-4 w-4" />
                  Spara
                </div>
              </div>
              
              <Link to="/highlights" className="inline-block mt-10">
                <Button variant="neon" size="lg" className="btn-glow group">
                  Utforska highlights
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            
            {/* Phone Mockups - TikTok Style */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative">
                {/* Background phone */}
                <div className="video-card w-48 h-80 -rotate-6 translate-x-8 opacity-60">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 mb-2" />
                    <div className="h-2 w-20 bg-white/20 rounded" />
                  </div>
                </div>
                
                {/* Main phone */}
                <div className="video-card w-56 h-96 relative z-10 rotate-3">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center animate-glow-pulse">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                  
                  {/* Player info */}
                  <div className="absolute bottom-6 left-4 right-14">
                    <p className="text-white font-semibold text-lg">Erik L.</p>
                    <p className="text-white/60 text-sm">Visa profil →</p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="absolute bottom-6 right-4 flex flex-col gap-4">
                    <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-neon/20 transition-colors">
                      <Heart className="h-5 w-5 text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-neon/20 transition-colors">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-neon/20 transition-colors">
                      <Bookmark className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Front phone */}
                <div className="video-card w-48 h-80 absolute -bottom-4 -right-12 rotate-12 opacity-60">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 mb-2" />
                    <div className="h-2 w-16 bg-white/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Players */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="badge-neon mb-6">
                <User className="h-4 w-4" />
                För spelare
              </span>
              <h2 className="headline-section text-foreground mb-6">
                Din prestation talar
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Sluta vänta på rätt kontakter. Med SportsIN visar du upp din statistik, 
                fysiska data och highlights – och låter klubbarna komma till dig.
              </p>

              <ul className="space-y-4 mb-10">
                {playerBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-neon" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register?role=player">
                <Button variant="default" size="lg" className="group">
                  Skapa spelarprofil
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Player Profile Preview */}
            <div className="card-dark p-8">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-neon flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-neon-foreground">EL</span>
                </div>
                <div>
                  <h4 className="font-display text-xl font-semibold text-white">Erik Lindqvist</h4>
                  <p className="text-white/60">Central mittfältare • 23 år</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { value: "28", label: "Matcher" },
                  { value: "2,340", label: "Minuter" },
                  { value: "7", label: "Mål" },
                  { value: "12", label: "Assist" },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/50 mt-1 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 mb-3 uppercase tracking-wide">Fysiska tester</p>
                <div className="flex flex-wrap gap-3">
                  <span className="badge-gps-verified">Sprint: 10.8s</span>
                  <span className="badge-coach-verified">Uthållighet: Nivå 12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Clubs */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Club Dashboard Preview */}
            <div className="order-2 lg:order-1 card-dark p-8">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-display text-xl font-semibold text-white">Sök spelare</h4>
                <span className="text-sm text-white/40">127 resultat</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">Mittfältare</span>
                <span className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">18-25 år</span>
                <span className="px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm">Stockholm</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "Erik Lindqvist", pos: "CM", age: 23, stats: "7 mål, 12 assist" },
                  { name: "Marcus Andersson", pos: "CM", age: 21, stats: "3 mål, 8 assist" },
                  { name: "Johan Svensson", pos: "DM", age: 24, stats: "1 mål, 5 assist" },
                ].map((player, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-neon flex items-center justify-center">
                        <span className="font-display text-sm font-bold text-neon-foreground">
                          {player.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white group-hover:text-neon transition-colors">{player.name}</p>
                        <p className="text-sm text-white/50">{player.pos} • {player.age} år</p>
                      </div>
                    </div>
                    <span className="text-sm text-white/40">{player.stats}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="badge-electric mb-6">
                <Building2 className="h-4 w-4" />
                För klubbar
              </span>
              <h2 className="headline-section text-foreground mb-6">
                Hitta rätt spelare med data
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Sluta leta i blindo. Med SportsIN kan du söka, filtrera och jämföra spelare 
                baserat på faktisk prestationsdata – inte rykten.
              </p>

              <ul className="space-y-4 mb-10">
                {clubBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-electric/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-electric" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link to="/register?role=club">
                <Button variant="default" size="lg" className="group">
                  Registrera klubb
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Final CTA */}
      <section className="py-24 lg:py-32 bg-gradient-hero relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-electric/5 rounded-full blur-[100px]" />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="badge-outline-neon mb-8">
              <Shield className="h-4 w-4" />
              Byggt för klubbar. Ägt av spelare.
            </span>
            <h2 className="headline-section text-white mb-8">
              En plattform du kan lita på
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
              SportsIN är byggt för att ge spelare kontroll över sin karriär och klubbar tillgång till 
              pålitlig data. Ingen spam, inga mellanhänder – bara direkt kontakt mellan 
              talang och möjlighet.
            </p>
            
            <Link to="/register">
              <Button variant="neon" size="xl" className="btn-glow group">
                Kom igång gratis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;