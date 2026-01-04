import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Activity, 
  Timer, 
  Heart, 
  Zap, 
  TrendingUp, 
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BarChart3
} from "lucide-react";

const PerformanceTests = () => {
  const testCategories = [
    {
      icon: Timer,
      title: "Sprint & Snabbhet",
      description: "40-meters sprint, accelerationstester och reaktionstid.",
      metrics: ["40m sprint", "10m acceleration", "5-10-5 agility"],
    },
    {
      icon: Heart,
      title: "Uthållighet",
      description: "Aerob kapacitet och förmåga att hålla hög intensitet över tid.",
      metrics: ["Yo-Yo test", "Beep test", "Cooper test"],
    },
    {
      icon: Zap,
      title: "Explosivitet",
      description: "Vertikal hoppkraft och kraftutveckling.",
      metrics: ["CMJ (Counter Movement Jump)", "Squat jump", "Broad jump"],
    },
    {
      icon: Activity,
      title: "Rörlighet & Balans",
      description: "Flexibilitet, koordination och stabilitet.",
      metrics: ["Sit and reach", "Y-balance test", "FMS screening"],
    },
  ];

  const verificationLevels = [
    {
      level: "GPS-verifierad",
      icon: Shield,
      color: "neon",
      description: "Data insamlad med professionell GPS-utrustning under träning eller match.",
      trust: "Högsta trovärdighet",
    },
    {
      level: "Coachverifierad",
      icon: CheckCircle2,
      color: "electric",
      description: "Testresultat bekräftade av en registrerad tränare eller fysioterapeut.",
      trust: "Hög trovärdighet",
    },
    {
      level: "Egenrapporterad",
      icon: AlertCircle,
      color: "muted",
      description: "Data rapporterad av spelaren själv, ej verifierad av tredje part.",
      trust: "Obekräftad",
    },
  ];

  return (
    <Layout>
      <div className="container py-12">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon/10 text-neon text-sm font-medium mb-6">
            <Activity className="h-4 w-4" />
            Prestationsdata
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Varför fysisk data spelar roll
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Fysiska tester ger klubbar objektiv data om en spelares kapacitet. 
            Tillsammans med matchstatistik och video ger det en komplett bild av spelarens potential.
          </p>
        </div>

        {/* Test Categories */}
        <div className="mb-20">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
            Testkategorier
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testCategories.map((category, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center flex-shrink-0">
                    <category.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.metrics.map((metric, i) => (
                        <span key={i} className="px-2 py-1 rounded bg-muted text-xs font-medium text-muted-foreground">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Levels */}
        <div className="mb-20">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4 text-center">
            Verifieringsnivåer
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Inte all data är lika tillförlitlig. Vårt verifieringssystem hjälper klubbar förstå 
            hur trovärdig datan är.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {verificationLevels.map((level, index) => (
              <div key={index} className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                  level.color === "neon" ? "bg-neon/10" : 
                  level.color === "electric" ? "bg-electric/10" : 
                  "bg-muted"
                }`}>
                  <level.icon className={`h-7 w-7 ${
                    level.color === "neon" ? "text-neon" : 
                    level.color === "electric" ? "text-electric" : 
                    "text-muted-foreground"
                  }`} />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{level.level}</h3>
                <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                  level.color === "neon" ? "bg-neon/10 text-neon" : 
                  level.color === "electric" ? "bg-electric/10 text-electric" : 
                  "bg-muted text-muted-foreground"
                }`}>
                  {level.trust}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Example Dashboard */}
        <div className="mb-20">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
            Exempel: Utveckling över tid
          </h2>
          
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-foreground">Sprint 40m</h3>
                <p className="text-sm text-muted-foreground">Senaste 12 månaderna</p>
              </div>
              <div className="flex items-center gap-2 text-neon">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">+8% förbättring</span>
              </div>
            </div>
            
            {/* Chart placeholder */}
            <div className="h-48 bg-muted/30 rounded-xl flex items-end justify-around p-4 mb-6">
              {[5.8, 5.6, 5.5, 5.4, 5.3, 5.2].map((value, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-8 bg-neon rounded-t transition-all"
                    style={{ height: `${(6 - value) * 80}px` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Jan", "Mar", "Maj", "Jul", "Sep", "Nov"][i]}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground">Bästa tid</p>
                <p className="font-display text-xl font-bold text-foreground">5.2s</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground">Genomsnitt</p>
                <p className="font-display text-xl font-bold text-foreground">5.4s</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 text-center">
                <p className="text-sm text-muted-foreground">Percentil</p>
                <p className="font-display text-xl font-bold text-neon">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment Section */}
        <div className="rounded-2xl bg-foreground text-background p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
              Rekommenderad utrustning
            </h2>
            <p className="text-background/70 mb-8">
              För att få GPS-verifierad data rekommenderar vi följande utrustning som används av 
              professionella klubbar och spelare.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {[
                { name: "GPS-väst", desc: "Professionell träningsdata", tag: "Används i tester" },
                { name: "Pulsmätare", desc: "Uthållighetsdata", tag: "Rekommenderad" },
                { name: "Kraftplatta", desc: "Explosivitetstester", tag: "Klubbutrustning" },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-background/5">
                  <div className="w-12 h-12 rounded-xl bg-neon/20 mx-auto mb-3 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-neon" />
                  </div>
                  <h4 className="font-semibold mb-1">{item.name}</h4>
                  <p className="text-sm text-background/60 mb-2">{item.desc}</p>
                  <span className="text-xs text-neon">{item.tag}</span>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-background/50">
              * Utrustning visas som information, ej annons.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Redo att visa din fysiska kapacitet?
          </h2>
          <p className="text-muted-foreground mb-8">
            Skapa din profil och lägg till dina testresultat idag.
          </p>
          <Link to="/register?role=player">
            <Button variant="neon" size="xl">
              Skapa spelarprofil
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PerformanceTests;