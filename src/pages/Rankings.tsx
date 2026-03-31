import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Trophy, Eye, MapPin, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Rankings = () => {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ["player-rankings"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_player_rankings", {
        limit_count: 50,
      });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-neon flex items-center justify-center">
            <Trophy className="h-5 w-5 text-neon-foreground" />
          </div>
          <div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-foreground">
              Topplista
            </h1>
            <p className="text-sm text-muted-foreground">
              Mest visade spelarprofiler
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : !rankings || rankings.length === 0 ? (
            <div className="py-16 text-center">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Inga profilvisningar registrerade ännu.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">#</TableHead>
                  <TableHead>Spelare</TableHead>
                  <TableHead className="hidden sm:table-cell">Position</TableHead>
                  <TableHead className="hidden md:table-cell">Region</TableHead>
                  <TableHead className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <Eye className="h-4 w-4" /> Visningar
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((player: any, index: number) => {
                  const rank = index + 1;
                  const initials = player.full_name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "?";

                  return (
                    <TableRow key={player.player_user_id} className="group">
                      <TableCell className="text-center font-bold text-lg">
                        {rank <= 3 ? (
                          <span
                            className={
                              rank === 1
                                ? "text-yellow-500"
                                : rank === 2
                                ? "text-gray-400"
                                : "text-amber-700"
                            }
                          >
                            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{rank}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/player/${player.player_user_id}`}
                          className="flex items-center gap-3 group-hover:text-neon transition-colors"
                        >
                          <div className="h-10 w-10 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {player.avatar_url ? (
                              <img
                                src={player.avatar_url}
                                alt={player.full_name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-neon">
                                {initials}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {player.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              {player.player_position || "—"}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {player.player_position || "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {player.region ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {player.region}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {player.view_count}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Rankings;
