import { Link } from "react-router-dom";
import {
  adSenseEnabled,
  openAdPrivacySettings,
} from "./AdSense";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <Logo />
          <p>Les meilleurs deals, partout.</p>
          <span>Sélection indépendante d’offres partenaires vérifiées.</span>
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
            <Link to="/marques">Choisir mes marques</Link>
          </div>
          <div>
            <strong>Dealyva</strong>
            <Link to="/mentions-legales">Transparence</Link>
            <Link to="/mentions-legales#confidentialite">
              Confidentialité
            </Link>
            {adSenseEnabled && (
              <button
                className="footer-privacy-button"
                type="button"
                onClick={openAdPrivacySettings}
              >
                Gérer mes choix publicitaires
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© 2026 Dealyva.</span>
        <span>Conçu avec soin pour vos bonnes trouvailles.</span>
      </div>
    </footer>
  );
}
