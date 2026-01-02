import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Clock, CheckCircle } from "lucide-react";

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
    <div className="p-5 rounded-2xl border border-border bg-card hover:border-foreground/20 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center flex-shrink-0">
              <span className="font-display text-sm font-bold text-background">
                {clubName.charAt(0)}
              </span>
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground">{clubName}</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {positions.map((pos) => (
                <span
                  key={pos}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-muted text-muted-foreground"
                >
                  {pos}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm bg-muted px-3 py-1.5 rounded-lg">
          <Users className="h-4 w-4" />
          <span className="font-medium text-foreground">{spotsLeft}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <Button 
          onClick={onApply}
          variant={isApplied ? "secondary" : "neon"}
          className="w-full"
          disabled={isApplied}
        >
          {isApplied ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Anmäld
            </>
          ) : (
            "Anmäl mig"
          )}
        </Button>
      </div>
    </div>
  );
};

export default TrialCard;