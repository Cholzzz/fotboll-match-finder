import { Button } from "@/components/ui/button";
import { useConnectionStatus, useConnectionActions } from "@/hooks/useConnections";
import { useAuth } from "@/contexts/AuthContext";
import { UserPlus, UserCheck, Clock, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ConnectButtonProps {
  targetUserId: string;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const ConnectButton = ({ targetUserId, size = "default", className }: ConnectButtonProps) => {
  const { user } = useAuth();
  const { data: statusData, isLoading } = useConnectionStatus(targetUserId);
  const { sendRequest, acceptRequest, removeConnection } = useConnectionActions();

  if (!user || isLoading || statusData?.status === "self") return null;

  const status = statusData?.status || "none";
  const connection = statusData?.connection;
  const isSender = statusData?.isSender;

  const handleConnect = async () => {
    try {
      await sendRequest.mutateAsync(targetUserId);
      toast({ title: "Förfrågan skickad", description: "Din kontaktförfrågan har skickats." });
    } catch {
      toast({ title: "Fel", description: "Kunde inte skicka förfrågan.", variant: "destructive" });
    }
  };

  const handleAccept = async () => {
    try {
      await acceptRequest.mutateAsync(connection!.id);
      toast({ title: "Kontakt accepterad!" });
    } catch {
      toast({ title: "Fel", description: "Kunde inte acceptera.", variant: "destructive" });
    }
  };

  const handleRemove = async () => {
    try {
      await removeConnection.mutateAsync(connection!.id);
      toast({ title: "Kontakt borttagen" });
    } catch {
      toast({ title: "Fel", description: "Kunde inte ta bort.", variant: "destructive" });
    }
  };

  const isLoaderVisible = sendRequest.isPending || acceptRequest.isPending || removeConnection.isPending;

  if (isLoaderVisible) {
    return (
      <Button variant="outline" size={size} disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (status === "none" || status === "rejected") {
    return (
      <Button variant="outline" size={size} onClick={handleConnect} className={className}>
        <UserPlus className="h-4 w-4 mr-2" /> Anslut
      </Button>
    );
  }

  if (status === "pending" && isSender) {
    return (
      <Button variant="secondary" size={size} onClick={handleRemove} className={className}>
        <Clock className="h-4 w-4 mr-2" /> Väntande
      </Button>
    );
  }

  if (status === "pending" && !isSender) {
    return (
      <div className="flex gap-2">
        <Button variant="neon" size={size} onClick={handleAccept} className={className}>
          <UserCheck className="h-4 w-4 mr-2" /> Acceptera
        </Button>
        <Button variant="ghost" size={size} onClick={handleRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <Button variant="secondary" size={size} onClick={handleRemove} className={className}>
        <UserCheck className="h-4 w-4 mr-2" /> Ansluten
      </Button>
    );
  }

  return null;
};

export default ConnectButton;
