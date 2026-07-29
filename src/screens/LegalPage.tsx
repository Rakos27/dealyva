import {
  Cookie,
  Database,
  Eye,
  Info,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  adSenseEnabled,
  openAdPrivacySettings,
} from "../components/AdSense";

const lastUpdated = "29 juillet 2026";

export function LegalPage() {
  return (
    <main className="page-shell legal-page">
      <header className="legal-hero" aria-labelledby="legal-title">
        <p className="eyebrow">
          <Scale aria-hidden="true" size={16} />
          Informations et transparence
        </p>
        <h1 id="legal-title">Un service clair sur son fonctionnement.</h1>
        <p>
          Dealyva sélectionne des promotions partenaires et redirige les
          utilisateurs vers les marchands. Le service ne vend aucun produit et
          n’encaisse aucun paiement.
        </p>
        <p className="legal-hero__date">Dernière mise à jour : {lastUpdated}</p>
      </header>

      <nav className="legal-nav" aria-label="Sommaire de la page">
        <a href="#mentions-legales">Mentions légales</a>
        <a href="#confidentialite">Confidentialité</a>
        <a href="#transparence">Publicité et affiliation</a>
      </nav>

      <aside className="legal-status-banner" aria-label="Statut du service">
        <Info aria-hidden="true" size={22} />
        <div>
          <strong>Service de mise en relation</strong>
          <p>
            Les achats, paiements, livraisons, retours et garanties sont
            intégralement gérés par le marchand vers lequel vous êtes redirigé.
          </p>
        </div>
      </aside>

      <div className="legal-layout">
        <article className="legal-content">
          <section id="mentions-legales" className="legal-section">
            <div className="legal-section__heading">
              <span className="legal-section__icon">
                <Scale aria-hidden="true" size={20} />
              </span>
              <div>
                <p className="eyebrow">01</p>
                <h2>Mentions légales</h2>
              </div>
            </div>

            <div className="legal-card">
              <h3>Éditeur</h3>
              <p>
                Le site est édité sous la marque Dealyva par le propriétaire du
                projet. Dans l’attente d’une adresse de contact dédiée, les
                demandes peuvent être transmises depuis le{" "}
                <a
                  className="text-link"
                  href="https://github.com/Rakos27/dealyva"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  dépôt officiel du projet
                </a>
                .
              </p>
            </div>

            <div className="legal-card">
              <h3>Hébergement</h3>
              <p>
                Dealyva est actuellement hébergé par GitHub Pages, un service
                exploité par GitHub, Inc. Les éléments techniques du site sont
                servis depuis l’infrastructure GitHub.
              </p>
            </div>

            <div className="legal-card">
              <h3>Propriété intellectuelle</h3>
              <p>
                L’identité et les contenus éditoriaux propres à Dealyva sont
                protégés. Les noms, marques, visuels et signes distinctifs des
                annonceurs restent la propriété de leurs titulaires respectifs.
                Leur présence correspond à une offre diffusée via le réseau
                partenaire et ne transfère aucun droit à Dealyva.
              </p>
            </div>
          </section>

          <section id="confidentialite" className="legal-section">
            <div className="legal-section__heading">
              <span className="legal-section__icon">
                <ShieldCheck aria-hidden="true" size={20} />
              </span>
              <div>
                <p className="eyebrow">02</p>
                <h2>Confidentialité</h2>
              </div>
            </div>

            <div className="legal-card">
              <h3>Données enregistrées localement</h3>
              <p>
                Les favoris, marques sélectionnées, préférences d’affichage et
                offres récemment consultées sont conservés dans le stockage
                local de votre navigateur. Dealyva ne crée pas de compte
                utilisateur et ne reçoit pas ces informations.
              </p>
              <div className="legal-inline-note">
                <Database aria-hidden="true" size={18} />
                <p>
                  Vous pouvez supprimer ces données à tout moment depuis les
                  réglages de votre navigateur.
                </p>
              </div>
            </div>

            <div className="legal-card">
              <h3>Publicité et consentement</h3>
              <p>
                Lorsque Google AdSense est activé, Google et ses partenaires
                peuvent utiliser des cookies ou technologies similaires pour
                diffuser, mesurer et personnaliser des annonces. Pour les
                visiteurs concernés, les choix sont recueillis par une
                plateforme de gestion du consentement certifiée par Google.
              </p>
              <div className="legal-inline-note">
                <Cookie aria-hidden="true" size={18} />
                <p>
                  Vous pouvez accepter, refuser ou modifier vos choix depuis le
                  message de confidentialité affiché par Google.
                </p>
              </div>
              {adSenseEnabled && (
                <button
                  className="text-link"
                  type="button"
                  onClick={openAdPrivacySettings}
                >
                  Gérer mes choix publicitaires
                </button>
              )}
            </div>

            <div className="legal-card">
              <h3>Sites marchands</h3>
              <p>
                En cliquant sur une offre, vous quittez Dealyva. Le marchand,
                Awin et leurs prestataires appliquent alors leurs propres règles
                de confidentialité et peuvent traiter les données nécessaires
                au suivi d’affiliation.
              </p>
            </div>

            <div className="legal-card">
              <h3>Vos droits</h3>
              <p>
                Toute demande relative aux données ou à la confidentialité peut
                être adressée à l’éditeur via le canal de contact indiqué
                ci-dessus. Les données conservées uniquement dans votre
                navigateur peuvent être effacées directement sur votre appareil.
              </p>
            </div>
          </section>

          <section id="transparence" className="legal-section">
            <div className="legal-section__heading">
              <span className="legal-section__icon">
                <Eye aria-hidden="true" size={20} />
              </span>
              <div>
                <p className="eyebrow">03</p>
                <h2>Publicité et affiliation</h2>
              </div>
            </div>

            <div className="legal-card legal-card--highlight">
              <h3>Des offres issues d’annonceurs approuvés</h3>
              <p>
                Les promotions visibles sur Dealyva sont synchronisées via Awin
                auprès des annonceurs ayant accepté le partenariat. Aucun prix,
                code ou avantage commercial n’est inventé par Dealyva.
              </p>
            </div>

            <div className="legal-card">
              <h3>Une affiliation transparente</h3>
              <p>
                Les liens vers les marchands sont des liens d’affiliation.
                Dealyva peut percevoir une commission lorsqu’un achat éligible
                est réalisé, sans surcoût pour l’utilisateur. Cette rémunération
                ne modifie pas les conditions affichées par le marchand.
              </p>
            </div>

            <div className="legal-card">
              <h3>Des annonces clairement séparées</h3>
              <p>
                Les emplacements Google AdSense portent la mention « Publicité ».
                Ils sont distincts des cartes d’offres et ne déterminent pas le
                classement éditorial des promotions partenaires.
              </p>
            </div>

            <div className="legal-card">
              <h3>Avant de profiter d’une offre</h3>
              <p>
                Vérifiez toujours le prix final, la disponibilité et les
                conditions directement sur le site du marchand. Celui-ci reste
                seul responsable de la vente, du paiement, de la livraison et
                du service après-vente.
              </p>
            </div>
          </section>
        </article>

        <aside className="legal-sidebar" aria-label="Principes Dealyva">
          <div className="legal-sidebar__card">
            <Sparkles aria-hidden="true" size={20} />
            <h2>Nos principes</h2>
            <ul>
              <li>
                <LockKeyhole aria-hidden="true" size={16} />
                Pas de compte ni de données sensibles
              </li>
              <li>
                <Eye aria-hidden="true" size={16} />
                Publicités et affiliation identifiées
              </li>
              <li>
                <ShieldCheck aria-hidden="true" size={16} />
                Préférences contrôlées localement
              </li>
            </ul>
          </div>
          <p>
            Dealyva privilégie la transparence sur l’origine des offres et son
            mode de rémunération.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default LegalPage;
