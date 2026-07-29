import type { Category } from "../types";

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=82`;

export const categories: Category[] = [
  {
    id: "mode",
    name: "Mode",
    eyebrow: "Allure au quotidien",
    description:
      "Vêtements, chaussures et accessoires proposés par nos annonceurs partenaires.",
    image: unsplash("photo-1445205170230-053b83016050"),
    accent: "#B48A78",
  },
  {
    id: "sport",
    name: "Sport",
    eyebrow: "Bouger mieux",
    description:
      "Équipement, running, outdoor et essentiels pour toutes vos pratiques.",
    image: unsplash("photo-1542291026-7eec264c27ff"),
    accent: "#587666",
  },
  {
    id: "beaute",
    name: "Beauté",
    eyebrow: "Rituels choisis",
    description:
      "Soin, maquillage et parfums disponibles auprès de nos partenaires.",
    image: unsplash("photo-1522335789203-aabd1fc54bc9"),
    accent: "#B97983",
  },
  {
    id: "high-tech",
    name: "High-tech",
    eyebrow: "Technologie utile",
    description:
      "Smartphones, audio, informatique et maison connectée à prix plus doux.",
    image: unsplash("photo-1511707171634-5f897ff02aa9"),
    accent: "#556E89",
  },
  {
    id: "gaming",
    name: "Gaming",
    eyebrow: "Prêt à jouer",
    description:
      "Consoles, jeux et accessoires pour compléter votre configuration.",
    image: unsplash("photo-1542751371-adc38448a05e"),
    accent: "#725C91",
  },
  {
    id: "maison",
    name: "Maison",
    eyebrow: "Intérieurs inspirés",
    description:
      "Mobilier, décoration, cuisine et équipements pour votre intérieur.",
    image: unsplash("photo-1555041469-a586c61ea9bc"),
    accent: "#94765D",
  },
  {
    id: "alimentation",
    name: "Alimentation",
    eyebrow: "Le goût juste",
    description:
      "Épicerie, paniers repas et plaisirs gourmands disponibles en ligne.",
    image: unsplash("photo-1542838132-92c53300491e"),
    accent: "#74804D",
  },
  {
    id: "voyage",
    name: "Voyage",
    eyebrow: "Partir autrement",
    description:
      "Transports, séjours et hébergements pour préparer votre prochaine échappée.",
    image: unsplash("photo-1507525428034-b723cf961d3e"),
    accent: "#477F8E",
  },
];
