import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { User, Building2, UserPlus, Video, MessageCircle, CheckCircle, ArrowRight, Search, Shield } from "lucide-react";

const Index = () => {
  const playerBenefits = [
    { icon: UserPlus, title: "Gratis profil", description: "Skapa en professionell spelarprofil utan kostnad" },
    { icon: Video, title: "Visa dina highlights", description: "Ladda upp videor och visa vad du kan" },
    { icon: Search, title: "Bli upptäckt", description: "Klubbar söker aktivt efter spelare som du" },
    { icon: MessageCircle, title: "Direktkontakt", description: "Kommunicera direkt med intresserade klubbar" },
  ];

  const clubBenefits = [
    { icon: Search, title: "Sök enkelt", description: "Hitta spelare baserat på position, ålder och region" },
    { icon: Video, title: "Se highlights", description: "Granska spelarnas videor innan du tar kontakt" },
    { icon: Shield, title: "Veriferade profiler", description: "Alla spelare har bekräftad kontaktinfo" },
    { icon: MessageCircle, title: "Enkel rekrytering", description: "Bjud in till provträning direkt via plattformen" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight animate-fade-in">
              Där spelare och klubbar möts – utan mellanhänder
            </h1>
            <p className="mt-6 text-lg md:text-xl text-background/80 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Fotbollin är plattformen som kopplar samman ambitiösa fotbollsspelare med klubbar som söker talang. Helt digitalt, helt gratis för spelare.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Link to="/register?role=player">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
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

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L48 45.7C96 41.3 192 32.7 288 30.2C384 27.7 480 31.3 576 39.8C672 48.3 768 61.7 864 65.2C960 68.7 1056 62.3 1152 55.8C1248 49.3 1344 42.7 1392 39.3L1440 36V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Så fungerar det
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Tre enkla steg för att komma igång
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "1", title: "Skapa profil", description: "Registrera dig och fyll i din spelarprofil med position, erfarenhet och kontaktinfo.", icon: UserPlus },
              { step: "2", title: "Visa highlights & data", description: "Ladda upp dina bästa videor och lägg till information om din karriär.", icon: Video },
              { step: "3", title: "Bli kontaktad", description: "Klubbar som gillar din profil kan kontakta dig direkt eller bjuda in till provträning.", icon: MessageCircle },
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent mb-6 group-hover:bg-primary transition-colors duration-300">
                  <item.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <div className="absolute top-8 left-1/2 ml-8 hidden md:block w-[calc(100%-4rem)] h-0.5 bg-border last:hidden" style={{ display: index === 2 ? 'none' : undefined }} />
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Players */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                <User className="h-4 w-4" />
                För spelare
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Visa upp dig för klubbar som söker talang
              </h2>
              <p className="text-muted-foreground mb-8">
                Oavsett om du är ute efter din första kontrakt eller vill ta nästa steg i karriären – Fotbollin ger dig verktygen att synas.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {playerBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{benefit.title}</h4>
                      <p className="text-muted-foreground text-xs mt-0.5">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/register?role=player" className="inline-block mt-8">
                <Button size="lg">
                  Skapa spelarprofil
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent overflow-hidden border border-border shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <User className="h-12 w-12 text-primary" />
                    </div>
                    <p className="font-display font-semibold text-foreground">Din spelarprofil</p>
                    <p className="text-sm text-muted-foreground mt-1">Synlig för hundratals klubbar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Clubs */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-accent to-primary/10 overflow-hidden border border-border shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-primary" />
                    </div>
                    <p className="font-display font-semibold text-foreground">Din klubbprofil</p>
                    <p className="text-sm text-muted-foreground mt-1">Hitta rätt spelare snabbt</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                <Building2 className="h-4 w-4" />
                För klubbar
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Hitta nästa stjärna för ditt lag
              </h2>
              <p className="text-muted-foreground mb-8">
                Sluta leta i blindo. Med Fotbollin kan du söka, filtrera och hitta exakt den typ av spelare du behöver – baserat på position, ålder, region och mer.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {clubBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{benefit.title}</h4>
                      <p className="text-muted-foreground text-xs mt-0.5">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/register?role=club" className="inline-block mt-8">
                <Button size="lg">
                  Registrera klubb
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="container relative text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-background mb-4">
            Redo att ta nästa steg?
          </h2>
          <p className="text-background/80 mb-8 max-w-xl mx-auto">
            Gå med tusentals spelare och klubbar som redan använder Fotbollin för att hitta varandra.
          </p>
          <Link to="/register">
            <Button variant="hero" size="xl">
              Kom igång gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
