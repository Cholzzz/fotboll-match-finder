import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Trophy, Mail, Phone, Calendar } from "lucide-react";

// Mock club data
const mockClub = {
  id: "1",
  name: "Djurgårdens IF",
  division: "Allsvenskan",
  region: "Stockholm",
  description: "Djurgårdens IF är en av Sveriges mest framgångsrika fotbollsklubbar med en stolt historia och en stark ungdomsakademi. Vi söker ständigt efter talangfulla spelare som vill ta nästa steg i sin karriär.",
  contactPerson: {
    name: "Anna Svensson",
    role: "Sportchef",
    email: "anna.svensson@dif.se",
    phone: "070-123 45 67",
  },
  activeTrials: 2,
};

const ClubProfile = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="container py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="hero-gradient p-8 pb-24 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
          </div>
          
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Logo */}
              <div className="w-32 h-32 rounded-2xl bg-background border-4 border-background shadow-lg flex items-center justify-center">
                <span className="font-display text-3xl font-bold text-primary">
                  {mockClub.name.split(" ")[0].substring(0, 3).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {mockClub.name}
                </h1>
                
                <div className="flex flex-wrap gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4 text-primary" />
                    {mockClub.division}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {mockClub.region}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    {mockClub.activeTrials} aktiva provträningar
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="md:ml-auto">
                <Button size="lg">
                  <Calendar className="mr-2 h-4 w-4" />
                  Skapa provträning
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Om klubben
              </h2>
              <p className="text-muted-foreground leading-relaxed">{mockClub.description}</p>
            </div>

            {/* Stats placeholder */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Klubbstatistik
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Grundad", value: "1891" },
                  { label: "Spelare i trupp", value: "28" },
                  { label: "SM-guld", value: "12" },
                  { label: "Arena", value: "Tele2 Arena" },
                ].map((stat, index) => (
                  <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Kontaktperson
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-foreground">{mockClub.contactPerson.name}</p>
                  <p className="text-sm text-muted-foreground">{mockClub.contactPerson.role}</p>
                </div>
                
                <div className="space-y-2">
                  <a
                    href={`mailto:${mockClub.contactPerson.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    {mockClub.contactPerson.email}
                  </a>
                  <a
                    href={`tel:${mockClub.contactPerson.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    {mockClub.contactPerson.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClubProfile;
