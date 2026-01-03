import { useNavigate } from "react-router-dom";
import { User, Building2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function RoleSelect() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: "player" | "club") => {
    localStorage.setItem("fotbollin_role", role);
    navigate("/onboarding");
  };

  return (
    <>
      <Helmet>
        <title>Join Fotbollin | Football Players & Clubs</title>
        <meta
          name="description"
          content="Join Fotbollin as a player to showcase your skills or as a club to discover talented football players."
        />
      </Helmet>

      <div className="min-h-[100dvh] bg-background flex flex-col">
        {/* Logo area */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          {/* Logo */}
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Fotboll<span className="text-neon">in</span>
            </h1>
            <p className="text-muted-foreground">
              Where talent meets opportunity
            </p>
          </div>

          {/* Role cards */}
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => handleRoleSelect("player")}
              className="w-full group"
            >
              <div className="card-elevated p-6 flex items-center gap-4 transition-all duration-300 group-hover:border-neon/50 group-hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-2xl bg-neon/10 flex items-center justify-center group-hover:bg-neon/20 transition-colors">
                  <User className="w-7 h-7 text-neon" />
                </div>
                <div className="text-left">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    I am a player
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Showcase your skills & get discovered
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect("club")}
              className="w-full group"
            >
              <div className="card-elevated p-6 flex items-center gap-4 transition-all duration-300 group-hover:border-neon/50 group-hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-2xl bg-neon/10 flex items-center justify-center group-hover:bg-neon/20 transition-colors">
                  <Building2 className="w-7 h-7 text-neon" />
                </div>
                <div className="text-left">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    I represent a club
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Discover & connect with talented players
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-neon font-medium hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </>
  );
}