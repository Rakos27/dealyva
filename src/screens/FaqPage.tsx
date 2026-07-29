import { CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import { EditorialPage } from "../components/EditorialPage";

const questions = [
  {
    question: "Les promotions sont-elles réelles ?",
    answer:
      "Les offres publiées proviennent des flux Awin d’annonceurs partenaires approuvés. Dealyva n’invente ni prix ni code. Vérifiez néanmoins toujours les conditions finales sur le site du marchand.",
  },
  {
    question: "Pourquoi le prix est-il parfois différent ?",
    answer:
      "Les prix, stocks et conditions peuvent être modifiés par le marchand après la dernière synchronisation. Le prix affiché chez le vendeur au moment de la commande fait foi.",
  },
  {
    question: "Est-ce que je paie plus cher en passant par Dealyva ?",
    answer:
      "Non. Un lien affilié peut rémunérer Dealyva si votre achat est éligible, mais il n’ajoute pas de frais au prix facturé par le marchand.",
  },
  {
    question: "Dealyva vend-il les produits présentés ?",
    answer:
      "Non. Dealyva est un service éditorial de sélection et de redirection. La commande, le paiement, la livraison, les retours et le service après-vente sont gérés par le marchand.",
  },
  {
    question: "Ai-je besoin de créer un compte ?",
    answer:
      "Non. Les favoris et préférences sont enregistrés localement dans votre navigateur. Ils ne sont pas synchronisés entre vos appareils.",
  },
  {
    question: "Comment supprimer mes favoris et préférences ?",
    answer:
      "Vous pouvez retirer les favoris depuis le site ou effacer les données du site dans les réglages de votre navigateur. Cela supprime aussi le thème et les marques sélectionnées.",
  },
  {
    question: "Pourquoi vois-je une publicité ?",
    answer:
      "Lorsque la publicité est activée, les blocs concernés portent clairement la mention « Publicité ». Ils sont distincts des promotions affiliées et soumis à vos choix de consentement lorsque la loi l’exige.",
  },
  {
    question: "Comment signaler une offre expirée ou incorrecte ?",
    answer:
      "Utilisez le moyen de contact indiqué dans les mentions légales en précisant la marque, le titre de l’offre et, si possible, son lien.",
  },
];

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
        {questions.map(({ question, answer }, index) => (
          <details key={question} open={index === 0}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </EditorialPage>
  );
}
