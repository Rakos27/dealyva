import { CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialPage } from "../components/EditorialPage";
import { faqItems } from "../data/faq";

export default function FaqPage() {
  return (
    <EditorialPage
      eyebrow="Centre d’aide"
      icon={CircleHelp}
      title="Questions fréquentes"
      intro="Les réponses essentielles sur les promotions, l’affiliation, vos données et le rôle de Dealyva."
      aside={
        <div className="editorial-aside__card">
          <strong>Une question reste sans réponse ?</strong>
          <p>
            Le moyen de contact officiel est indiqué dans nos mentions
            légales.
          </p>
          <Link className="text-link" to="/mentions-legales">
            Consulter les mentions légales
          </Link>
        </div>
      }
    >
      <div className="faq-list">
        {faqItems.map(({ question, answer }, index) => (
          <details key={question} open={index === 0}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </EditorialPage>
  );
}
