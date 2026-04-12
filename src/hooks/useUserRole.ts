import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type UserRole = 
  | "player" | "club" 
  | "physiotherapist" | "coach" | "analyst" | "scout" | "nutritionist" | "mental_coach";

const STAFF_ROLES: UserRole[] = ["physiotherapist", "coach", "analyst", "scout", "nutritionist", "mental_coach"];

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: role, isLoading } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .single();
      return (data?.role as UserRole) || null;
    },
    enabled: !!user,
  });

  const isPlayer = role === "player";
  const isClub = role === "club";
  const isStaff = STAFF_ROLES.includes(role as UserRole);

  return { role, isLoading, isPlayer, isClub, isStaff };
};
