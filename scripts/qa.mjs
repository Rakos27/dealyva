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
  await page
    .locator(".catalog-results .promotion-card:not(.skeleton-card)")
    .first()
    .waitFor();

  const promotionCount = await page
    .locator(".catalog-results .promotion-card:not(.skeleton-card)")
    .count();
  if (promotionCount < 1) throw new Error("Aucune promotion visible sur l’accueil.");
  await assertNoDocumentOverflow("Accueil desktop");
  await page.getByRole("button", { name: /Activer le mode sombre/i }).click();
  await page.locator("html[data-theme='dark']").waitFor();
  await page.getByRole("button", { name: /Activer le mode clair/i }).click();
  await page.screenshot({
    path: "/tmp/dealyva-home-desktop.png",
    fullPage: true,
  });

  await page.getByRole("button", { name: /Choisir mes marques/i }).click();
  await page.getByRole("dialog", { name: /Sélectionner des marques/i }).waitFor();
  const brandSearch = page.getByPlaceholder(/Rechercher parmi les marques/i);
  await brandSearch.fill("Nike");
  await page.locator(".brand-option").filter({ hasText: "Nike" }).click();
  await page.getByRole("button", { name: "Fermer", exact: true }).click();

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
  await page.getByRole("heading", { name: /Cette sélection est un peu trop précise/i }).waitFor();
  await page.getByRole("button", { name: /Réinitialiser les filtres/i }).click();
  await page
    .locator(".catalog-results .promotion-card:not(.skeleton-card)")
    .first()
    .waitFor();

  await page.locator(".promotion-card__title").first().click();
  await page.getByRole("heading", { name: /Conditions de l’offre/i }).waitFor();
  await assertNoDocumentOverflow("Détail desktop");
  await page.screenshot({
    path: "/tmp/dealyva-detail-desktop.png",
    fullPage: true,
  });

  for (const route of [
    "/marques",
    "/categories",
    "/preferences",
    "/profil",
    "/mentions-legales",
  ]) {
    await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded" });
    await page.locator("main").waitFor();
    await assertNoDocumentOverflow(route);
  }

  await page.goto(`${baseURL}/administration`, {
    waitUntil: "domcontentloaded",
  });
  await page.getByRole("heading", { name: "Vue d’ensemble" }).waitFor();
  await assertNoDocumentOverflow("Administration desktop");
  await page.screenshot({
    path: "/tmp/dealyva-admin-desktop.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Promotions" }).click();
  await page.getByRole("button", { name: /Ajouter une promotion/i }).click();
  await page.getByRole("heading", { name: "Nouvelle promotion" }).waitFor();
  await page.getByRole("button", { name: "Fermer", exact: true }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page
    .locator(".catalog-results .promotion-card:not(.skeleton-card)")
    .first()
    .waitFor();
  await assertNoDocumentOverflow("Accueil mobile");
  await page.getByRole("button", { name: /Ouvrir le menu/i }).click();
  await page.getByRole("navigation", { name: /Navigation mobile/i }).waitFor();
  await page.screenshot({
    path: "/tmp/dealyva-home-mobile.png",
    fullPage: true,
  });

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
        screenshots: [
          "/tmp/dealyva-home-desktop.png",
          "/tmp/dealyva-detail-desktop.png",
          "/tmp/dealyva-admin-desktop.png",
          "/tmp/dealyva-home-mobile.png",
        ],
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
