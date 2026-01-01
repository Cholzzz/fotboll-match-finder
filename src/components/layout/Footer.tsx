import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-lg font-bold text-primary-foreground">F</span>
              </div>
              <span className="font-display text-xl font-bold text-foreground">Fotbollin</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Plattformen där fotbollsspelare och klubbar möts – utan mellanhänder. 
              Skapa din profil, visa dina highlights och bli upptäckt.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Plattformen</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Skapa profil
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sök spelare
                </Link>
              </li>
              <li>
                <Link to="/trials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Provträningar
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Om Fotbollin
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Villkor
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Fotbollin. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
