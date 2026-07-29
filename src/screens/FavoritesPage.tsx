import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  BellOff,
  Heart,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DemoBadge } from "../components/DemoBadge";
import { PromotionCard } from "../components/PromotionCard";
import { useApp } from "../context/AppContext";
import type { Promotion } from "../types";

type FavoriteSort =
  | "saved"
  | "discount"
  | "price"
  | "ending"
  | "brand";

const FAVORITE_ALERTS_KEY = "dealyva:favorite-alerts";
const LEGACY_FAVORITE_ALERTS_KEY = "offrely:favorite-alerts";

function loadFavoriteAlerts() {
  if (typeof window === "undefined") return [];

  try {
    const legacyValue = window.localStorage.getItem(LEGACY_FAVORITE_ALERTS_KEY);
    const rawValue =
      window.localStorage.getItem(FAVORITE_ALERTS_KEY) ?? legacyValue ?? "[]";
    const storedValue: unknown = JSON.parse(rawValue);
    if (legacyValue !== null) {
      window.localStorage.setItem(FAVORITE_ALERTS_KEY, rawValue);
      window.localStorage.removeItem(LEGACY_FAVORITE_ALERTS_KEY);
    }
    return Array.isArray(storedValue)
      ? storedValue.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function isExpired(promotion: Promotion) {
  return (
    promotion.isExpired === true ||
    new Date(promotion.expiresAt).getTime() < Date.now()
  );
}

export default function FavoritesPage() {
  const { promotions, favorites, toggleFavorite, showToast } = useApp();
  const [sort, setSort] = useState<FavoriteSort>("saved");
  const [favoriteAlerts, setFavoriteAlerts] =
    useState<string[]>(loadFavoriteAlerts);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        FAVORITE_ALERTS_KEY,
        JSON.stringify(favoriteAlerts),
      );
    } catch {
      // The page remains usable when local storage is unavailable.
    }
  }, [favoriteAlerts]);

  const savedPromotions = useMemo(() => {
    const favoriteOrder = new Map(
      favorites.map((promotionId, index) => [promotionId, index]),
    );
    const result = promotions.filter((promotion) =>
      favoriteOrder.has(promotion.id),
    );

    return [...result].sort((first, second) => {
      switch (sort) {
        case "discount":
          return second.discount - first.discount;
        case "price":
          return first.currentPrice - second.currentPrice;
        case "ending":
          return (
            new Date(first.expiresAt).getTime() -
            new Date(second.expiresAt).getTime()
          );
        case "brand":
          return first.brand.localeCompare(second.brand, "fr", {
            sensitivity: "base",
          });
        default:
          return (
            (favoriteOrder.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
            (favoriteOrder.get(second.id) ?? Number.MAX_SAFE_INTEGER)
          );
      }
    });
  }, [favorites, promotions, sort]);

  const activePromotions = savedPromotions.filter(
    (promotion) => !isExpired(promotion),
  );
  const expiredPromotions = savedPromotions.filter(isExpired);
  const activeAlertCount = favoriteAlerts.filter((id) =>
    favorites.includes(id),
  ).length;

  const toggleAlert = (promotion: Promotion) => {
    const alertIsActive = favoriteAlerts.includes(promotion.id);
    setFavoriteAlerts((current) =>
      alertIsActive
        ? current.filter((id) => id !== promotion.id)
        : [...current, promotion.id],
    );
    showToast(
      alertIsActive
        ? `Alerte désactivée pour ${promotion.brand}`
        : `Alerte fictive activée pour ${promotion.brand}`,
      alertIsActive ? "default" : "success",
    );
  };

  const removeFavorite = (promotion: Promotion) => {
    setFavoriteAlerts((current) =>
      current.filter((id) => id !== promotion.id),
    );
    toggleFavorite(promotion.id);
  };

  const renderFavorite = (promotion: Promotion) => {
    const alertIsActive = favoriteAlerts.includes(promotion.id);

    return (
      <div className="favorite-item" key={promotion.id}>
        <div className="favorite-item__controls">
          <button
            type="button"
            className={`favorite-alert-button${alertIsActive ? " is-active" : ""}`}
            onClick={() => toggleAlert(promotion)}
            aria-pressed={alertIsActive}
          >
            {alertIsActive ? (
              <Bell size={16} aria-hidden="true" />
            ) : (
              <BellOff size={16} aria-hidden="true" />
            )}
            {alertIsActive ? "Alerte active" : "Créer une alerte"}
          </button>
          <button
            type="button"
            className="favorite-remove-button"
            onClick={() => removeFavorite(promotion)}
            aria-label={`Retirer ${promotion.title} des favoris`}
          >
            <Trash2 size={16} aria-hidden="true" />
            Retirer
          </button>
        </div>
        <PromotionCard promotion={promotion} />
      </div>
    );
  };

  return (
    <main className="page-shell account-page favorites-page">
      <section className="account-hero" aria-labelledby="favorites-title">
        <div>
          <p className="eyebrow">
            <Heart size={16} aria-hidden="true" />
            Votre sélection
          </p>
          <h1 id="favorites-title">Mes favoris</h1>
          <p>
            Retrouvez vos offres sauvegardées, organisez-les et activez une
            alerte de démonstration pour ne pas laisser passer une baisse de
            prix.
          </p>
        </div>
        <div className="account-hero__aside">
          <DemoBadge />
          <span>
            <strong>{activeAlertCount}</strong> alerte
            {activeAlertCount > 1 ? "s" : ""} active
            {activeAlertCount > 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {savedPromotions.length === 0 ? (
        <section className="empty-state favorites-empty" aria-live="polite">
          <span className="empty-state__icon">
            <Heart size={28} aria-hidden="true" />
          </span>
          <p className="eyebrow">Votre sélection est vide</p>
          <h2>Gardez vos plus belles trouvailles sous la main.</h2>
          <p>
            Ajoutez une offre en favori depuis le catalogue. Elle apparaîtra
            ici, même après avoir fermé votre navigateur.
          </p>
          <Link className="button button--primary" to="/">
            <Search size={17} aria-hidden="true" />
            Découvrir les promotions
          </Link>
        </section>
      ) : (
        <>
          <section
            className="favorites-toolbar"
            aria-label="Organisation des favoris"
          >
            <p aria-live="polite">
              <strong>{savedPromotions.length}</strong> offre
              {savedPromotions.length > 1 ? "s" : ""} sauvegardée
              {savedPromotions.length > 1 ? "s" : ""}
            </p>
            <label className="select-field" htmlFor="favorites-sort">
              <SlidersHorizontal size={17} aria-hidden="true" />
              <span>Trier par</span>
              <select
                id="favorites-sort"
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as FavoriteSort)
                }
              >
                <option value="saved">Ajout le plus récent</option>
                <option value="discount">Meilleure réduction</option>
                <option value="price">Prix le plus bas</option>
                <option value="ending">Fin imminente</option>
                <option value="brand">Marque, de A à Z</option>
              </select>
            </label>
          </section>

          <section
            className="favorites-section"
            aria-labelledby="active-favorites-title"
          >
            <div className="section-heading section-heading--inline">
              <div>
                <p className="eyebrow">À saisir maintenant</p>
                <h2 id="active-favorites-title">
                  Offres en cours
                  <span className="heading-count">{activePromotions.length}</span>
                </h2>
              </div>
              <p>
                Les prix et disponibilités sont fictifs dans cette
                démonstration.
              </p>
            </div>
            {activePromotions.length > 0 ? (
              <div className="promotion-grid favorites-grid">
                {activePromotions.map(renderFavorite)}
              </div>
            ) : (
              <div className="inline-empty-state">
                <BellOff size={20} aria-hidden="true" />
                <p>Aucune de vos offres sauvegardées n’est encore active.</p>
              </div>
            )}
          </section>

          {expiredPromotions.length > 0 && (
            <section
              className="favorites-section favorites-section--expired"
              aria-labelledby="expired-favorites-title"
            >
              <div className="section-heading section-heading--inline">
                <div>
                  <p className="eyebrow">Archives</p>
                  <h2 id="expired-favorites-title">
                    Offres expirées
                    <span className="heading-count">
                      {expiredPromotions.length}
                    </span>
                  </h2>
                </div>
                <p>
                  Conservez-les pour référence ou retirez-les de votre
                  sélection.
                </p>
              </div>
              <div className="promotion-grid favorites-grid">
                {expiredPromotions.map(renderFavorite)}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
