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

const lastUpdated = "29 juillet 2026";

export function LegalPage() {
  return (
    <main className="page-shell legal-page">
      <header className="legal-hero" aria-labelledby="legal-title">
        <p className="eyebrow">
          <Scale aria-hidden="true" size={16} />
          Informations et transparence
        </p>
        <h1 id="legal-title">Un prototype clair sur ce qu’il est.</h1>
        <p>
          Dealyva est actuellement une démonstration fonctionnelle. Cette page
          distingue les choix du prototype des informations qui devront être
          complétées avant toute mise en service publique.
        </p>
        <p className="legal-hero__date">Dernière mise à jour : {lastUpdated}</p>
      </header>

      <nav className="legal-nav" aria-label="Sommaire de la page">
        <a href="#mentions-legales">Mentions légales</a>
        <a href="#confidentialite">Confidentialité</a>
        <a href="#transparence">Transparence</a>
      </nav>

      <aside className="legal-demo-banner" aria-label="Statut du service">
        <Info aria-hidden="true" size={22} />
        <div>
          <strong>Version de démonstration</strong>
          <p>
            Aucun achat réel, paiement, compte sécurisé, envoi d’e-mail ou
            notification marchande n’est opéré par cette version.
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
              <h3>Éditeur du prototype</h3>
              <p>
                Dealyva est présenté ici comme un concept de produit et non
                comme un service commercial exploité par une société
                identifiée. Les coordonnées de l’éditeur, la forme juridique,
                le capital social, le numéro d’immatriculation et le directeur
                de publication devront être renseignés avant une publication
                destinée au public.
              </p>
            </div>

            <div className="legal-card">
              <h3>Hébergement et contact</h3>
              <p>
                L’hébergeur définitif et un point de contact officiel ne sont
                pas configurés dans cette démonstration. Ces informations
                devront apparaître ici dès que le projet disposera d’un
                environnement de production et d’un responsable légal.
              </p>
            </div>

            <div className="legal-card">
              <h3>Propriété intellectuelle</h3>
              <p>
                L’interface et les contenus éditoriaux propres à Dealyva sont
                présentés à des fins de prototypage. Les noms, marques et
                signes distinctifs cités restent la propriété de leurs
                titulaires respectifs. Leur présence n’implique ni partenariat
                ni validation du service.
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
                Afin de rendre le prototype interactif, les marques
                sélectionnées, favoris, préférences, alertes fictives,
                historique de consultation et profil de démonstration peuvent
                être enregistrés dans le stockage local de votre navigateur.
                Ces informations restent associées à cet appareil et à ce
                navigateur.
              </p>
              <div className="legal-inline-note">
                <Database aria-hidden="true" size={18} />
                <p>
                  Vous pouvez effacer ces données depuis l’espace profil ou en
                  supprimant les données du site dans les réglages de votre
                  navigateur.
                </p>
              </div>
            </div>

            <div className="legal-card">
              <h3>Compte et alertes de démonstration</h3>
              <p>
                Le compte proposé ne constitue pas un dispositif
                d’authentification sécurisé. N’utilisez aucun véritable mot de
                passe ni information sensible. Les réglages d’alerte simulent
                une expérience future : aucun e-mail, SMS ou notification
                externe n’est envoyé.
              </p>
            </div>

            <div className="legal-card">
              <h3>Cookies et services externes</h3>
              <p>
                Le prototype ne requiert pas de cookie publicitaire. Des
                ressources visuelles peuvent toutefois être chargées depuis
                des services externes, qui appliquent alors leurs propres
                règles techniques. Toute mesure d’audience ou tout traceur
                ajouté ultérieurement devra faire l’objet d’une information
                claire et, lorsque la loi l’exige, d’un consentement préalable.
              </p>
              <div className="legal-inline-note">
                <Cookie aria-hidden="true" size={18} />
                <p>
                  Aucun profil publicitaire ou commercial n’est construit par
                  Dealyva dans cette démonstration.
                </p>
              </div>
            </div>

            <div className="legal-card">
              <h3>Vos droits</h3>
              <p>
                Si Dealyva devient un service connecté, cette section précisera
                le responsable du traitement, les finalités, bases légales,
                durées de conservation, destinataires et modalités d’exercice
                des droits prévus par la réglementation applicable.
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
                <h2>Transparence des offres</h2>
              </div>
            </div>

            <div className="legal-card legal-card--highlight">
              <h3>Des sources d’offres clairement identifiées</h3>
              <p>
                Dealyva distingue les offres partenaires synchronisées via Awin
                des données de démonstration. Les conditions, prix et
                disponibilités d’une offre partenaire doivent toujours être
                vérifiés sur le site du marchand.
              </p>
            </div>

            <div className="legal-card">
              <h3>Une affiliation transparente</h3>
              <p>
                Certains liens vers les marchands sont des liens d’affiliation :
                Dealyva peut percevoir une commission si un achat éligible est
                réalisé, sans surcoût pour l’utilisateur. Cette relation est
                signalée sur les offres concernées et n’accorde pas de priorité
                payante dans les classements.
              </p>
            </div>

            <div className="legal-card">
              <h3>Avant de profiter d’une offre</h3>
              <p>
                L’utilisateur doit toujours vérifier le prix final, la
                disponibilité et les conditions
                directement sur le site du marchand. Celui-ci restera seul
                responsable de la vente, du paiement, de la livraison et du
                service après-vente.
              </p>
            </div>
          </section>
        </article>

        <aside className="legal-sidebar" aria-label="Principes Dealyva">
          <div className="legal-sidebar__card">
            <Sparkles aria-hidden="true" size={20} />
            <h2>Nos principes de prototype</h2>
            <ul>
              <li>
                <LockKeyhole aria-hidden="true" size={16} />
                Pas de données sensibles
              </li>
              <li>
                <Eye aria-hidden="true" size={16} />
                Statut fictif toujours visible
              </li>
              <li>
                <ShieldCheck aria-hidden="true" size={16} />
                Préférences contrôlées localement
              </li>
            </ul>
          </div>
          <p>
            Une question sur cette démonstration ? Le canal de contact officiel
            sera ajouté avant le lancement public.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default LegalPage;
