import {
  AlertTriangle,
  Building2,
  ExternalLink,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialPage } from "../components/EditorialPage";
import { legalConfig, legalLastUpdated } from "../config/legal";

function LegalValue({
  value,
  fallback = "À compléter avant la mise en exploitation commerciale",
}: {
  value: string;
  fallback?: string;
}) {
  return value ? (
    <span>{value}</span>
  ) : (
    <span className="legal-value--pending">{fallback}</span>
  );
}

export default function LegalPage() {
  return (
    <EditorialPage
      eyebrow="Informations obligatoires"
      icon={Scale}
      title="Mentions légales"
      intro={`Informations relatives à l’éditeur, à l’hébergement et au fonctionnement du site Dealyva. Dernière mise à jour : ${legalLastUpdated}.`}
      aside={
        <div className="editorial-aside__stack">
          <div className="editorial-aside__card editorial-aside__card--dark">
            <ShieldCheck aria-hidden="true" size={22} />
            <strong>Transparence commerciale</strong>
            <p>
              Dealyva peut percevoir une commission après un achat éligible,
              sans surcoût ajouté par Dealyva.
            </p>
          </div>
          <nav className="legal-related-links" aria-label="Documents juridiques">
            <strong>Documents associés</strong>
            <Link to="/conditions-utilisation">Conditions d’utilisation</Link>
            <Link to="/confidentialite">Confidentialité</Link>
            <Link to="/cookies">Cookies et traceurs</Link>
          </nav>
        </div>
      }
    >
      {!legalConfig.isPublisherIdentityComplete && (
        <aside className="legal-config-warning" role="note">
          <AlertTriangle aria-hidden="true" size={21} />
          <div>
            <strong>Informations d’éditeur à finaliser</strong>
            <p>
              L’identité, le statut, l’adresse, le contact et la direction de
              publication doivent être renseignés avant la monétisation
              publique du site.
            </p>
          </div>
        </aside>
      )}

      <section className="legal-document">
        <h2>1. Éditeur du site</h2>
        <dl className="legal-identity">
          <div>
            <dt>Nom ou dénomination</dt>
            <dd><LegalValue value={legalConfig.publisherName} /></dd>
          </div>
          <div>
            <dt>Forme ou statut juridique</dt>
            <dd><LegalValue value={legalConfig.publisherStatus} /></dd>
          </div>
          <div>
            <dt>Adresse</dt>
            <dd><LegalValue value={legalConfig.publisherAddress} /></dd>
          </div>
          <div>
            <dt>Responsable de la publication</dt>
            <dd><LegalValue value={legalConfig.publicationDirector} /></dd>
          </div>
          <div>
            <dt>Adresse électronique</dt>
            <dd>
              {legalConfig.contactEmail ? (
                <a
                  className="text-link"
                  href={`mailto:${legalConfig.contactEmail}`}
                >
                  {legalConfig.contactEmail}
                </a>
              ) : (
                <LegalValue value="" />
              )}
            </dd>
          </div>
          <div>
            <dt>Téléphone</dt>
            <dd>
              <LegalValue
                value={legalConfig.contactPhone}
                fallback="À renseigner si applicable à la forme d’exploitation"
              />
            </dd>
          </div>
          {legalConfig.registrationNumber && (
            <div>
              <dt>SIREN / immatriculation</dt>
              <dd>{legalConfig.registrationNumber}</dd>
            </div>
          )}
          {legalConfig.vatNumber && (
            <div>
              <dt>Numéro de TVA intracommunautaire</dt>
              <dd>{legalConfig.vatNumber}</dd>
            </div>
          )}
        </dl>

        <h2>2. Hébergement</h2>
        <div className="legal-host">
          <Building2 aria-hidden="true" size={21} />
          <div>
            <strong>GitHub Pages — GitHub, Inc.</strong>
            <p>
              Service d’hébergement statique accessible depuis{" "}
              <a
                className="text-link"
                href="https://pages.github.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                pages.github.com
                <ExternalLink aria-hidden="true" size={13} />
              </a>
              . L’adresse et les coordonnées à jour de GitHub sont disponibles
              dans ses documents légaux officiels.
            </p>
          </div>
        </div>

        <h2>3. Nature du service</h2>
        <p>
          Dealyva est un service éditorial de référencement d’offres. Il ne
          vend aucun produit, n’encaisse aucun paiement et n’intervient pas dans
          la conclusion ou l’exécution du contrat passé entre l’utilisateur et
          le marchand.
        </p>

        <h2>4. Affiliation et publicité</h2>
        <p>
          Les boutons menant aux marchands peuvent contenir des liens
          d’affiliation Awin. Dealyva peut recevoir une commission lorsqu’un
          achat éligible suit un clic, sans frais ajoutés par Dealyva. Les
          contenus publicitaires éventuels sont identifiés séparément par la
          mention « Publicité ».
        </p>

        <h2>5. Propriété intellectuelle</h2>
        <p>
          L’identité visuelle, l’interface et les contenus éditoriaux propres à
          Dealyva sont protégés par les règles applicables. Les marques, logos,
          images et contenus des annonceurs demeurent la propriété de leurs
          titulaires. Leur présence n’implique aucune cession de droit ni
          approbation éditoriale au-delà du partenariat indiqué.
        </p>

        <h2>6. Signalement et contact</h2>
        <p>
          Pour signaler une erreur, une offre expirée, une atteinte à un droit
          ou poser une question, écrivez à{" "}
          {legalConfig.contactEmail ? (
            <a className="text-link" href={`mailto:${legalConfig.contactEmail}`}>
              {legalConfig.contactEmail}
            </a>
          ) : (
            <a
              className="text-link"
              href={legalConfig.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              l’espace public du projet
            </a>
          )}
          .
        </p>
      </section>
    </EditorialPage>
  );
}
