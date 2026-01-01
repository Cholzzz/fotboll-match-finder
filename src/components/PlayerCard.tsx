import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

interface PlayerCardProps {
  id: string;
  name: string;
  position: string;
  age: number;
  region: string;
  imageUrl?: string;
}

const PlayerCard = ({ id, name, position, age, region, imageUrl }: PlayerCardProps) => {
  return (
    <div className="group bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-accent">
              <span className="font-display text-xl font-bold text-accent-foreground">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate">{name}</h3>
          <p className="text-sm font-medium text-primary mt-0.5">{position}</p>
          
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {age} år
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {region}
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Link to={`/player/${id}`} className="block mt-4">
        <Button variant="secondary" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Visa profil
          <ArrowRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};

export default PlayerCard;
