import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Video, Users, Calendar, Activity, Apple, ChevronDown, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const mainNavLinks = [
    { path: "/highlights", label: "Highlights", icon: Video },
    { path: "/dashboard", label: "Sök spelare", icon: Users },
    { path: "/search-staff", label: "Sök personal", icon: UserCheck },
    { path: "/trials", label: "Provträningar", icon: Calendar },
  ];

  const toolsNavLinks = [
    { path: "/performance", label: "Prestationsdata", icon: Activity },
    { path: "/nutrition", label: "Nutritionsplan", icon: Apple },
  ];

  const allNavLinks = [...mainNavLinks, ...toolsNavLinks];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon group-hover:shadow-glow-neon transition-shadow">
            <span className="font-headline text-lg font-bold text-background">S</span>
          </div>
          <span className="font-headline text-xl font-bold text-foreground">SportsIN</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainNavLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive(link.path)
                  ? "text-neon bg-neon/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          
          {/* Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  toolsNavLinks.some(l => isActive(l.path))
                    ? "text-neon bg-neon/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Verktyg
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {toolsNavLinks.map((link) => (
                <DropdownMenuItem key={link.path} asChild>
                  <Link 
                    to={link.path} 
                    className={`flex items-center gap-3 ${isActive(link.path) ? 'text-neon' : ''}`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Logga in
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="neon" size="sm" className="btn-glow">
              Kom igång
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <div className="container py-4 space-y-4">
            <nav className="grid grid-cols-2 gap-2">
              {allNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-neon/10 text-neon border border-neon/20"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t border-border">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Logga in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <Button variant="neon" className="w-full btn-glow">
                  Kom igång
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;