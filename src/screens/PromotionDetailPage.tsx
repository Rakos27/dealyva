import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Heart,
  Info,
  MessageSquareWarning,
  ShieldCheck,
  Share2,
  Store,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AdSlot, adSenseSlots } from "../components/AdSense";
import { OfferTrustPanel } from "../components/OfferTrustPanel";
import { PromotionCard } from "../components/PromotionCard";
import { useApp } from "../context/AppContext";
import { daysUntil, formatDate, formatPrice } from "../lib/format";
import { getOfferReportUrl } from "../lib/trust";

export default function PromotionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    promotions,
    favorites,
    toggleFavorite,
    recordView,
    showToast,
    isFeedLoading,
  } = useApp();
  const [copied, setCopied] = useState(false);
  const promotion = promotions.find((item) => item.id === id);

  useEffect(() => {
    if (id && promotion) recordView(id);
  }, [id, promotion, recordView]);

  const similar = useMemo(() => {
    if (!promotion) return [];
    return promotions
      .filter(
        (item) =>
          item.id !== promotion.id &&
          !item.isExpired &&
          (item.category === promotion.category ||
            item.brandId === promotion.brandId),
      )
      .sort((a, b) => {
        const aSameBrand = a.brandId === promotion.brandId ? 1 : 0;
        const bSameBrand = b.brandId === promotion.brandId ? 1 : 0;
        return bSameBrand - aSameBrand || b.discount - a.discount;
      })
      .slice(0, 3);
  }, [promotion, promotions]);

  if (!promotion) {
    if (isFeedLoading) {
      return (
        <main className="page-shell container">
          <div className="empty-state standalone-empty" aria-live="polite">
            <span className="eyebrow">Chargement</span>
            <h1>Vérification de l’offre partenaire…</h1>
          </div>
        </main>
      );
    }

    return (
      <main className="page-shell container">
        <div className="empty-state standalone-empty">
          <span className="eyebrow">Offre introuvable</span>
          <h1>Cette promotion n’existe plus.</h1>
          <p>
            Elle a peut-être expiré, été retirée par l’annonceur ou son
            identifiant est incorrect.
          </p>
          <Link className="button button--dark" to="/">
            Revenir aux promotions
          </Link>
        </div>
      </main>
    );
  }

  const saved = favorites.includes(promotion.id);
  const expired = promotion.isExpired || daysUntil(promotion.expiresAt) < 0;
  const isPartner = promotion.source === "awin";
  const isDemo = promotion.source === "demo";
  const hasPrice = promotion.currentPrice > 0;

  const copyCode = async () => {
    if (!promotion.promoCode) return;
    try {
      await navigator.clipboard.writeText(promotion.promoCode);
    } finally {
      setCopied(true);
      showToast(`Code ${promotion.promoCode} copié`, "success");
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: promotion.title,
          text:
            promotion.discount > 0
              ? `${promotion.brand} à −${promotion.discount}% sur Dealyva`
              : `${promotion.brand} sur Dealyva`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Lien copié dans le presse-papiers", "success");
      }
    } catch {
      // Native share cancellation.
    }
  };

  return (
    <main className="detail-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Fil d’Ariane">
          <Link to="/">Promotions</Link>
          <span>/</span>
          <Link to={`/?categorie=${promotion.category}`}>{promotion.category}</Link>
          <span>/</span>
          <Link to={`/marque/${promotion.brandId}`}>{promotion.brand}</Link>
          <span>/</span>
          <span aria-current="page">{promotion.title}</span>
        </nav>
        <button className="back-link" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>

        <section
          className={`offer-detail ${expired ? "offer-detail--expired" : ""}${
            isPartner ? " offer-detail--partner" : ""
          }${isDemo ? " offer-detail--demo" : ""}`}
        >
          <div className="offer-detail__media">
            <img src={promotion.image} alt={promotion.title} />
            {isDemo && (
              <span className="demo-badge">Démonstration fictive</span>
            )}
            <div className="offer-detail__media-top">
              {promotion.discount > 0 && (
                <span className="discount-badge discount-badge--large">
                  −{promotion.discount}%
                </span>
              )}
              {isPartner && <span className="partner-badge">Offre partenaire</span>}
              {promotion.isNew && !expired && (
                <span className="new-badge">Nouveau</span>
              )}
              {expired && <span className="expired-badge">Offre expirée</span>}
            </div>
          </div>
          <div className="offer-detail__content">
            <div className="offer-detail__eyebrow">
              <span className="brand-label">{promotion.brand}</span>
              <span>chez {promotion.merchant}</span>
            </div>
            <h1>{promotion.title}</h1>
            <p className="offer-detail__description">{promotion.description}</p>
            {hasPrice && (
              <div className="offer-detail__price">
                <strong>{formatPrice(promotion.currentPrice)}</strong>
                <s>{formatPrice(promotion.originalPrice)}</s>
                <span>Vous économisez {formatPrice(promotion.savings)}</span>
              </div>
            )}

            {promotion.promoCode && !expired && (
              <div className="detail-code">
                <div>
                  <Tag size={17} aria-hidden="true" />
                  <span>
                    <small>Code promotionnel</small>
                    <strong>{promotion.promoCode}</strong>
                  </span>
                </div>
                <button type="button" onClick={copyCode}>
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                  {copied ? "Copié" : "Copier"}
                </button>
              </div>
            )}

            <div className="offer-detail__facts">
              <span>
                <CalendarDays size={18} />
                <span>
                  <small>{expired ? "Terminée le" : "Valable jusqu’au"}</small>
                  <strong>{formatDate(promotion.expiresAt)}</strong>
                </span>
              </span>
              <span>
                <Store size={18} />
                <span>
                  <small>Disponibilité</small>
                  <strong>Exclusivement en ligne</strong>
                </span>
              </span>
              <span>
                <ShieldCheck size={18} />
                <span>
                  <small>
                    {isDemo
                      ? "Données de démonstration"
                      : "Dernière synchronisation Awin"}
                  </small>
                  <strong>
                    {isDemo ? "Aucune donnée commerciale" : formatDate(promotion.verifiedAt)}
                  </strong>
                </span>
              </span>
            </div>

            <div className="offer-detail__actions">
              {isPartner && promotion.affiliateUrl && !expired ? (
                <a
                  className="button button--primary button--large"
                  href={promotion.affiliateUrl}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                >
                  Voir l’offre chez {promotion.brand}
                  <ExternalLink size={17} />
                </a>
              ) : isDemo && !expired ? (
                <button
                  type="button"
                  className="button button--primary button--large"
                  onClick={() =>
                    showToast(
                      "Démonstration : aucun achat réel n’est effectué.",
                      "success",
                    )
                  }
                >
                  Tester le bouton (démo)
                  <ExternalLink size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  className="button button--primary button--large"
                  disabled={expired}
                >
                  {expired ? "Cette offre est expirée" : "Lien indisponible"}
                </button>
              )}
              <button
                type="button"
                className={`button button--icon-text ${saved ? "is-active" : ""}`}
                onClick={() => toggleFavorite(promotion.id)}
                aria-pressed={saved}
              >
                <Heart size={19} fill={saved ? "currentColor" : "none"} />
                {saved ? "Sauvegardée" : "Sauvegarder"}
              </button>
              <button
                type="button"
                className="icon-button detail-share"
                onClick={share}
                aria-label="Partager l’offre"
              >
                <Share2 size={19} />
              </button>
            </div>
            <div className="affiliate-callout">
              <Info size={17} />
              <p>
                {isDemo
                  ? "Annonce entièrement fictive créée pour tester le fonctionnement de Dealyva. Aucun marchand, partenariat, produit ou achat réel n’est associé à cette fiche."
                  : "Offre transmise par Awin et vérifiée lors de la dernière synchronisation. Les conditions finales sont celles affichées sur le site du marchand. Ce lien peut rémunérer Dealyva sans modifier votre prix."}
              </p>
            </div>
          </div>
        </section>

        <section className="offer-conditions">
          <div>
            <span className="eyebrow">Bon à savoir</span>
            <h2>Conditions de l’offre</h2>
          </div>
          <ul>
            {promotion.terms.map((term) => (
              <li key={term}>
                <CheckCircle2 size={17} />
                <span>{term}</span>
              </li>
            ))}
          </ul>
          <div className="merchant-note">
            <strong>{isDemo ? "À propos de cette fiche" : "Avant de poursuivre"}</strong>
            <p>
              {isDemo
                ? "Les prix, remises, codes et dates sont simulés. Cette fiche ne permet aucun achat et disparaîtra lorsque les premières offres partenaires seront publiées."
                : "Vérifiez le prix, la disponibilité et toutes les conditions directement sur le site du marchand avant votre achat."}
            </p>
          </div>
        </section>

        <OfferTrustPanel promotion={promotion} />

        {!isDemo && <aside className="offer-report">
          <div>
            <MessageSquareWarning aria-hidden="true" size={19} />
            <span>
              <strong>Une information semble incorrecte ?</strong>
              <small>
                Signalez une offre expirée, un code invalide ou une condition
                manquante.
              </small>
            </span>
          </div>
          <a
            className="button button--outline"
            href={getOfferReportUrl(promotion)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Signaler cette offre
          </a>
        </aside>}

        <AdSlot slot={adSenseSlots.detail} placement="detail" />

        {similar.length > 0 && (
          <section className="similar-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">À découvrir aussi</span>
                <h2>Des offres dans le même esprit.</h2>
              </div>
              <Link to={`/?categorie=${promotion.category}`} className="text-link">
                Tout voir <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="promotion-grid promotion-grid--three">
              {similar.map((item) => (
                <PromotionCard promotion={item} key={item.id} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
