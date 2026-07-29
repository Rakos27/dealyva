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
  ShieldCheck,
  Share2,
  Store,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DemoBadge } from "../components/DemoBadge";
import { PromotionCard } from "../components/PromotionCard";
import { useApp } from "../context/AppContext";
import { daysUntil, formatDate, formatPrice } from "../lib/format";

export default function PromotionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    promotions,
    favorites,
    toggleFavorite,
    recordView,
    showToast,
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
    return (
      <main className="page-shell container">
        <div className="empty-state standalone-empty">
          <span className="eyebrow">Offre introuvable</span>
          <h1>Cette promotion n’existe plus.</h1>
          <p>
            Elle a peut-être été retirée de la démonstration ou son identifiant est
            incorrect.
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
          text: `${promotion.brand} à −${promotion.discount}% sur Offrely`,
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
          <span aria-current="page">{promotion.brand}</span>
        </nav>
        <button className="back-link" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Retour
        </button>

        <section
          className={`offer-detail ${expired ? "offer-detail--expired" : ""}`}
        >
          <div className="offer-detail__media">
            <img src={promotion.image} alt={promotion.title} />
            <div className="offer-detail__media-top">
              <span className="discount-badge discount-badge--large">
                −{promotion.discount}%
              </span>
              {promotion.isNew && !expired && (
                <span className="new-badge">Nouveau</span>
              )}
              {expired && <span className="expired-badge">Offre expirée</span>}
            </div>
            <DemoBadge />
          </div>
          <div className="offer-detail__content">
            <div className="offer-detail__eyebrow">
              <span className="brand-label">{promotion.brand}</span>
              <span>chez {promotion.merchant}</span>
            </div>
            <h1>{promotion.title}</h1>
            <p className="offer-detail__description">{promotion.description}</p>
            <div className="offer-detail__price">
              <strong>{formatPrice(promotion.currentPrice)}</strong>
              <s>{formatPrice(promotion.originalPrice)}</s>
              <span>Vous économisez {formatPrice(promotion.savings)}</span>
            </div>

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
                  <small>Dernière vérification simulée</small>
                  <strong>{formatDate(promotion.verifiedAt)}</strong>
                </span>
              </span>
            </div>

            <div className="offer-detail__actions">
              <button
                type="button"
                className="button button--primary button--large"
                disabled={expired}
                onClick={() =>
                  showToast(
                    "Lien marchand désactivé dans cette démonstration",
                    "default",
                  )
                }
              >
                {expired ? "Cette offre est expirée" : "Voir l’offre"}
                {!expired && <ExternalLink size={17} />}
              </button>
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
            <div className="demo-callout">
              <Info size={17} />
              <p>
                Cette promotion est entièrement fictive et sert à présenter
                l’expérience Offrely. Aucun achat n’est possible depuis ce prototype.
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
            <strong>Une information semble incorrecte ?</strong>
            <p>
              Dans la future version, vous pourrez nous signaler une offre expirée
              ou une condition manquante.
            </p>
            <button
              type="button"
              className="text-link"
              onClick={() => showToast("Merci, signalement fictif enregistré")}
            >
              Signaler cette offre <ArrowUpRight size={14} />
            </button>
          </div>
        </section>

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
