import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Award, Briefcase, Clock, CreditCard } from "lucide-react";

export type StaffRole = "coach" | "physio" | "analyst" | "scout" | "nutritionist";

export interface StaffPricing {
  sessionPrice: number;
  sessionDuration: number; // in minutes
  packagePrice?: number;
  packageSessions?: number;
}

export interface StaffCardProps {
  id: string;
  name: string;
  role: StaffRole;
  specialization: string;
  experience: number;
  region: string;
  certifications?: string[];
  imageUrl?: string;
  pricing?: StaffPricing;
}

const roleLabels: Record<StaffRole, string> = {
  coach: "Tränare",
  physio: "Fysioterapeut",
  analyst: "Analytiker",
  scout: "Scout",
  nutritionist: "Nutritionist",
};

const roleColors: Record<StaffRole, string> = {
  coach: "bg-blue-500/10 text-blue-400",
  physio: "bg-emerald-500/10 text-emerald-400",
  analyst: "bg-purple-500/10 text-purple-400",
  scout: "bg-amber-500/10 text-amber-400",
  nutritionist: "bg-pink-500/10 text-pink-400",
};

const StaffCard = ({ 
  id, 
  name, 
  role, 
  specialization, 
  experience, 
  region, 
  certifications,
  imageUrl,
  pricing
}: StaffCardProps) => {
  return (
    <div className="group p-5 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-muted flex-shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-foreground">
              <span className="font-display text-lg font-bold text-background">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate">{name}</h3>
          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium mt-1 ${roleColors[role]}`}>
            {roleLabels[role]}
          </span>
          
          <p className="text-sm text-muted-foreground mt-1">{specialization}</p>
          
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {experience} års erfarenhet
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {region}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing */}
      {pricing && (
        <div className="mt-4 p-3 rounded-xl bg-neon/5 border border-neon/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-neon" />
              <span className="font-display font-bold text-foreground">{pricing.sessionPrice} kr</span>
              <span className="text-xs text-muted-foreground">/ session</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {pricing.sessionDuration} min
            </div>
          </div>
          {pricing.packagePrice && pricing.packageSessions && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="text-neon font-medium">{pricing.packageSessions}x paket:</span>{" "}
              {pricing.packagePrice} kr ({Math.round(pricing.packagePrice / pricing.packageSessions)} kr/session)
            </div>
          )}
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <Award className="h-3.5 w-3.5 text-neon" />
          {certifications.slice(0, 2).map((cert, index) => (
            <span key={index} className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground">
              {cert}
            </span>
          ))}
          {certifications.length > 2 && (
            <span className="text-xs text-muted-foreground">+{certifications.length - 2}</span>
          )}
        </div>
      )}

      {/* Action */}
      <Link to={`/staff/${id}`} className="block mt-4">
        <Button variant="secondary" size="sm" className="w-full group-hover:bg-foreground group-hover:text-background transition-colors">
          Visa profil & boka
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </Link>
    </div>
  );
};

export default StaffCard;
