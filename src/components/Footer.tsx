import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Logo />
          <p>Les meilleurs deals, partout.</p>
          <span>Offres partenaires et données de démonstration clairement identifiées.</span>
        </div>
        <div className="footer__links" aria-label="Liens de pied de page">
          <div>
            <strong>Explorer</strong>
            <Link to="/">Promotions</Link>
            <Link to="/marques">Marques</Link>
            <Link to="/categories">Catégories</Link>
          </div>
          <div>
            <strong>Votre espace</strong>
            <Link to="/favoris">Mes favoris</Link>
            <Link to="/preferences">Alertes</Link>
            <Link to="/profil">Profil</Link>
          </div>
          <div>
            <strong>Dealyva</strong>
            <Link to="/mentions-legales">Transparence</Link>
            <Link to="/administration">
              Administration <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© 2026 Dealyva — Démonstration.</span>
        <span>Conçu avec soin pour vos bonnes trouvailles.</span>
      </div>
    </footer>
  );
}
