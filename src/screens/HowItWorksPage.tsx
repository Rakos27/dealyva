import {
  ArrowUpRight,
  DatabaseZap,
  Heart,
  ListChecks,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialPage } from "../components/EditorialPage";

const steps = [
  {
    icon: RefreshCw,
    title: "Les offres sont synchronisées",
    text: "Dealyva récupère régulièrement le flux des annonceurs approuvés via la plateforme d’affiliation Awin.",
  },
  {
    icon: ListChecks,
    title: "Les informations sont structurées",
    text: "Nous affichons le marchand, l’avantage annoncé, les conditions reçues, l’échéance et la date de vérification.",
  },
  {
    icon: ArrowUpRight,
    title: "Vous vérifiez chez le marchand",
    text: "Le bouton de l’offre ouvre le site du vendeur. Son prix final et ses conditions font toujours foi.",
  },
];

export default function HowItWorksPage() {
  return (
    <EditorialPage
      eyebrow="Notre méthode"
      icon={DatabaseZap}
      title="Comment fonctionne Dealyva ?"
      intro="De la source partenaire jusqu’au site marchand, voici ce qui se passe lorsque vous consultez une promotion."
      aside={
        <div className="editorial-aside__card editorial-aside__card--dark">
          <Heart aria-hidden="true" size={22} />
          <strong>Vos favoris restent sur votre appareil.</strong>
          <p>
            Aucun compte n’est nécessaire. Vos choix sont enregistrés dans
            votre navigateur et peuvent être supprimés à tout moment.
          </p>
          <Link className="text-link" to="/confidentialite">
            Lire notre politique de confidentialité
          </Link>
        </div>
      }
    >
      <ol className="process-list">
        {steps.map(({ icon: Icon, title, text }, index) => (
          <li key={title}>
            <span className="process-list__number">0{index + 1}</span>
            <Icon aria-hidden="true" size={22} />
            <div>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="editorial-section">
        <h2>Comment Dealyva se rémunère</h2>
        <p>
          Certains liens sont affiliés. Si vous cliquez puis réalisez un achat
          éligible, le marchand peut verser une commission à Dealyva. Cette
          commission n’ajoute pas de frais à votre commande. Les liens
          commerciaux sont signalés sur les pages concernées.
        </p>
      </section>

      <section className="editorial-section">
        <h2>Pourquoi une offre peut changer</h2>
        <p>
          Un prix, un stock ou un code peut évoluer entre deux
          synchronisations. Dealyva fait de son mieux pour retirer les offres
          expirées, mais seul le contenu affiché par le marchand au moment de
          votre visite est contractuel.
        </p>
      </section>
    </EditorialPage>
  );
}
