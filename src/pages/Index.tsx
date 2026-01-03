import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { User, Building2, ArrowRight, Play, MessageCircle, Search, Shield, Zap, CheckCircle } from "lucide-react";

const Index = () => {
  const steps = [
    { number: "01", title: "Skapa profil", description: "Registrera dig och fyll i din spelarprofil med position, erfarenhet och kontaktinfo." },
    { number: "02", title: "Visa highlights", description: "Ladda upp dina bästa videor och lägg till information om din karriär." },
    { number: "03", title: "Bli kontaktad", description: "Klubbar som gillar din profil kan kontakta dig direkt eller bjuda in till provträning." },
  ];

  const playerBenefits = [
    { icon: Zap, title: "Gratis profil", description: "Skapa en professionell spelarprofil utan kostnad" },
    { icon: Play, title: "Visa highlights", description: "Ladda upp videor och visa vad du kan" },
    { icon: Search, title: "Bli upptäckt", description: "Klubbar söker aktivt efter spelare som du" },
    { icon: MessageCircle, title: "Direktkontakt", description: "Kommunicera direkt med intresserade klubbar" },
  ];

  const clubBenefits = [
    { icon: Search, title: "Sök enkelt", description: "Hitta spelare baserat på position, ålder och region" },
    { icon: Play, title: "Se highlights", description: "Granska spelarnas videor innan du tar kontakt" },
    { icon: Shield, title: "Veriferade profiler", description: "Alla spelare har bekräftad kontaktinfo" },
    { icon: MessageCircle, title: "Enkel rekrytering", description: "Bjud in till provträning direkt via plattformen" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-foreground text-background">
        <div className="container py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              Där fotbollsspelare och klubbar möts – utan mellanhänder
            </h1>
            <p className="mt-6 text-lg md:text-xl text-background/70 max-w-xl">
              Fotbollin kopplar samman ambitiösa fotbollsspelare med klubbar som söker talang. Helt digitalt, helt gratis för spelare.
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

      {/* How it Works */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Så fungerar det
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Tre enkla steg för att komma igång
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="group p-6 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-colors">
                <span className="font-display text-4xl font-bold text-muted-foreground/30 group-hover:text-neon transition-colors">
                  {step.number}
                </span>
                <h3 className="font-display text-xl font-semibold text-foreground mt-4 mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Players */}
      <section className="py-20 md:py-24 bg-muted/50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background text-sm font-medium mb-6">
                <User className="h-4 w-4" />
                För spelare
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Visa upp dig för klubbar som söker talang
              </h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Oavsett om du är ute efter din första kontrakt eller vill ta nästa steg i karriären – Fotbollin ger dig verktygen att synas.
              </p>

              <Link to="/register?role=player" className="inline-block mt-8">
                <Button variant="default" size="lg">
                  Skapa spelarprofil
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {playerBenefits.map((benefit, index) => (
                <div key={index} className="p-5 rounded-2xl bg-background border border-border">
                  <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-5 w-5 text-neon" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits for Clubs */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="order-2 lg:order-1 grid sm:grid-cols-2 gap-4">
              {clubBenefits.map((benefit, index) => (
                <div key={index} className="p-5 rounded-2xl bg-muted/50 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
                    <benefit.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>

            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground text-background text-sm font-medium mb-6">
                <Building2 className="h-4 w-4" />
                För klubbar
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Hitta nästa stjärna för ditt lag
              </h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Sluta leta i blindo. Med Fotbollin kan du söka, filtrera och hitta exakt den typ av spelare du behöver.
              </p>

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

      {/* CTA Section */}
      <section className="bg-foreground text-background">
        <div className="container py-20 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Redo att ta nästa steg?
            </h2>
            <p className="text-background/70 mb-8 text-lg">
              Gå med tusentals spelare och klubbar som redan använder Fotbollin.
            </p>
            <Link to="/register">
              <Button variant="neon" size="xl">
                Kom igång gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;