import { BadgeCheck, HeartHandshake, Radar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialPage } from "../components/EditorialPage";

export default function AboutPage() {
  return (
    <EditorialPage
      eyebrow="À propos"
      icon={Sparkles}
      title="Les offres utiles, sans le bruit."
      intro="Dealyva est un guide français indépendant qui rassemble des promotions diffusées par des marchands partenaires. Notre objectif : rendre les bonnes affaires plus simples à trouver, à comparer et à vérifier."
      aside={
        <div className="editorial-aside__card">
          <span className="eyebrow">Notre promesse</span>
          <strong>Clarté avant quantité.</strong>
          <p>
            Une offre doit indiquer sa source, ses conditions essentielles et
            sa date de vérification.
          </p>
          <Link className="text-link" to="/comment-ca-marche">
            Découvrir notre méthode
          </Link>
        </div>
      }
    >
      <section className="editorial-section">
        <h2>Pourquoi Dealyva existe</h2>
        <p>
          Les promotions sont souvent dispersées, vite périmées et difficiles
          à lire. Dealyva les organise par marque et catégorie, puis vous
          conduit directement vers le marchand pour vérifier le prix final et
          profiter de l’offre.
        </p>
      </section>

      <div className="editorial-feature-grid">
        <section>
          <Radar aria-hidden="true" size={21} />
          <h2>Des sources identifiées</h2>
          <p>
            Le catalogue est alimenté par Awin auprès d’annonceurs ayant
            accepté le partenariat avec Dealyva.
          </p>
        </section>
        <section>
          <BadgeCheck aria-hidden="true" size={21} />
          <h2>Des informations vérifiables</h2>
          <p>
            Chaque offre affiche son marchand, ses conditions disponibles et
            sa dernière date de synchronisation.
          </p>
        </section>
        <section>
          <HeartHandshake aria-hidden="true" size={21} />
          <h2>Un modèle transparent</h2>
          <p>
            Dealyva peut recevoir une commission après un achat éligible, sans
            modifier le prix payé chez le marchand.
          </p>
        </section>
      </div>

      <section className="editorial-section">
        <h2>Ce que Dealyva ne fait pas</h2>
        <p>
          Dealyva n’est ni le vendeur, ni l’intermédiaire de paiement. Nous ne
          traitons pas les commandes, livraisons, retours ou garanties. Ces
          services relèvent exclusivement du marchand choisi.
        </p>
      </section>
    </EditorialPage>
  );
}
