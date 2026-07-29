import {
  BadgeCheck,
  CalendarCheck2,
  ClipboardCheck,
  RefreshCw,
} from "lucide-react";
import type { Promotion } from "../types";
import { getOfferTrust } from "../lib/trust";

export function OfferTrustPanel({ promotion }: { promotion: Promotion }) {
  const trust = getOfferTrust(promotion);
  const isDemo = promotion.source === "demo";

  return (
    <section className="offer-trust" aria-labelledby="offer-trust-title">
      <div className="offer-trust__heading">
        <BadgeCheck aria-hidden="true" size={22} />
        <div>
          <span className="eyebrow">
            {isDemo ? "Mode test transparent" : "Transparence de l’offre"}
          </span>
          <h2 id="offer-trust-title">
            {isDemo
              ? "Ce que cette démonstration permet de tester"
              : "Ce que nous avons pu vérifier"}
          </h2>
        </div>
      </div>
      <div className="offer-trust__grid">
        <div className={trust.recent ? "is-positive" : "is-warning"}>
          <RefreshCw aria-hidden="true" size={18} />
          <span>
            <strong>{trust.freshnessLabel}</strong>
            <small>{trust.verifiedLabel}</small>
          </span>
        </div>
        <div className={trust.hasDetailedTerms ? "is-positive" : "is-warning"}>
          <ClipboardCheck aria-hidden="true" size={18} />
          <span>
            <strong>
              {isDemo
                ? "Conditions de test présentes"
                : trust.hasDetailedTerms
                ? "Conditions communiquées"
                : "Conditions limitées"}
            </strong>
            <small>
              {isDemo
                ? "Aucun produit ni code commercial réel"
                : trust.hasDetailedTerms
                ? `${promotion.terms.length} condition${promotion.terms.length > 1 ? "s" : ""} transmise${promotion.terms.length > 1 ? "s" : ""}`
                : "À consulter sur le site marchand"}
            </small>
          </span>
        </div>
        <div className={trust.hasValidExpiry ? "is-positive" : "is-warning"}>
          <CalendarCheck2 aria-hidden="true" size={18} />
          <span>
            <strong>
              {isDemo
                ? "Échéance simulée"
                : trust.hasValidExpiry
                ? "Échéance identifiée"
                : "Échéance à contrôler"}
            </strong>
            <small>
              {isDemo
                ? "Date créée uniquement pour tester les filtres"
                : "La disponibilité finale reste celle du marchand"}
            </small>
          </span>
        </div>
      </div>
    </section>
  );
}
