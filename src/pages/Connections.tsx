import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConnections, useConnectionActions, Connection } from "@/hooks/useConnections";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { UserCheck, Clock, Users, X, Check, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const roleLabels: Record<string, string> = {
  player: "Spelare", club: "Klubb", coach: "Tränare", physiotherapist: "Fysioterapeut",
  analyst: "Analytiker", scout: "Scout", nutritionist: "Nutritionist", mental_coach: "Mental coach",
};

const ConnectionCard = ({ connection, currentUserId }: { connection: Connection; currentUserId: string }) => {
  const { acceptRequest, rejectRequest, removeConnection } = useConnectionActions();
  const isPendingReceived = connection.status === "pending" && connection.receiver_id === currentUserId;
  const otherId = connection.requester_id === currentUserId ? connection.receiver_id : connection.requester_id;
  const name = connection.profile?.full_name || "Okänd";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase();
  const role = connection.role;

  const profileLink = role === "player" ? `/player/${otherId}` :
    ["coach", "physiotherapist", "analyst", "scout", "nutritionist", "mental_coach"].includes(role || "")
      ? `/staff/${otherId}` : `/player/${otherId}`;

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-foreground/20 transition-all">
      <Link to={profileLink} className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full bg-foreground flex items-center justify-center overflow-hidden">
          {connection.profile?.avatar_url ? (
            <img src={connection.profile.avatar_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-sm font-bold text-background">{initials}</span>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link to={profileLink} className="font-display font-semibold text-foreground hover:underline truncate block">
          {name}
        </Link>
        {role && (
          <span className="text-xs text-muted-foreground">{roleLabels[role] || role}</span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isPendingReceived ? (
          <>
            <Button
              size="sm"
              variant="neon"
              onClick={async () => {
                await acceptRequest.mutateAsync(connection.id);
                toast({ title: "Kontakt accepterad!" });
              }}
            >
              <Check className="h-3.5 w-3.5 mr-1" /> Acceptera
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await rejectRequest.mutateAsync(connection.id);
                toast({ title: "Förfrågan avvisad" });
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        ) : connection.status === "accepted" ? (
          <>
            <Link to={`/messages?to=${otherId}`}>
              <Button size="sm" variant="ghost">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive"
              onClick={async () => {
                await removeConnection.mutateAsync(connection.id);
                toast({ title: "Kontakt borttagen" });
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        ) : (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> Väntande
          </span>
        )}
      </div>
    </div>
  );
};

const Connections = () => {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState("connections");

  const { data: accepted = [], isLoading: loadingAccepted } = useConnections("accepted");
  const { data: pendingReceived = [], isLoading: loadingPending } = useConnections("pending_received");
  const { data: pendingSent = [] } = useConnections("pending_sent");

  if (authLoading) return <Layout><div className="container py-16"><Skeleton className="h-64 w-full" /></div></Layout>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <div className="container py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Mitt nätverk</h1>
            <p className="text-muted-foreground mt-1">
              {accepted.length} kontakter
              {pendingReceived.length > 0 && ` · ${pendingReceived.length} förfrågningar`}
            </p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="connections" className="gap-2">
              <Users className="h-4 w-4" /> Kontakter
              {accepted.length > 0 && <span className="ml-1 text-xs bg-muted px-1.5 py-0.5 rounded-full">{accepted.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" /> Förfrågningar
              {pendingReceived.length > 0 && (
                <span className="ml-1 text-xs bg-neon text-neon-foreground px-1.5 py-0.5 rounded-full">{pendingReceived.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="gap-2">
              <UserCheck className="h-4 w-4" /> Skickade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections">
            {loadingAccepted ? (
              <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
            ) : accepted.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">Inga kontakter ännu</h3>
                <p className="text-muted-foreground mb-6">Sök efter spelare eller personal och skicka kontaktförfrågningar.</p>
                <Link to="/search"><Button>Sök spelare</Button></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {accepted.map((c) => <ConnectionCard key={c.id} connection={c} currentUserId={user.id} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending">
            {loadingPending ? (
              <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
            ) : pendingReceived.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Inga väntande förfrågningar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReceived.map((c) => <ConnectionCard key={c.id} connection={c} currentUserId={user.id} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent">
            {pendingSent.length === 0 ? (
              <div className="text-center py-16">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Inga skickade förfrågningar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSent.map((c) => <ConnectionCard key={c.id} connection={c} currentUserId={user.id} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Connections;
