import Layout from "@/components/layout/Layout";
import { Apple, Droplets, Flame, Utensils, Clock, Target, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const NutritionPlan = () => {
  const nutritionStats = [
    { label: "Dagligt kaloriintag", value: "2,800", unit: "kcal", icon: Flame, color: "text-orange-400" },
    { label: "Protein", value: "140", unit: "g", icon: Target, color: "text-neon" },
    { label: "Kolhydrater", value: "350", unit: "g", icon: Apple, color: "text-blue-400" },
    { label: "Vatten", value: "3.5", unit: "L", icon: Droplets, color: "text-cyan-400" },
  ];

  const mealPlan = [
    {
      time: "07:00",
      meal: "Frukost",
      items: ["Havregrynsgröt med bär", "Ägg (2st)", "Apelsinjuice"],
      calories: 650,
    },
    {
      time: "10:00",
      meal: "Mellanmål",
      items: ["Proteinshake", "Banan"],
      calories: 350,
    },
    {
      time: "12:30",
      meal: "Lunch",
      items: ["Grillad kyckling", "Quinoa", "Grönsaker"],
      calories: 700,
    },
    {
      time: "15:30",
      meal: "Pre-träning",
      items: ["Energibar", "Frukt"],
      calories: 250,
    },
    {
      time: "19:00",
      meal: "Middag",
      items: ["Lax", "Sötpotatis", "Broccoli"],
      calories: 650,
    },
    {
      time: "21:00",
      meal: "Kvällsmål",
      items: ["Kvarg", "Nötter", "Honung"],
      calories: 200,
    },
  ];

  const weeklyFocus = [
    { day: "Måndag", focus: "Matchdag – extra kolhydrater", progress: 100 },
    { day: "Tisdag", focus: "Återhämtning – protein fokus", progress: 85 },
    { day: "Onsdag", focus: "Träningsdag – balanserad", progress: 90 },
    { day: "Torsdag", focus: "Träningsdag – balanserad", progress: 75 },
    { day: "Fredag", focus: "Pre-match – carb loading", progress: 60 },
    { day: "Lördag", focus: "Matchdag", progress: 0 },
    { day: "Söndag", focus: "Vila – lätt kost", progress: 0 },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 hero-grid opacity-30" />
          <div className="container relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 mb-6">
                <Apple className="w-4 h-4 text-neon" />
                <span className="text-sm font-medium text-neon">Nutritionsplan</span>
              </div>
              <h1 className="headline-hero mb-4">
                Din personliga <span className="text-gradient-neon">kostplan</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Optimerad nutrition för topprestationer på planen. Anpassad efter din träning, matcher och mål.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-8 border-y border-border">
          <div className="container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {nutritionStats.map((stat, index) => (
                <div key={index} className="card-premium p-6 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                    <span className="text-lg text-muted-foreground ml-1">{stat.unit}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Meal Plan */}
        <section className="py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="headline-section mb-2">Dagens måltider</h2>
                <p className="text-muted-foreground">Onsdag 22 januari</p>
              </div>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Byt dag
              </Button>
            </div>

            <div className="space-y-4">
              {mealPlan.map((meal, index) => (
                <div 
                  key={index} 
                  className="card-premium p-6 flex items-center gap-6 hover:border-neon/30 transition-all group"
                >
                  <div className="flex-shrink-0 w-16 text-center">
                    <Clock className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
                    <span className="text-sm font-mono text-muted-foreground">{meal.time}</span>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-neon transition-colors">
                      {meal.meal}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {meal.items.join(" • ")}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-lg font-bold text-foreground">{meal.calories}</div>
                    <span className="text-xs text-muted-foreground">kcal</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-neon/5 border border-neon/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-neon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Totalt idag</h3>
                    <p className="text-sm text-muted-foreground">Du är på rätt väg!</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-neon">2,800</div>
                  <span className="text-sm text-muted-foreground">av 2,800 kcal</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Overview */}
        <section className="py-16 bg-card/30">
          <div className="container">
            <h2 className="headline-section mb-8">Veckans fokus</h2>
            <div className="grid gap-3">
              {weeklyFocus.map((day, index) => (
                <div 
                  key={index} 
                  className={`card-premium p-4 flex items-center gap-4 ${
                    day.progress === 0 ? 'opacity-50' : ''
                  }`}
                >
                  <div className="w-24 font-medium text-foreground">{day.day}</div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{day.focus}</p>
                  </div>
                  <div className="w-32">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-neon to-electric rounded-full transition-all"
                        style={{ width: `${day.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium text-muted-foreground">
                    {day.progress}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container">
            <div className="card-premium p-8 lg:p-12 text-center">
              <Utensils className="w-12 h-12 mx-auto mb-6 text-neon" />
              <h2 className="headline-section mb-4">Vill du ha en personlig nutritionist?</h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Våra certifierade idrottsnutritionister kan skapa en helt anpassad plan baserad på din position, träningsschema och mål.
              </p>
              <Button variant="neon" size="lg" className="btn-glow">
                Boka konsultation
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default NutritionPlan;
