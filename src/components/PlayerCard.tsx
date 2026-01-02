import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";

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
          <p className="text-sm text-muted-foreground mt-0.5">{position}</p>
          
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{age} år</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {region}
            </span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Link to={`/player/${id}`} className="block mt-4">
        <Button variant="secondary" size="sm" className="w-full group-hover:bg-foreground group-hover:text-background transition-colors">
          Visa profil
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </Link>
    </div>
  );
};

export default PlayerCard;