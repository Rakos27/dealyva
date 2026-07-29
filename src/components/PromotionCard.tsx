import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock3,
  Copy,
  Heart,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Promotion } from "../types";
import { daysUntil, formatDate, formatPrice } from "../lib/format";
import { useApp } from "../context/AppContext";

interface PromotionCardProps {
  promotion: Promotion;
  reason?: string;
  compact?: boolean;
}

export function PromotionCard({
  promotion,
  reason,
  compact = false,
}: PromotionCardProps) {
  const { favorites, toggleFavorite, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const saved = favorites.includes(promotion.id);
  const remainingDays = daysUntil(promotion.expiresAt);
  const expired = promotion.isExpired || remainingDays < 0;
  const isPartner = promotion.source === "awin";
  const hasPrice = promotion.currentPrice > 0;

  const copyCode = async () => {
    if (!promotion.promoCode) return;
    try {
      await navigator.clipboard.writeText(promotion.promoCode);
      setCopied(true);
      showToast(`Code ${promotion.promoCode} copié`, "success");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      showToast(`Code : ${promotion.promoCode}`);
    }
  };

  const share = async () => {
    const route = `/offre/${promotion.id}`;
    const url =
      import.meta.env.VITE_ROUTER_MODE === "hash"
        ? `${window.location.href.split("#")[0]}#${route}`
        : new URL(route, window.location.origin).href;
    try {
      if (navigator.share) {
        await navigator.share({ title: promotion.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Lien de l’offre copié", "success");
      }
    } catch {
      // Closing the native share dialog is not an application error.
    }
  };

  return (
    <article
      className={[
        "promotion-card",
        compact ? "promotion-card--compact" : "",
        expired ? "promotion-card--expired" : "",
        saved ? "promotion-card--saved" : "",
        isPartner ? "promotion-card--partner" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="promotion-card__media">
        <Link to={`/offre/${promotion.id}`} aria-label={`Voir ${promotion.title}`}>
          <img src={promotion.image} alt="" loading="lazy" />
        </Link>
        <div className="promotion-card__badges">
          {promotion.discount > 0 && (
            <span className="discount-badge">−{promotion.discount}%</span>
          )}
          {isPartner && <span className="partner-badge">Partenaire</span>}
          {promotion.isNew && !expired && <span className="new-badge">Nouveau</span>}
          {expired && <span className="expired-badge">Expirée</span>}
        </div>
        <div className="promotion-card__quick-actions">
          <button
            type="button"
            className={`card-icon-button ${saved ? "is-active" : ""}`}
            onClick={() => toggleFavorite(promotion.id)}
            aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
            aria-pressed={saved}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className="card-icon-button"
            onClick={share}
            aria-label="Partager cette offre"
          >
            <Share2 size={17} />
          </button>
        </div>
      </div>
      <div className="promotion-card__body">
        {reason && <p className="recommendation-reason">{reason}</p>}
        <div className="promotion-card__meta">
          <span className="brand-label">{promotion.brand}</span>
          <span>chez {promotion.merchant}</span>
        </div>
        <Link to={`/offre/${promotion.id}`} className="promotion-card__title">
          <h3>{promotion.title}</h3>
        </Link>
        {hasPrice ? (
          <div className="promotion-card__pricing">
            <strong>{formatPrice(promotion.currentPrice)}</strong>
            <span className="old-price">{formatPrice(promotion.originalPrice)}</span>
            <span className="saving">Économisez {formatPrice(promotion.savings)}</span>
          </div>
        ) : (
          isPartner && (
            <p className="promotion-card__partner-note">
              Offre vérifiée auprès du partenaire
            </p>
          )
        )}
        {promotion.promoCode && !expired && (
          <button type="button" className="promo-code" onClick={copyCode}>
            <span>
              <small>Code</small>
              <strong>{promotion.promoCode}</strong>
            </span>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        )}
        <div className="promotion-card__footer">
          <span className={remainingDays <= 3 && !expired ? "is-urgent" : ""}>
            <Clock3 size={14} aria-hidden="true" />
            {expired
              ? `Expirée le ${formatDate(promotion.expiresAt)}`
              : remainingDays === 0
                ? "Se termine aujourd’hui"
                : remainingDays === 1
                  ? "Plus qu’un jour"
                  : `Jusqu’au ${formatDate(promotion.expiresAt, { year: undefined })}`}
          </span>
          <Link
            to={`/offre/${promotion.id}`}
            className={`card-cta ${expired ? "is-disabled" : ""}`}
            aria-disabled={expired}
          >
            {expired ? "Voir le détail" : "Voir l’offre"}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
