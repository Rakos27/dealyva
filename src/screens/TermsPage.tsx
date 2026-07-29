import { FileCheck2 } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialPage } from "../components/EditorialPage";
import { legalConfig, legalLastUpdated } from "../config/legal";

export default function TermsPage() {
  return (
    <EditorialPage
      eyebrow="Cadre d’utilisation"
      icon={FileCheck2}
      title="Conditions générales d’utilisation"
      intro={`Les présentes conditions encadrent l’accès gratuit au site Dealyva. Dernière mise à jour : ${legalLastUpdated}.`}
      aside={
        <div className="editorial-aside__card editorial-aside__card--dark">
          <strong>L’essentiel</strong>
          <p>
            Dealyva référence des offres et redirige vers des vendeurs tiers.
            Aucun achat n’est conclu sur Dealyva.
          </p>
          <Link className="text-link" to="/comment-ca-marche">
            Comprendre le fonctionnement
          </Link>
        </div>
      }
    >
      <section className="legal-document">
        <h2>1. Objet et acceptation</h2>
        <p>
          Les présentes conditions générales d’utilisation (« CGU »)
          définissent les règles d’accès et d’utilisation de Dealyva. En
          consultant le site, vous acceptez ces CGU. Si vous ne les acceptez
          pas, vous devez cesser d’utiliser le service.
        </p>

        <h2>2. Description du service</h2>
        <p>
          Dealyva propose gratuitement un catalogue éditorial de promotions,
          codes et avantages transmis par des partenaires. Le site permet de
          filtrer les offres, de les ajouter aux favoris et d’accéder au site
          du marchand.
        </p>

        <h2>3. Absence de vente sur Dealyva</h2>
        <p>
          Dealyva n’est pas partie au contrat de vente conclu avec le marchand.
          Le marchand fixe les prix, stocks, conditions d’éligibilité,
          modalités de paiement, livraison, retour, garantie et service
          après-vente. Ses conditions générales de vente s’appliquent à votre
          commande.
        </p>

        <h2>4. Exactitude et disponibilité des offres</h2>
        <p>
          Dealyva actualise régulièrement ses données, sans pouvoir garantir
          qu’une offre reste disponible ou exempte d’erreur entre deux mises à
          jour. Avant toute commande, vérifiez le prix final, les conditions,
          la disponibilité et l’identité du vendeur sur son site.
        </p>

        <h2>5. Liens affiliés et publicité</h2>
        <p>
          Certains liens sont affiliés : Dealyva peut percevoir une commission
          sur un achat éligible, sans surcoût ajouté par Dealyva. Les
          emplacements publicitaires éventuels sont identifiés par la mention
          « Publicité » et restent distincts du catalogue.
        </p>

        <h2>6. Utilisation autorisée</h2>
        <p>
          Vous vous engagez à ne pas perturber le fonctionnement du site, tenter
          d’accéder à des systèmes sans autorisation, extraire massivement le
          catalogue, contourner ses protections ou réutiliser les contenus à
          des fins trompeuses ou illicites.
        </p>

        <h2>7. Propriété intellectuelle</h2>
        <p>
          La marque, l’interface et les contenus éditoriaux propres à Dealyva
          sont protégés par les règles applicables. Les marques, logos, images
          et contenus des annonceurs demeurent la propriété de leurs titulaires
          respectifs.
        </p>

        <h2>8. Services et sites tiers</h2>
        <p>
          Les sites marchands et services tiers disposent de leurs propres
          conditions et politiques. Dealyva ne contrôle pas leur contenu, leur
          disponibilité ni leurs traitements de données.
        </p>

        <h2>9. Responsabilité</h2>
        <p>
          Dealyva répond de ses obligations dans les limites prévues par le
          droit applicable. Il ne saurait se substituer au marchand pour les
          obligations liées à une vente. Rien dans ces CGU ne limite un droit
          impératif reconnu au consommateur.
        </p>

        <h2>10. Évolution du service et des CGU</h2>
        <p>
          Le service et les présentes CGU peuvent évoluer. La date de mise à
          jour figure en tête de page. Une modification importante sera
          signalée de manière appropriée.
        </p>

        <h2>11. Droit applicable et contact</h2>
        <p>
          Les présentes CGU sont soumises au droit français, sous réserve des
          règles impératives applicables. Pour toute question, utilisez{" "}
          {legalConfig.contactEmail ? (
            <a className="text-link" href={`mailto:${legalConfig.contactEmail}`}>
              {legalConfig.contactEmail}
            </a>
          ) : (
            <Link className="text-link" to="/mentions-legales">
              le contact indiqué dans les mentions légales
            </Link>
          )}
          .
        </p>
      </section>
    </EditorialPage>
  );
}
