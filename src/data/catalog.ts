import type { Brand, Category, CategoryId, Promotion } from "../types";

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=82`;

const images = {
  fashionRack: unsplash("photo-1445205170230-053b83016050"),
  fashionStreet: unsplash("photo-1483985988355-763728e1935b"),
  denim: unsplash("photo-1542272604-787c3835535d"),
  polo: unsplash("photo-1521572163474-6864f9cf17ab"),
  bag: unsplash("photo-1553062407-98eeb64c6a62"),
  running: unsplash("photo-1542291026-7eec264c27ff"),
  training: unsplash("photo-1517836357463-d25dfeac3438"),
  outdoors: unsplash("photo-1551632811-561732d1e306"),
  cycling: unsplash("photo-1502744688674-c619d1586c9e"),
  beauty: unsplash("photo-1522335789203-aabd1fc54bc9"),
  skincare: unsplash("photo-1556228720-195a672e8a03"),
  cosmetics: unsplash("photo-1596462502278-27bfdc403348"),
  perfume: unsplash("photo-1541643600914-78b084683601"),
  smartphone: unsplash("photo-1511707171634-5f897ff02aa9"),
  laptop: unsplash("photo-1496181133206-80ce9b88a853"),
  headphones: unsplash("photo-1505740420928-5e560c06d30e"),
  television: unsplash("photo-1593359677879-a4bb92f829d1"),
  smartHome: unsplash("photo-1558002038-1055907df827"),
  gaming: unsplash("photo-1542751371-adc38448a05e"),
  controller: unsplash("photo-1592840496694-26d035b52b48"),
  console: unsplash("photo-1486401899868-0e435ed85128"),
  keyboard: unsplash("photo-1587829741301-dc798b83add3"),
  livingRoom: unsplash("photo-1555041469-a586c61ea9bc"),
  chair: unsplash("photo-1567538096630-e0c55bd6374c"),
  kitchen: unsplash("photo-1556911220-bff31c812dba"),
  coffee: unsplash("photo-1495474472287-4d71bcdd2085"),
  groceries: unsplash("photo-1542838132-92c53300491e"),
  organicFood: unsplash("photo-1543168256-418811576931"),
  chocolate: unsplash("photo-1549007994-cb92caebd54b"),
  mealBox: unsplash("photo-1547592180-85f173990554"),
  beach: unsplash("photo-1507525428034-b723cf961d3e"),
  hotel: unsplash("photo-1566073771259-6a8506099945"),
  train: unsplash("photo-1473445361085-b9a07f55608b"),
  luggage: unsplash("photo-1553531384-cc64ac80f931"),
} as const;

export const categories: Category[] = [
  {
    id: "mode",
    name: "Mode",
    eyebrow: "Allure au quotidien",
    description:
      "Vêtements, chaussures et accessoires choisis parmi vos marques préférées.",
    image: images.fashionRack,
    accent: "#B48A78",
  },
  {
    id: "sport",
    name: "Sport",
    eyebrow: "Bouger mieux",
    description:
      "Équipement, running, outdoor et essentiels pour toutes vos pratiques.",
    image: images.running,
    accent: "#587666",
  },
  {
    id: "beaute",
    name: "Beauté",
    eyebrow: "Rituels choisis",
    description:
      "Soin, maquillage et parfums à découvrir dans une sélection élégante.",
    image: images.beauty,
    accent: "#B97983",
  },
  {
    id: "high-tech",
    name: "High-tech",
    eyebrow: "Technologie utile",
    description:
      "Smartphones, audio, informatique et maison connectée à prix plus doux.",
    image: images.smartphone,
    accent: "#556E89",
  },
  {
    id: "gaming",
    name: "Gaming",
    eyebrow: "Prêt à jouer",
    description:
      "Consoles, jeux et accessoires pour compléter votre configuration.",
    image: images.gaming,
    accent: "#725C91",
  },
  {
    id: "maison",
    name: "Maison",
    eyebrow: "Intérieurs inspirés",
    description:
      "Mobilier, décoration, cuisine et équipements pour un intérieur qui vous ressemble.",
    image: images.livingRoom,
    accent: "#94765D",
  },
  {
    id: "alimentation",
    name: "Alimentation",
    eyebrow: "Le goût juste",
    description:
      "Épicerie, paniers repas et plaisirs gourmands disponibles en ligne.",
    image: images.groceries,
    accent: "#74804D",
  },
  {
    id: "voyage",
    name: "Voyage",
    eyebrow: "Partir autrement",
    description:
      "Transports, séjours et hébergements pour préparer votre prochaine échappée.",
    image: images.beach,
    accent: "#477F8E",
  },
];

const brandNames: Record<CategoryId, string[]> = {
  mode: [
    "Zara",
    "H&M",
    "Mango",
    "Uniqlo",
    "Levi's",
    "Lacoste",
    "Sandro",
    "The Kooples",
    "COS",
    "Massimo Dutti",
    "Tommy Hilfiger",
    "Calvin Klein",
  ],
  sport: [
    "Nike",
    "Adidas",
    "Puma",
    "New Balance",
    "Asics",
    "Reebok",
    "Salomon",
    "Under Armour",
    "Decathlon",
    "The North Face",
    "Columbia",
    "Patagonia",
  ],
  beaute: [
    "Sephora",
    "Nocibé",
    "Marionnaud",
    "L'Oréal Paris",
    "Lancôme",
    "Yves Rocher",
    "Rituals",
    "Clarins",
    "Kiehl's",
    "Typology",
    "Caudalie",
    "MAC Cosmetics",
  ],
  "high-tech": [
    "Apple",
    "Samsung",
    "Sony",
    "LG",
    "Philips",
    "Fnac",
    "Darty",
    "Boulanger",
    "Bose",
    "Logitech",
    "Dyson",
    "Xiaomi",
  ],
  gaming: [
    "Nintendo",
    "PlayStation",
    "Xbox",
    "Steam",
    "Ubisoft",
    "EA Sports",
    "Razer",
    "Corsair",
    "ASUS ROG",
    "MSI",
    "SteelSeries",
    "Micromania",
  ],
  maison: [
    "IKEA",
    "Maisons du Monde",
    "La Redoute Intérieurs",
    "Leroy Merlin",
    "Castorama",
    "Habitat",
    "Alinéa",
    "Conforama",
    "But",
    "Tefal",
    "Nespresso",
    "KitchenAid",
  ],
  alimentation: [
    "Carrefour",
    "Auchan",
    "Monoprix",
    "E.Leclerc",
    "Intermarché",
    "Picard",
    "Greenweez",
    "La Fourche",
    "Kusmi Tea",
    "Lindt",
    "Illy",
    "HelloFresh",
  ],
  voyage: [
    "Air France",
    "SNCF Connect",
    "Booking.com",
    "Expedia",
    "Accor",
    "Club Med",
    "easyJet",
    "Transavia",
    "BlaBlaCar",
    "Europcar",
    "Pierre & Vacances",
    "Center Parcs",
  ],
};

const brandTones: Record<CategoryId, string[]> = {
  mode: ["#E9E1DC", "#EFE8E2", "#E4DDD8"],
  sport: ["#DDE8E1", "#E5ECE7", "#D7E2DC"],
  beaute: ["#F0DFE2", "#F4E7E9", "#EAD9DD"],
  "high-tech": ["#DCE4EC", "#E5EAF0", "#D6E0EA"],
  gaming: ["#E4DDED", "#EBE6F1", "#DDD5E8"],
  maison: ["#E8E0D7", "#EEE8E1", "#DED4CA"],
  alimentation: ["#E3E8D9", "#EBEEDF", "#DCE2D0"],
  voyage: ["#D9E8EB", "#E3EEF0", "#D1E2E6"],
};

const toId = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getInitials = (name: string) => {
  const words = name
    .replace(/[^A-Za-zÀ-ÿ0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export const brands: Brand[] = (
  Object.entries(brandNames) as [CategoryId, string[]][]
).flatMap(([category, names]) =>
  names.map((name, index) => ({
    id: toId(name),
    name,
    category,
    initials: getInitials(name),
    tone: brandTones[category][index % brandTones[category].length],
  })),
);

interface OfferSeed {
  id: string;
  brand: string;
  merchant: string;
  category: CategoryId;
  title: string;
  description: string;
  originalPrice: number;
  currentPrice: number;
  image: string;
  expiresAt: string;
  tags: string[];
  condition: string;
  promoCode?: string;
  isNew?: boolean;
  createdAt?: string;
  verifiedAt?: string;
}

const createdDates = [
  "2026-07-03T08:30:00.000Z",
  "2026-07-09T10:15:00.000Z",
  "2026-07-14T07:45:00.000Z",
  "2026-07-18T13:20:00.000Z",
  "2026-07-22T09:10:00.000Z",
  "2026-07-25T16:40:00.000Z",
  "2026-07-28T11:05:00.000Z",
  "2026-07-29T06:55:00.000Z",
] as const;

const verifiedDates = [
  "2026-07-27T08:10:00.000Z",
  "2026-07-28T09:25:00.000Z",
  "2026-07-28T15:40:00.000Z",
  "2026-07-29T07:30:00.000Z",
  "2026-07-29T10:15:00.000Z",
] as const;

const demoNow = Date.parse("2026-07-29T12:00:00.000Z");
const day = 24 * 60 * 60 * 1000;

const makePromotion = (seed: OfferSeed, index: number): Promotion => {
  const brand = brands.find((candidate) => candidate.name === seed.brand);

  if (!brand || brand.category !== seed.category) {
    throw new Error(`Marque de démonstration invalide pour l'offre ${seed.id}`);
  }

  const expiration = Date.parse(seed.expiresAt);
  const isExpired = expiration < demoNow;
  const savings = Number((seed.originalPrice - seed.currentPrice).toFixed(2));

  return {
    id: seed.id,
    brandId: brand.id,
    brand: brand.name,
    merchant: seed.merchant,
    category: seed.category,
    title: seed.title,
    description: seed.description,
    originalPrice: seed.originalPrice,
    currentPrice: seed.currentPrice,
    discount: Math.round((savings / seed.originalPrice) * 100),
    savings,
    image: seed.image,
    expiresAt: seed.expiresAt,
    verifiedAt:
      seed.verifiedAt ??
      (isExpired
        ? new Date(expiration - day).toISOString()
        : verifiedDates[index % verifiedDates.length]),
    createdAt:
      seed.createdAt ??
      (isExpired
        ? new Date(expiration - 10 * day).toISOString()
        : createdDates[index % createdDates.length]),
    promoCode: seed.promoCode,
    isNew: seed.isNew ?? false,
    isExpired,
    onlineOnly: true,
    terms: [
      seed.condition,
      "Offre fictive créée pour la démonstration Dealyva, sans garantie de disponibilité.",
    ],
    tags: seed.tags,
  };
};

const offerSeeds: OfferSeed[] = [
  // Mode
  {
    id: "zara-blazer-texture",
    brand: "Zara",
    merchant: "Zara.com",
    category: "mode",
    title: "Blazer texturé à coupe droite",
    description:
      "Un blazer structuré facile à porter, proposé ici dans deux teintes de mi-saison.",
    originalPrice: 79.95,
    currentPrice: 55.95,
    image: images.fashionStreet,
    expiresAt: "2026-07-19T21:59:59.000Z",
    tags: ["blazer", "femme", "mi-saison"],
    condition: "Tailles et coloris sélectionnés, exclusivement sur la boutique en ligne.",
  },
  {
    id: "hm-ensemble-lin",
    brand: "H&M",
    merchant: "H&M en ligne",
    category: "mode",
    title: "Ensemble en lin mélangé",
    description:
      "Chemise ample et pantalon assorti dans une matière légère pour la fin de l'été.",
    originalPrice: 49.99,
    currentPrice: 34.99,
    image: images.fashionRack,
    expiresAt: "2026-08-03T21:59:59.000Z",
    tags: ["lin", "ensemble", "été"],
    condition: "Remise appliquée au panier sur les références signalées.",
    promoCode: "LIN30",
  },
  {
    id: "mango-robe-satinee",
    brand: "Mango",
    merchant: "Mango.com",
    category: "mode",
    title: "Robe midi satinée",
    description:
      "Une robe fluide au tombé lumineux, disponible dans une sélection de tailles.",
    originalPrice: 69.99,
    currentPrice: 48.99,
    image: images.fashionStreet,
    expiresAt: "2026-08-09T21:59:59.000Z",
    tags: ["robe", "cérémonie", "femme"],
    condition: "Dans la limite des stocks de démonstration indiqués.",
  },
  {
    id: "uniqlo-veste-blocktech",
    brand: "Uniqlo",
    merchant: "Uniqlo France",
    category: "mode",
    title: "Veste légère BLOCKTECH",
    description:
      "Une couche coupe-vent compacte pensée pour les trajets et les averses estivales.",
    originalPrice: 69.9,
    currentPrice: 49.9,
    image: images.fashionRack,
    expiresAt: "2026-08-16T21:59:59.000Z",
    tags: ["veste", "imperméable", "unisexe"],
    condition: "Prix valable sur les coloris bleu nuit et sable.",
  },
  {
    id: "levis-501-original",
    brand: "Levi's",
    merchant: "Levi.com",
    category: "mode",
    title: "Jean 501 Original",
    description:
      "La coupe droite emblématique en denim bleu moyen, dans une sélection de longueurs.",
    originalPrice: 110,
    currentPrice: 77,
    image: images.denim,
    expiresAt: "2026-08-22T21:59:59.000Z",
    tags: ["denim", "jean", "iconique"],
    condition: "Hors collaborations et personnalisations.",
    promoCode: "DENIM30",
  },
  {
    id: "lacoste-polo-pique",
    brand: "Lacoste",
    merchant: "Lacoste.com",
    category: "mode",
    title: "Polo classique en petit piqué",
    description:
      "Le polo signature décliné dans des coloris sobres, prêt pour une garde-robe durable.",
    originalPrice: 110,
    currentPrice: 82.5,
    image: images.polo,
    expiresAt: "2026-07-31T21:59:59.000Z",
    tags: ["polo", "coton", "homme"],
    condition: "Sélection de couleurs et tailles identifiée sur la fiche produit.",
    isNew: true,
  },
  {
    id: "sandro-sac-yza-mini",
    brand: "Sandro",
    merchant: "Sandro Paris",
    category: "mode",
    title: "Sac Yza mini matelassé",
    description:
      "Un petit sac à chaîne au format compact pour accompagner les tenues du soir.",
    originalPrice: 245,
    currentPrice: 171.5,
    image: images.bag,
    expiresAt: "2026-08-13T21:59:59.000Z",
    tags: ["sac", "accessoire", "cuir"],
    condition: "Remise limitée au modèle et aux finitions présentés.",
  },

  // Sport
  {
    id: "adidas-ultraboost-light",
    brand: "Adidas",
    merchant: "Adidas.fr",
    category: "sport",
    title: "Ultraboost Light",
    description:
      "Une chaussure de running confortable pour les sorties quotidiennes sur route.",
    originalPrice: 180,
    currentPrice: 126,
    image: images.running,
    expiresAt: "2026-07-23T21:59:59.000Z",
    tags: ["running", "chaussures", "route"],
    condition: "Modèles et pointures signalés dans la rubrique outlet.",
  },
  {
    id: "nike-pegasus-41",
    brand: "Nike",
    merchant: "Nike.com",
    category: "sport",
    title: "Pegasus 41",
    description:
      "Un amorti polyvalent pour enchaîner les kilomètres, du footing à la sortie tempo.",
    originalPrice: 139.99,
    currentPrice: 97.99,
    image: images.running,
    expiresAt: "2026-08-08T21:59:59.000Z",
    tags: ["running", "chaussures", "entraînement"],
    condition: "Pointures et coloris sélectionnés, hors modèles personnalisés.",
    promoCode: "RUN30",
    isNew: true,
  },
  {
    id: "decathlon-tente-mt900",
    brand: "Decathlon",
    merchant: "Decathlon.fr",
    category: "sport",
    title: "Tente de trek MT900 deux places",
    description:
      "Une tente légère et compacte conçue pour les itinérances en duo.",
    originalPrice: 199.99,
    currentPrice: 159.99,
    image: images.outdoors,
    expiresAt: "2026-08-17T21:59:59.000Z",
    tags: ["trek", "camping", "outdoor"],
    condition: "Livraison standard incluse en France métropolitaine dans cette simulation.",
  },
  {
    id: "salomon-xt-6",
    brand: "Salomon",
    merchant: "Salomon.com",
    category: "sport",
    title: "Sneakers XT-6",
    description:
      "Le modèle trail devenu urbain, avec maintien précis et semelle adhérente.",
    originalPrice: 180,
    currentPrice: 135,
    image: images.running,
    expiresAt: "2026-07-30T21:59:59.000Z",
    tags: ["trail", "sneakers", "outdoor"],
    condition: "Une paire par commande, dans la limite des tailles disponibles.",
  },
  {
    id: "new-balance-1906r",
    brand: "New Balance",
    merchant: "New Balance France",
    category: "sport",
    title: "Sneakers 1906R",
    description:
      "Une silhouette rétro-running avec amorti moderne pour un usage quotidien.",
    originalPrice: 160,
    currentPrice: 128,
    image: images.running,
    expiresAt: "2026-08-20T21:59:59.000Z",
    tags: ["sneakers", "lifestyle", "running"],
    condition: "Offre réservée aux références affichant la mention de démonstration.",
  },
  {
    id: "puma-survetement-t7",
    brand: "Puma",
    merchant: "Puma.com",
    category: "sport",
    title: "Ensemble de survêtement T7",
    description:
      "La veste et le pantalon assorti dans une coupe décontractée inspirée des archives.",
    originalPrice: 90,
    currentPrice: 58.5,
    image: images.training,
    expiresAt: "2026-08-05T21:59:59.000Z",
    tags: ["training", "survêtement", "lifestyle"],
    condition: "Prix de l'ensemble, coloris sélectionnés uniquement.",
    promoCode: "T7STYLE",
  },
  {
    id: "north-face-veste-quest",
    brand: "The North Face",
    merchant: "The North Face",
    category: "sport",
    title: "Veste imperméable Quest",
    description:
      "Une veste protectrice et respirante pour les randonnées sous météo changeante.",
    originalPrice: 220,
    currentPrice: 154,
    image: images.outdoors,
    expiresAt: "2026-08-26T21:59:59.000Z",
    tags: ["randonnée", "veste", "imperméable"],
    condition: "Hors éditions limitées et gamme Summit Series.",
  },

  // Beauté
  {
    id: "sephora-palette-nude",
    brand: "Sephora",
    merchant: "Sephora.fr",
    category: "beaute",
    title: "Palette Nude Obsessions",
    description:
      "Une harmonie de neuf fards mats et lumineux pour composer des looks naturels.",
    originalPrice: 59.99,
    currentPrice: 41.99,
    image: images.cosmetics,
    expiresAt: "2026-07-21T21:59:59.000Z",
    tags: ["maquillage", "palette", "yeux"],
    condition: "Une palette par cliente dans le cadre de cette offre fictive.",
  },
  {
    id: "rituals-coffret-sakura",
    brand: "Rituals",
    merchant: "Rituals.com",
    category: "beaute",
    title: "Coffret The Ritual of Sakura",
    description:
      "Un rituel parfumé pour le corps composé de quatre essentiels au format cadeau.",
    originalPrice: 49.9,
    currentPrice: 39.92,
    image: images.skincare,
    expiresAt: "2026-08-12T21:59:59.000Z",
    tags: ["soin", "coffret", "corps"],
    condition: "Valable sur le coffret medium, hors emballage cadeau.",
  },
  {
    id: "typology-serum-vitamine-c",
    brand: "Typology",
    merchant: "Typology.com",
    category: "beaute",
    title: "Sérum éclat à la vitamine C",
    description:
      "Un sérum visage concentré pour raviver l'éclat et unifier visuellement le teint.",
    originalPrice: 31.9,
    currentPrice: 25.52,
    image: images.skincare,
    expiresAt: "2026-08-04T21:59:59.000Z",
    tags: ["sérum", "visage", "vitamine-c"],
    condition: "Remise appliquée à un flacon de 30 ml maximum par commande.",
    promoCode: "ECLAT20",
    isNew: true,
  },
  {
    id: "caudalie-coffret-vinoperfect",
    brand: "Caudalie",
    merchant: "Caudalie.com",
    category: "beaute",
    title: "Coffret routine Vinoperfect",
    description:
      "Une routine éclat en trois étapes réunie dans un coffret découverte.",
    originalPrice: 45.9,
    currentPrice: 34.43,
    image: images.skincare,
    expiresAt: "2026-08-19T21:59:59.000Z",
    tags: ["coffret", "éclat", "visage"],
    condition: "Offre non cumulable avec un avantage fidélité fictif.",
  },
  {
    id: "lancome-la-vie-est-belle",
    brand: "Lancôme",
    merchant: "Lancôme France",
    category: "beaute",
    title: "Eau de parfum La Vie Est Belle",
    description:
      "Le parfum floral iconique dans son flacon rechargeable de 50 ml.",
    originalPrice: 112,
    currentPrice: 84,
    image: images.perfume,
    expiresAt: "2026-08-28T21:59:59.000Z",
    tags: ["parfum", "femme", "rechargeable"],
    condition: "Format 50 ml uniquement, hors gravure et coffrets.",
    promoCode: "PARFUM25",
  },
  {
    id: "clarins-double-serum",
    brand: "Clarins",
    merchant: "Clarins.fr",
    category: "beaute",
    title: "Double Serum format découverte",
    description:
      "Un soin concentré bi-phase proposé dans un format de 30 ml.",
    originalPrice: 68,
    currentPrice: 51,
    image: images.beauty,
    expiresAt: "2026-07-31T21:59:59.000Z",
    tags: ["anti-âge", "sérum", "visage"],
    condition: "Dans la limite de deux produits par panier.",
  },
  {
    id: "kiehls-duo-ultra-facial",
    brand: "Kiehl's",
    merchant: "Kiehl's France",
    category: "beaute",
    title: "Duo hydratant Ultra Facial",
    description:
      "Le nettoyant doux et la crème hydratante réunis pour une routine essentielle.",
    originalPrice: 72,
    currentPrice: 54,
    image: images.skincare,
    expiresAt: "2026-08-14T21:59:59.000Z",
    tags: ["hydratation", "duo", "visage"],
    condition: "Duo précomposé uniquement, hors formats individuels.",
  },

  // High-tech
  {
    id: "apple-airpods-pro-2",
    brand: "Apple",
    merchant: "Fnac.com",
    category: "high-tech",
    title: "AirPods Pro 2 avec boîtier USB-C",
    description:
      "Des écouteurs sans fil à réduction de bruit avec boîtier de charge MagSafe.",
    originalPrice: 279,
    currentPrice: 229,
    image: images.headphones,
    expiresAt: "2026-07-24T21:59:59.000Z",
    tags: ["audio", "écouteurs", "apple"],
    condition: "Produit neuf vendu et expédié par le marchand indiqué.",
  },
  {
    id: "samsung-galaxy-s25",
    brand: "Samsung",
    merchant: "Samsung Shop",
    category: "high-tech",
    title: "Galaxy S25 256 Go",
    description:
      "Un smartphone compact avec écran lumineux et stockage confortable.",
    originalPrice: 999,
    currentPrice: 799,
    image: images.smartphone,
    expiresAt: "2026-08-10T21:59:59.000Z",
    tags: ["smartphone", "android", "256-go"],
    condition: "Prix sans reprise, coloris graphite et bleu disponibles.",
    promoCode: "GALAXY200",
  },
  {
    id: "sony-tv-bravia-oled",
    brand: "Sony",
    merchant: "Darty.com",
    category: "high-tech",
    title: "TV Bravia OLED 55 pouces",
    description:
      "Une image OLED contrastée et un traitement cinéma dans un format de salon polyvalent.",
    originalPrice: 1899,
    currentPrice: 1499,
    image: images.television,
    expiresAt: "2026-08-23T21:59:59.000Z",
    tags: ["tv", "oled", "cinéma"],
    condition: "Livraison au pied du domicile incluse dans le scénario de démonstration.",
  },
  {
    id: "bose-quietcomfort-ultra",
    brand: "Bose",
    merchant: "Bose.fr",
    category: "high-tech",
    title: "Casque QuietComfort Ultra",
    description:
      "Un casque sans fil confortable avec réduction de bruit et audio immersif.",
    originalPrice: 449.95,
    currentPrice: 349.95,
    image: images.headphones,
    expiresAt: "2026-08-02T21:59:59.000Z",
    tags: ["casque", "audio", "réduction-de-bruit"],
    condition: "Coloris noir et blanc fumé, un casque par commande.",
    isNew: true,
  },
  {
    id: "dyson-v15-detect",
    brand: "Dyson",
    merchant: "Dyson.fr",
    category: "high-tech",
    title: "Aspirateur V15 Detect",
    description:
      "Un aspirateur-balai puissant avec éclairage de la poussière et écran de contrôle.",
    originalPrice: 699,
    currentPrice: 559.2,
    image: images.smartHome,
    expiresAt: "2026-08-18T21:59:59.000Z",
    tags: ["aspirateur", "maison-connectée", "sans-fil"],
    condition: "Accessoires inclus selon la configuration présentée.",
    promoCode: "CLEAN20",
  },
  {
    id: "logitech-mx-keys-mini",
    brand: "Logitech",
    merchant: "Boulanger.com",
    category: "high-tech",
    title: "Clavier MX Keys Mini",
    description:
      "Un clavier compact rétroéclairé capable de basculer entre trois appareils.",
    originalPrice: 119.99,
    currentPrice: 89.99,
    image: images.keyboard,
    expiresAt: "2026-07-30T21:59:59.000Z",
    tags: ["clavier", "bureau", "bluetooth"],
    condition: "Disposition AZERTY française uniquement.",
  },
  {
    id: "xiaomi-robot-vacuum-s20",
    brand: "Xiaomi",
    merchant: "Xiaomi Store",
    category: "high-tech",
    title: "Robot aspirateur S20+",
    description:
      "Aspiration et lavage automatisés avec cartographie des pièces dans l'application.",
    originalPrice: 399.99,
    currentPrice: 299.99,
    image: images.smartHome,
    expiresAt: "2026-08-30T21:59:59.000Z",
    tags: ["robot", "aspirateur", "maison-connectée"],
    condition: "Offre limitée à un appareil par foyer de démonstration.",
  },

  // Gaming
  {
    id: "nintendo-switch-oled",
    brand: "Nintendo",
    merchant: "Micromania.fr",
    category: "gaming",
    title: "Console Switch OLED blanche",
    description:
      "La console hybride avec écran OLED 7 pouces et station d'accueil assortie.",
    originalPrice: 349.99,
    currentPrice: 299.99,
    image: images.console,
    expiresAt: "2026-07-25T21:59:59.000Z",
    tags: ["console", "switch", "portable"],
    condition: "Console seule, hors jeu et accessoire additionnel.",
  },
  {
    id: "playstation-ps5-slim-astro",
    brand: "PlayStation",
    merchant: "Fnac.com",
    category: "gaming",
    title: "Pack PS5 Slim et Astro Bot",
    description:
      "La console avec lecteur de disque accompagnée d'un jeu de plateforme familial.",
    originalPrice: 619.99,
    currentPrice: 549.99,
    image: images.console,
    expiresAt: "2026-08-06T21:59:59.000Z",
    tags: ["ps5", "console", "bundle"],
    condition: "Pack indissociable, limité à une unité par commande.",
  },
  {
    id: "xbox-series-s-1to",
    brand: "Xbox",
    merchant: "Microsoft Store",
    category: "gaming",
    title: "Xbox Series S 1 To",
    description:
      "Une console entièrement numérique au format compact avec un téraoctet de stockage.",
    originalPrice: 349.99,
    currentPrice: 279.99,
    image: images.controller,
    expiresAt: "2026-08-15T21:59:59.000Z",
    tags: ["xbox", "console", "digital"],
    condition: "Compte Microsoft et connexion internet requis pour les téléchargements.",
    promoCode: "SERIES70",
  },
  {
    id: "razer-blackwidow-v4",
    brand: "Razer",
    merchant: "Razer.com",
    category: "gaming",
    title: "Clavier BlackWidow V4",
    description:
      "Un clavier mécanique réactif avec repose-poignets et éclairage personnalisable.",
    originalPrice: 169.99,
    currentPrice: 119.99,
    image: images.keyboard,
    expiresAt: "2026-07-31T21:59:59.000Z",
    tags: ["clavier", "mécanique", "rgb"],
    condition: "Version AZERTY avec switches verts uniquement.",
    isNew: true,
  },
  {
    id: "corsair-hs80-wireless",
    brand: "Corsair",
    merchant: "Corsair.com",
    category: "gaming",
    title: "Casque HS80 Wireless",
    description:
      "Un casque gaming sans fil avec micro omnidirectionnel et son spatial.",
    originalPrice: 109.99,
    currentPrice: 76.99,
    image: images.headphones,
    expiresAt: "2026-08-21T21:59:59.000Z",
    tags: ["casque", "sans-fil", "pc"],
    condition: "Compatible PC et PlayStation selon les spécifications du fabricant.",
  },
  {
    id: "steam-selection-independants",
    brand: "Steam",
    merchant: "Steam",
    category: "gaming",
    title: "Collection de jeux indépendants",
    description:
      "Cinq aventures acclamées réunies dans un lot numérique à télécharger.",
    originalPrice: 89.99,
    currentPrice: 44.99,
    image: images.gaming,
    expiresAt: "2026-08-01T16:59:59.000Z",
    tags: ["jeux", "pc", "indépendant"],
    condition: "Clés liées au compte après activation, lot non fractionnable.",
  },
  {
    id: "asus-rog-monitor-oled",
    brand: "ASUS ROG",
    merchant: "ASUS Store",
    category: "gaming",
    title: "Moniteur ROG OLED 27 pouces",
    description:
      "Un écran QHD rapide pensé pour le jeu compétitif et les noirs profonds.",
    originalPrice: 599.99,
    currentPrice: 449.99,
    image: images.gaming,
    expiresAt: "2026-08-27T21:59:59.000Z",
    tags: ["écran", "oled", "qhd"],
    condition: "Livraison standard offerte, quantité fictive limitée.",
    promoCode: "ROG25",
  },

  // Maison
  {
    id: "ikea-fauteuil-poang",
    brand: "IKEA",
    merchant: "IKEA.fr",
    category: "maison",
    title: "Fauteuil POÄNG et repose-pieds",
    description:
      "Le fauteuil courbé iconique accompagné de son repose-pieds coordonné.",
    originalPrice: 249,
    currentPrice: 199,
    image: images.chair,
    expiresAt: "2026-07-18T21:59:59.000Z",
    tags: ["fauteuil", "salon", "mobilier"],
    condition: "Housse beige et structure bouleau dans cette offre de démonstration.",
  },
  {
    id: "maisons-du-monde-table-ovale",
    brand: "Maisons du Monde",
    merchant: "Maisonsdumonde.com",
    category: "maison",
    title: "Table ovale en chêne clair",
    description:
      "Une table conviviale aux lignes douces pouvant accueillir jusqu'à six personnes.",
    originalPrice: 699,
    currentPrice: 489.3,
    image: images.livingRoom,
    expiresAt: "2026-08-11T21:59:59.000Z",
    tags: ["table", "chêne", "salle-à-manger"],
    condition: "Livraison et montage non compris dans le prix affiché.",
  },
  {
    id: "redoute-interieurs-parure-lin",
    brand: "La Redoute Intérieurs",
    merchant: "La Redoute",
    category: "maison",
    title: "Parure de lit en lin lavé",
    description:
      "Une housse de couette et deux taies au toucher souple dans un ton naturel.",
    originalPrice: 129,
    currentPrice: 90.3,
    image: images.livingRoom,
    expiresAt: "2026-08-24T21:59:59.000Z",
    tags: ["linge-de-lit", "lin", "chambre"],
    condition: "Dimensions 240 × 220 cm, teintes sélectionnées.",
    promoCode: "MAISON30",
  },
  {
    id: "tefal-ingenio-set",
    brand: "Tefal",
    merchant: "Tefal.fr",
    category: "maison",
    title: "Batterie Ingenio 10 pièces",
    description:
      "Un ensemble empilable avec poignées amovibles pour cuisiner et ranger facilement.",
    originalPrice: 199.99,
    currentPrice: 119.99,
    image: images.kitchen,
    expiresAt: "2026-08-07T21:59:59.000Z",
    tags: ["cuisine", "casseroles", "rangement"],
    condition: "Composition exacte détaillée sur la fiche de démonstration.",
  },
  {
    id: "nespresso-vertuo-pop",
    brand: "Nespresso",
    merchant: "Nespresso.com",
    category: "maison",
    title: "Machine Vertuo Pop",
    description:
      "Une machine compacte capable de préparer plusieurs formats de café.",
    originalPrice: 149,
    currentPrice: 89.4,
    image: images.coffee,
    expiresAt: "2026-07-31T21:59:59.000Z",
    tags: ["café", "machine", "cuisine"],
    condition: "Achat de capsules non requis dans cette simulation.",
    promoCode: "POP40",
    isNew: true,
  },
  {
    id: "kitchenaid-artisan-robot",
    brand: "KitchenAid",
    merchant: "KitchenAid.fr",
    category: "maison",
    title: "Robot pâtissier Artisan",
    description:
      "Le robot à tête inclinable avec bol inox, fouet, batteur et crochet pétrisseur.",
    originalPrice: 699,
    currentPrice: 559.2,
    image: images.kitchen,
    expiresAt: "2026-08-25T21:59:59.000Z",
    tags: ["pâtisserie", "robot", "cuisine"],
    condition: "Coloris crème et noir uniquement, accessoires supplémentaires exclus.",
  },
  {
    id: "leroy-merlin-perceuse-bosch",
    brand: "Leroy Merlin",
    merchant: "LeroyMerlin.fr",
    category: "maison",
    title: "Perceuse-visseuse sans fil 18 V",
    description:
      "Un kit polyvalent avec deux batteries pour les travaux courants de la maison.",
    originalPrice: 159,
    currentPrice: 119.25,
    image: images.smartHome,
    expiresAt: "2026-08-31T21:59:59.000Z",
    tags: ["bricolage", "outillage", "sans-fil"],
    condition: "Kit et accessoires visibles sur l'image produit uniquement.",
  },

  // Alimentation
  {
    id: "carrefour-panier-epicerie",
    brand: "Carrefour",
    merchant: "Carrefour.fr",
    category: "alimentation",
    title: "Panier épicerie du quotidien",
    description:
      "Une sélection de produits essentiels pour composer les repas de la semaine.",
    originalPrice: 54.9,
    currentPrice: 43.9,
    image: images.groceries,
    expiresAt: "2026-07-22T21:59:59.000Z",
    tags: ["épicerie", "panier", "quotidien"],
    condition: "Livraison à domicile selon les zones fictivement éligibles.",
  },
  {
    id: "picard-menu-ete",
    brand: "Picard",
    merchant: "Picard.fr",
    category: "alimentation",
    title: "Menu d'été pour quatre",
    description:
      "Entrées, plats et desserts surgelés réunis pour un dîner estival sans préparation.",
    originalPrice: 39.9,
    currentPrice: 31.92,
    image: images.mealBox,
    expiresAt: "2026-08-05T21:59:59.000Z",
    tags: ["surgelés", "menu", "été"],
    condition: "Panier prédéfini, substitutions non disponibles.",
  },
  {
    id: "greenweez-placard-bio",
    brand: "Greenweez",
    merchant: "Greenweez.com",
    category: "alimentation",
    title: "Sélection placard bio",
    description:
      "Céréales, légumineuses et condiments bio pour renouveler les essentiels du placard.",
    originalPrice: 79.9,
    currentPrice: 59.93,
    image: images.organicFood,
    expiresAt: "2026-08-18T21:59:59.000Z",
    tags: ["bio", "épicerie", "vrac"],
    condition: "Sélection de quinze références, hors produits frais.",
    promoCode: "BIO25",
  },
  {
    id: "la-fourche-abonnement-annuel",
    brand: "La Fourche",
    merchant: "LaFourche.fr",
    category: "alimentation",
    title: "Adhésion annuelle",
    description:
      "Un an d'accès au catalogue bio à prix membre dans le cadre de la démonstration.",
    originalPrice: 69.9,
    currentPrice: 49.9,
    image: images.organicFood,
    expiresAt: "2026-08-29T21:59:59.000Z",
    tags: ["adhésion", "bio", "épicerie"],
    condition: "Réservé aux nouvelles adhésions fictives, sans renouvellement automatique.",
  },
  {
    id: "kusmi-coffret-thes",
    brand: "Kusmi Tea",
    merchant: "KusmiTea.com",
    category: "alimentation",
    title: "Coffret découverte de thés",
    description:
      "Six mini-boîtes pour explorer des mélanges noirs, verts et sans théine.",
    originalPrice: 44.9,
    currentPrice: 33.68,
    image: images.coffee,
    expiresAt: "2026-07-31T21:59:59.000Z",
    tags: ["thé", "coffret", "dégustation"],
    condition: "Coffret composé à l'avance, non personnalisable.",
    isNew: true,
  },
  {
    id: "lindt-boite-creation",
    brand: "Lindt",
    merchant: "Lindt.fr",
    category: "alimentation",
    title: "Boîte Création assortie",
    description:
      "Un assortiment de chocolats fins au lait et noirs dans une boîte à offrir.",
    originalPrice: 39.99,
    currentPrice: 29.99,
    image: images.chocolate,
    expiresAt: "2026-08-13T21:59:59.000Z",
    tags: ["chocolat", "assortiment", "cadeau"],
    condition: "Offre hors chocolats personnalisés et frais de livraison.",
    promoCode: "DOUCEUR25",
  },
  {
    id: "hellofresh-box-famille",
    brand: "HelloFresh",
    merchant: "HelloFresh.fr",
    category: "alimentation",
    title: "Box famille trois repas",
    description:
      "Les ingrédients portionnés et les fiches recettes pour trois dîners à quatre.",
    originalPrice: 63,
    currentPrice: 37.8,
    image: images.mealBox,
    expiresAt: "2026-08-09T21:59:59.000Z",
    tags: ["box-repas", "famille", "recettes"],
    condition: "Réservé à une première box fictive, abonnement résiliable immédiatement.",
    promoCode: "CUISINE40",
  },

  // Voyage
  {
    id: "air-france-escapade-lisbonne",
    brand: "Air France",
    merchant: "AirFrance.fr",
    category: "voyage",
    title: "Aller-retour Paris–Lisbonne",
    description:
      "Un tarif de démonstration pour une escapade de quatre jours en septembre.",
    originalPrice: 329,
    currentPrice: 279,
    image: images.beach,
    expiresAt: "2026-07-20T21:59:59.000Z",
    tags: ["vol", "lisbonne", "city-break"],
    condition: "Prix par adulte, bagage cabine inclus, dates fictives sélectionnées.",
  },
  {
    id: "sncf-week-end-bordeaux",
    brand: "SNCF Connect",
    merchant: "SNCF Connect",
    category: "voyage",
    title: "Week-end à Bordeaux en TGV",
    description:
      "Un aller-retour de démonstration depuis Paris pour voyager au début de l'automne.",
    originalPrice: 120,
    currentPrice: 89,
    image: images.train,
    expiresAt: "2026-08-03T21:59:59.000Z",
    tags: ["train", "bordeaux", "week-end"],
    condition: "Tarif par personne, échange et remboursement selon conditions fictives.",
  },
  {
    id: "booking-hotel-rome",
    brand: "Booking.com",
    merchant: "Booking.com",
    category: "voyage",
    title: "Trois nuits dans le centre de Rome",
    description:
      "Un hôtel quatre étoiles fictif avec petit-déjeuner, à quelques pas du Panthéon.",
    originalPrice: 420,
    currentPrice: 336,
    image: images.hotel,
    expiresAt: "2026-08-16T21:59:59.000Z",
    tags: ["hôtel", "rome", "city-break"],
    condition: "Prix total pour deux personnes, taxes locales fictives non incluses.",
    promoCode: "ROMA20",
  },
  {
    id: "accor-mercure-biarritz",
    brand: "Accor",
    merchant: "ALL.Accor.com",
    category: "voyage",
    title: "Séjour Mercure à Biarritz",
    description:
      "Quatre nuits en chambre double avec petit-déjeuner dans un hôtel de démonstration.",
    originalPrice: 560,
    currentPrice: 420,
    image: images.hotel,
    expiresAt: "2026-07-31T21:59:59.000Z",
    tags: ["hôtel", "biarritz", "océan"],
    condition: "Séjour fictif pour deux personnes, dates et disponibilité limitées.",
    isNew: true,
  },
  {
    id: "club-med-sejour-alpes",
    brand: "Club Med",
    merchant: "ClubMed.fr",
    category: "voyage",
    title: "Semaine d'été dans les Alpes",
    description:
      "Sept nuits en formule tout compris pour deux adultes dans un resort fictif.",
    originalPrice: 1890,
    currentPrice: 1512,
    image: images.outdoors,
    expiresAt: "2026-08-20T21:59:59.000Z",
    tags: ["montagne", "tout-compris", "séjour"],
    condition: "Transport non inclus, activités selon le programme de démonstration.",
  },
  {
    id: "easyjet-vol-nice",
    brand: "easyJet",
    merchant: "easyJet.com",
    category: "voyage",
    title: "Vol aller-retour pour Nice",
    description:
      "Un tarif léger de démonstration pour profiter d'un long week-end sur la Côte d'Azur.",
    originalPrice: 149.99,
    currentPrice: 119.99,
    image: images.beach,
    expiresAt: "2026-08-08T21:59:59.000Z",
    tags: ["vol", "nice", "week-end"],
    condition: "Petit bagage cabine inclus, sélection de vols et dates fictives.",
    promoCode: "NICE20",
  },
  {
    id: "pierre-vacances-cote-atlantique",
    brand: "Pierre & Vacances",
    merchant: "PierreEtVacances.com",
    category: "voyage",
    title: "Appartement sur la côte Atlantique",
    description:
      "Une semaine dans un appartement quatre personnes proche de l'océan.",
    originalPrice: 790,
    currentPrice: 592.5,
    image: images.luggage,
    expiresAt: "2026-08-31T21:59:59.000Z",
    tags: ["appartement", "océan", "famille"],
    condition: "Hébergement seul, taxes de séjour et prestations additionnelles exclues.",
  },
];

export const promotions: Promotion[] = offerSeeds.map(makePromotion);

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);

export const getBrandOfferCount = (
  brandId: string,
  includeExpired = false,
) =>
  promotions.filter(
    (promotion) =>
      promotion.brandId === brandId &&
      (includeExpired || promotion.isExpired !== true),
  ).length;
