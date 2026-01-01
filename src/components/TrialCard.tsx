import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Clock } from "lucide-react";

interface TrialCardProps {
  id: string;
  clubName: string;
  date: string;
  time: string;
  location: string;
  positions: string[];
  spotsLeft: number;
  onApply?: () => void;
  isApplied?: boolean;
}

const TrialCard = ({ 
  id, 
  clubName, 
  date, 
  time, 
  location, 
  positions, 
  spotsLeft,
  onApply,
  isApplied = false
}: TrialCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-display font-semibold text-lg text-foreground">{clubName}</h3>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{location}</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Positioner som söks:</p>
            <div className="flex flex-wrap gap-1.5">
              {positions.map((pos) => (
                <span
                  key={pos}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-accent text-accent-foreground"
                >
                  {pos}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">{spotsLeft}</span>
            <span className="text-muted-foreground">platser</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <Button 
          onClick={onApply}
          variant={isApplied ? "secondary" : "default"}
          className="w-full"
          disabled={isApplied}
        >
          {isApplied ? "Anmäld" : "Anmäl mig"}
        </Button>
      </div>
    </div>
  );
};

export default TrialCard;
