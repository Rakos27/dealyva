import { useMemo, useState } from "react";
import {
  Heart,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PromotionCard } from "../components/PromotionCard";
import { useApp } from "../context/AppContext";
import type { Promotion } from "../types";

type FavoriteSort =
  | "saved"
  | "discount"
  | "price"
  | "ending"
  | "brand";

function isExpired(promotion: Promotion) {
  return (
    promotion.isExpired === true ||
    new Date(promotion.expiresAt).getTime() < Date.now()
  );
}

export default function FavoritesPage() {
  const { promotions, favorites, toggleFavorite } = useApp();
  const [sort, setSort] = useState<FavoriteSort>("saved");

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
  const removeFavorite = (promotion: Promotion) => {
    toggleFavorite(promotion.id);
  };

  const renderFavorite = (promotion: Promotion) => {
    return (
      <div className="favorite-item" key={promotion.id}>
        <div className="favorite-item__controls">
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
            Retrouvez et organisez les offres partenaires que vous avez
            sauvegardées.
          </p>
        </div>
        <div className="account-hero__aside">
          <span>
            <strong>{savedPromotions.length}</strong> offre
            {savedPromotions.length !== 1 ? "s" : ""} sauvegardée
            {savedPromotions.length !== 1 ? "s" : ""}
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
                Vérifiez toujours le prix et la disponibilité sur le site du
                marchand.
              </p>
            </div>
            {activePromotions.length > 0 ? (
              <div className="promotion-grid favorites-grid">
                {activePromotions.map(renderFavorite)}
              </div>
            ) : (
              <div className="inline-empty-state">
                <Heart size={20} aria-hidden="true" />
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
