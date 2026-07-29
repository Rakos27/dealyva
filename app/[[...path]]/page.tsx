/* eslint-disable react-refresh/only-export-components */

import DealyvaClient from "../dealyva-client";

const staticMetadata: Record<string, { title: string; description: string }> = {
  "": {
    title: "Promotions partenaires vérifiées",
    description:
      "Découvrez les promotions en ligne d’annonceurs partenaires, vérifiées et classées simplement par Dealyva.",
  },
  marques: {
    title: "Marques partenaires",
    description:
      "Parcourez les marques partenaires présentes sur Dealyva et retrouvez leurs promotions en cours.",
  },
  categories: {
    title: "Catégories de promotions",
    description:
      "Explorez les promotions Dealyva par catégorie : mode, beauté, high-tech, sport, maison et voyage.",
  },
  "a-propos": {
    title: "À propos",
    description:
      "Découvrez la mission de Dealyva, sa méthode de sélection et son modèle d’affiliation transparent.",
  },
  "comment-ca-marche": {
    title: "Comment fonctionne Dealyva ?",
    description:
      "Comprenez comment les promotions sont synchronisées, vérifiées et reliées aux sites marchands.",
  },
  faq: {
    title: "Questions fréquentes",
    description:
      "Les réponses aux questions fréquentes sur les promotions, l’affiliation et les données utilisées par Dealyva.",
  },
  "mentions-legales": {
    title: "Mentions légales",
    description:
      "Informations relatives à l’éditeur, à l’hébergement et au fonctionnement du site Dealyva.",
  },
  "conditions-utilisation": {
    title: "Conditions d’utilisation",
    description:
      "Conditions générales encadrant l’accès et l’utilisation du service Dealyva.",
  },
  confidentialite: {
    title: "Politique de confidentialité",
    description:
      "Données locales, hébergement, affiliation et droits des utilisateurs de Dealyva.",
  },
  cookies: {
    title: "Cookies et traceurs",
    description:
      "Fonctionnement du stockage local, des traceurs d’affiliation et des choix publicitaires sur Dealyva.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const route = path.join("/");
  const generic =
    route.startsWith("marque/")
      ? {
          title: "Promotions de la marque",
          description:
            "Découvrez les offres actives de cette marque, leur source et leur date de vérification sur Dealyva.",
        }
      : route.startsWith("offre/")
        ? {
            title: "Détail de l’offre",
            description:
              "Consultez les conditions, la source et la dernière vérification de cette promotion partenaire.",
          }
        : undefined;
  const metadata = staticMetadata[route] ?? generic ?? {
    title: "Page introuvable",
    description: "Retrouvez les promotions partenaires sur Dealyva.",
  };

  return {
    title: `${metadata.title} — Dealyva`,
    description: metadata.description,
    openGraph: {
      type: "website",
      siteName: "Dealyva",
      title: `${metadata.title} — Dealyva`,
      description: metadata.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${metadata.title} — Dealyva`,
      description: metadata.description,
    },
  };
}

export default function DealyvaPage() {
  return <DealyvaClient />;
}
