import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ session: null, user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

async function ensureProfileAndRole(user: User) {
  const meta = user.user_metadata;
  const fullName = meta?.full_name || "Unnamed";
  const role = meta?.role as string | undefined;

  // Check if profile exists
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      user_id: user.id,
      full_name: fullName,
      bio: meta?.bio || null,
      location: meta?.location || null,
    });
  }
  }

  if (role) {
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingRole) {
      await supabase.from("user_roles").insert({ user_id: user.id, role: role as any });
    }

    const staffRoles = ["physiotherapist", "coach", "analyst", "scout", "nutritionist", "mental_coach"];
    if (staffRoles.includes(role)) {
      const { data: existingStaff } = await supabase
        .from("staff_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingStaff) {
        await supabase.from("staff_profiles").insert({
          user_id: user.id,
          available_hours_start: meta?.available_hours_start || "09:00",
          available_hours_end: meta?.available_hours_end || "17:00",
        });
      }
    }
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Defer to avoid blocking auth state
          setTimeout(() => ensureProfileAndRole(newSession.user), 0);
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        ensureProfileAndRole(s.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
