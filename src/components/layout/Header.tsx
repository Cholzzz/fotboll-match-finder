import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu, X, Video, Users, Search as SearchIcon, Calendar, Activity,
  ChevronDown, UserCheck, User, LogOut, MessageSquare, Link2, Trophy,
  Building2, Settings, Sun, Moon, Monitor
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import NotificationBell from "@/components/NotificationBell";
import { useQuery } from "@tanstack/react-query";

type Theme = "light" | "dark" | "system";

const getStoredTheme = (): Theme => {
  if (typeof window === "undefined") return "light";
  return (localStorage.getItem("theme") as Theme) || "light";
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
  localStorage.setItem("theme", theme);
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const { data: userRole } = useQuery({
    queryKey: ["user-role-header", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .single();
      return data?.role || null;
    },
    enabled: !!user,
  });

  const getProfilePath = () => {
    if (userRole === "club") return "/dashboard";
    if (["physiotherapist", "coach", "analyst", "scout", "nutritionist", "mental_coach"].includes(userRole || "")) return "/my-staff-profile";
    return "/my-profile";
  };

  const isActive = (path: string) => location.pathname === path;

  const isPlayerRole = userRole === "player";
  const isClubRole = userRole === "club";

  const mainNavLinks = [
    { path: "/highlights", label: "Highlights", icon: Video },
    ...(isPlayerRole
      ? [{ path: "/search-clubs", label: "Sök klubbar", icon: Building2 }]
      : isClubRole
        ? [{ path: "/search", label: "Sök spelare", icon: Users }]
        : [
            { path: "/search", label: "Sök spelare", icon: Users },
            { path: "/search-clubs", label: "Sök klubbar", icon: Building2 },
          ]),
    { path: "/search-staff", label: "Sök personal", icon: UserCheck },
    { path: "/trials", label: "Provträningar", icon: Calendar },
    { path: "/rankings", label: "Topplista", icon: Trophy },
    { path: "/activity", label: "Aktivitet", icon: Activity },
  ];

  // Quick icons for mobile/tablet bottom bar (most important links)
  const mobileQuickLinks = [
    { path: "/highlights", icon: Video, label: "Highlights" },
    ...(isPlayerRole
      ? [{ path: "/search-clubs", icon: Building2, label: "Klubbar" }]
      : isClubRole
        ? [{ path: "/search", icon: Users, label: "Spelare" }]
        : [{ path: "/search", icon: Users, label: "Sök" }]),
    { path: "/trials", icon: Calendar, label: "Trials" },
    { path: "/rankings", icon: Trophy, label: "Topp" },
    { path: "/activity", icon: Activity, label: "Aktivitet" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Utloggad", description: "Du har loggats ut." });
    navigate("/");
  };

  const themeIcon = theme === "dark" ? Moon : theme === "system" ? Monitor : Sun;
  const ThemeIcon = themeIcon;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container flex h-14 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon group-hover:shadow-glow-neon transition-shadow">
              <span className="font-headline text-base font-bold text-background">S</span>
            </div>
            <span className="font-headline text-lg font-bold text-foreground hidden sm:inline">SportsIN</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center gap-1 flex-1 mx-4">
            {mainNavLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                title={link.label}
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  isActive(link.path)
                    ? "text-neon bg-neon/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <link.icon className="w-4 h-4" />
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {!loading && user ? (
              <>
                <NotificationBell />
                <Link to="/messages">
                  <Button variant="ghost" size="icon" className={`h-9 w-9 ${isActive("/messages") ? "text-neon" : ""}`}>
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </Link>

                {/* Settings dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Utseende</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Ljust
                      {theme === "light" && <span className="ml-auto text-neon text-xs">✓</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Mörkt
                      {theme === "dark" && <span className="ml-auto text-neon text-xs">✓</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                      {theme === "system" && <span className="ml-auto text-neon text-xs">✓</span>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                      <div className="h-7 w-7 rounded-full bg-neon flex items-center justify-center">
                        <span className="text-xs font-bold text-background">
                          {user.user_metadata?.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to={getProfilePath()} className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Min profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/connections" className="flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        Mitt nätverk
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive">
                      <LogOut className="h-4 w-4" />
                      Logga ut
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : !loading ? (
              <>
                {/* Settings for non-logged-in users */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <ThemeIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
                      <Sun className="h-4 w-4" /> Ljust
                      {theme === "light" && <span className="ml-auto text-neon text-xs">✓</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
                      <Moon className="h-4 w-4" /> Mörkt
                      {theme === "dark" && <span className="ml-auto text-neon text-xs">✓</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" /> System
                      {theme === "system" && <span className="ml-auto text-neon text-xs">✓</span>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Logga in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="neon" size="sm" className="btn-glow text-xs sm:text-sm">Kom igång</Button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {/* Mobile/Tablet bottom navigation bar - replaces hamburger */}
      {!loading && user && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border">
          <div className="flex items-center justify-around h-14 px-2">
            {mobileQuickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors min-w-0 ${
                  isActive(link.path)
                    ? "text-neon"
                    : "text-muted-foreground"
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium truncate">{link.label}</span>
              </Link>
            ))}
            <Link
              to={getProfilePath()}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                isActive(getProfilePath()) ? "text-neon" : "text-muted-foreground"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-medium">Profil</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
