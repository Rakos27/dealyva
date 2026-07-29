import { chromium } from "playwright";

const baseURL =
  process.env.DEALYVA_URL ??
  process.env.OFFRELY_URL ??
  "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  colorScheme: "light",
  locale: "fr-FR",
});
const page = await context.newPage();
page.setDefaultTimeout(15_000);
const consoleErrors = [];
const fixtureGeneratedAt = new Date().toISOString();
const fixturePromotions = [
  {
    id: "awin-qa-001",
    brandId: "awin-101-dealyva-tech",
    brand: "Dealyva Tech",
    merchant: "Dealyva Tech",
    category: "high-tech",
    title: "Offre partenaire de contrôle qualité",
    description:
      "Promotion utilisée uniquement par les tests automatisés de Dealyva.",
    originalPrice: 129,
    currentPrice: 89,
    discount: 31,
    savings: 40,
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='650'%3E%3Crect width='900' height='650' fill='%23e9e9e5'/%3E%3C/svg%3E",
    expiresAt: "2027-12-31T23:59:59.000Z",
    verifiedAt: fixtureGeneratedAt,
    createdAt: fixtureGeneratedAt,
    promoCode: "QUALITE",
    isNew: true,
    isExpired: false,
    onlineOnly: true,
    terms: [
      "Offre de test non publiée.",
      "Conditions vérifiées par le scénario automatisé.",
    ],
    tags: ["awin", "code-promo", "high-tech"],
    source: "awin",
    sourceId: "qa-001",
    affiliateUrl: "https://example.com/qa-001",
    offerType: "voucher",
  },
  {
    id: "awin-qa-002",
    brandId: "awin-102-dealyva-maison",
    brand: "Dealyva Maison",
    merchant: "Dealyva Maison",
    category: "maison",
    title: "Seconde offre de contrôle",
    description: "Une seconde promotion pour vérifier les listes et filtres.",
    originalPrice: 79,
    currentPrice: 59,
    discount: 25,
    savings: 20,
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='650'%3E%3Crect width='900' height='650' fill='%23deded9'/%3E%3C/svg%3E",
    expiresAt: "2027-11-30T23:59:59.000Z",
    verifiedAt: fixtureGeneratedAt,
    createdAt: fixtureGeneratedAt,
    isNew: false,
    isExpired: false,
    onlineOnly: true,
    terms: ["Offre de test non publiée."],
    tags: ["awin", "promotion", "maison"],
    source: "awin",
    sourceId: "qa-002",
    affiliateUrl: "https://example.com/qa-002",
    offerType: "promotion",
  },
];

await page.route("**/data/promotions.json", async (route) => {
  await route.fulfill({
    contentType: "application/json",
    body: JSON.stringify({
      generatedAt: fixtureGeneratedAt,
      promotions: fixturePromotions,
    }),
  });
});

page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => consoleErrors.push(error.message));

async function assertNoDocumentOverflow(label) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
  }));
  if (dimensions.document > dimensions.viewport + 1) {
    throw new Error(
      `${label} déborde horizontalement (${dimensions.document}px pour ${dimensions.viewport}px).`,
    );
  }
}

try {
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: /Les meilleurs deals/i }).waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector(".promotion-card:not(.skeleton-card)") !== null ||
      document.querySelector(".live-catalog-empty") !== null,
  );

  const promotionCount = await page
    .locator(".promotion-card:not(.skeleton-card)")
    .count();
  await assertNoDocumentOverflow("Accueil desktop");
  await page.getByRole("button", { name: /Activer le mode sombre/i }).click();
  await page.locator("html[data-theme='dark']").waitFor();
  await page.getByRole("button", { name: /Activer le mode clair/i }).click();
  await page.screenshot({
    path: "/tmp/dealyva-home-desktop.png",
    fullPage: true,
  });

  const screenshots = ["/tmp/dealyva-home-desktop.png"];

  if (promotionCount > 0) {
    const favoriteButton = page
      .locator(".promotion-card")
      .first()
      .getByRole("button", { name: /Ajouter aux favoris/i });
    await favoriteButton.click();
    await page.getByRole("link", { name: /Mes favoris/i }).first().click();
    await page.getByRole("heading", { name: "Mes favoris", exact: true }).waitFor();
    await page.locator(".favorite-item").first().waitFor();

    await page.goto(baseURL, { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder(/Une marque, un produit/i).fill(
      "recherche volontairement introuvable 9284",
    );
    await page
      .getByRole("heading", { name: /Cette sélection est un peu trop précise/i })
      .waitFor();
    await page.getByRole("button", { name: /Réinitialiser les filtres/i }).click();
    await page.locator(".promotion-card:not(.skeleton-card)").first().waitFor();

    await page.locator(".promotion-card__title").first().click();
    await page.getByRole("heading", { name: /Conditions de l’offre/i }).waitFor();
    await page
      .getByRole("heading", { name: /Ce que nous avons pu vérifier/i })
      .waitFor();
    await assertNoDocumentOverflow("Détail desktop");
    await page.screenshot({
      path: "/tmp/dealyva-detail-desktop.png",
      fullPage: true,
    });
    screenshots.push("/tmp/dealyva-detail-desktop.png");
  }

  for (const route of [
    "/marques",
    "/categories",
    "/favoris",
    "/a-propos",
    "/comment-ca-marche",
    "/faq",
    "/mentions-legales",
    "/conditions-utilisation",
    "/confidentialite",
    "/cookies",
    "/marque/awin-101-dealyva-tech",
  ]) {
    await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
    await page.locator("main").waitFor();
    await assertNoDocumentOverflow(route);
  }

  await page.goto(`${baseURL}/marque/awin-101-dealyva-tech`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("heading", { name: /Promotions Dealyva Tech/i }).waitFor();
  await page.screenshot({
    path: "/tmp/dealyva-brand-desktop.png",
    fullPage: true,
  });
  screenshots.push("/tmp/dealyva-brand-desktop.png");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      document.querySelector(".promotion-card:not(.skeleton-card)") !== null ||
      document.querySelector(".live-catalog-empty") !== null,
  );
  await assertNoDocumentOverflow("Accueil mobile");
  await page.getByRole("button", { name: /Ouvrir le menu/i }).click();
  await page.getByRole("navigation", { name: /Navigation mobile/i }).waitFor();
  await page.screenshot({
    path: "/tmp/dealyva-home-mobile.png",
    fullPage: true,
  });
  screenshots.push("/tmp/dealyva-home-mobile.png");

  await page.goto(`${baseURL}/marque/awin-101-dealyva-tech`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("heading", { name: /Promotions Dealyva Tech/i }).waitFor();
  await assertNoDocumentOverflow("Marque mobile");
  await page.screenshot({
    path: "/tmp/dealyva-brand-mobile.png",
    fullPage: true,
  });
  screenshots.push("/tmp/dealyva-brand-mobile.png");

  const uniqueErrors = [...new Set(consoleErrors)].filter(
    (message) =>
      !message.includes("Failed to load resource") &&
      !message.includes("ERR_NAME_NOT_RESOLVED"),
  );
  if (uniqueErrors.length) {
    throw new Error(`Erreurs navigateur :\n${uniqueErrors.join("\n")}`);
  }

  console.log(
    JSON.stringify(
      {
        status: "ok",
        promotionCardsOnFirstLoad: promotionCount,
        screenshots,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
