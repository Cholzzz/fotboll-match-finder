import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileStep {
  label: string;
  completed: boolean;
}

interface ProfileCompletenessProps {
  steps: ProfileStep[];
  className?: string;
}

const ProfileCompleteness = ({ steps, className }: ProfileCompletenessProps) => {
  const completed = steps.filter((s) => s.completed).length;
  const percentage = Math.round((completed / steps.length) * 100);

  if (percentage === 100) return null;

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display font-semibold text-foreground text-sm">
            Profilstatus
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {percentage}% klar – fyll i resterande för att synas bättre
          </p>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neon/10">
          <span className="text-xs font-bold text-neon">{percentage}%</span>
        </div>
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="grid grid-cols-2 gap-2">
        {steps.map((step, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 text-xs rounded-lg px-3 py-2 transition-colors",
              step.completed
                ? "text-muted-foreground"
                : "text-foreground bg-muted/50"
            )}
          >
            {step.completed ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-neon flex-shrink-0" />
            ) : (
              <Circle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            )}
            <span className={step.completed ? "line-through" : "font-medium"}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCompleteness;
