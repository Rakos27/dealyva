import type { Promotion } from "../types";
import { formatRelativeTime } from "./format";

const genericTerms = [
  "conditions détaillées disponibles sur le site de la marque.",
];

export function getOfferTrust(promotion: Promotion) {
  if (promotion.source === "demo") {
    return {
      fresh: true,
      recent: true,
      hasDetailedTerms: true,
      hasValidExpiry: true,
      freshnessLabel: "Scénario de démonstration",
      verifiedLabel: "Données fictives clairement identifiées",
    };
  }

  const verifiedAt = new Date(promotion.verifiedAt).getTime();
  const ageHours = Number.isFinite(verifiedAt)
    ? Math.max(0, (Date.now() - verifiedAt) / 3_600_000)
    : Infinity;
  const fresh = ageHours <= 12;
  const recent = ageHours <= 48;
  const hasDetailedTerms = promotion.terms.some(
    (term) => !genericTerms.includes(term.trim().toLocaleLowerCase("fr-FR")),
  );
  const hasValidExpiry =
    Number.isFinite(new Date(promotion.expiresAt).getTime()) &&
    new Date(promotion.expiresAt).getTime() > Date.now();

  return {
    fresh,
    recent,
    hasDetailedTerms,
    hasValidExpiry,
    freshnessLabel: fresh
      ? "Synchronisée récemment"
      : recent
        ? "Synchronisation récente"
        : "À revérifier chez le marchand",
    verifiedLabel: Number.isFinite(verifiedAt)
      ? `Vérifiée ${formatRelativeTime(promotion.verifiedAt)}`
      : "Date de vérification indisponible",
  };
}

export function getOfferReportUrl(promotion: Promotion) {
  const subject = `Signalement Dealyva — ${promotion.brand}`;
  const details = [
    `Offre : ${promotion.title}`,
    `Identifiant : ${promotion.id}`,
    `Page : ${window.location.href}`,
    "",
    "Problème constaté : ",
  ].join("\n");
  const email = import.meta.env.VITE_REPORT_EMAIL?.trim();

  if (email) {
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(details)}`;
  }

  return (
    "https://github.com/Rakos27/dealyva/issues/new" +
    `?title=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(details)}` +
    "&labels=offre-signalee"
  );
}
