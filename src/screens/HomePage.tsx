import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  WifiOff,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ActiveFilters } from "../components/ActiveFilters";
import { BrandSelector } from "../components/BrandSelector";
import { FilterPanel } from "../components/FilterPanel";
import { PromotionCard } from "../components/PromotionCard";
import { PromotionSkeleton } from "../components/PromotionSkeleton";
import { useApp } from "../context/AppContext";
import { getActiveFilterCount } from "../lib/filters";
import { daysUntil, formatPrice, formatRelativeTime } from "../lib/format";
import type { Promotion, PromotionFilters, SortOption } from "../types";

const defaultFilters: PromotionFilters = {
  query: "",
  categories: [],
  brands: [],
  minPrice: null,
  maxPrice: null,
  minDiscount: 0,
  codeMode: "all",
  endingSoon: false,
  newOnly: false,
  onlineOnly: true,
  selectedBrandsOnly: false,
  sort: "recommended",
};

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommandées" },
  { value: "recent", label: "Plus récentes" },
  { value: "discount", label: "Réduction la plus importante" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "ending", label: "Fin imminente" },
];

function matchesSearch(promotion: Promotion, query: string) {
  const haystack = [
    promotion.title,
    promotion.brand,
    promotion.merchant,
    promotion.description,
    ...promotion.tags,
  ]
    .join(" ")
    .toLocaleLowerCase("fr");
  return haystack.includes(query.trim().toLocaleLowerCase("fr"));
}

export default function HomePage() {
  const {
    promotions,
    selectedBrands,
    favorites,
    recentlyViewed,
    dismissedRecommendations,
    dismissRecommendation,
    lastUpdated,
    isRefreshing,
    refreshOffers,
  } = useApp();
  const [pageTime] = useState(Date.now);
  const [filters, setFilters] = useState<PromotionFilters>(() => {
    const brandParam = new URLSearchParams(window.location.search).get("marque");
    const categoryParam = new URLSearchParams(window.location.search).get(
      "categorie",
    );
    return {
      ...defaultFilters,
      brands: brandParam ? brandParam.split(",").filter(Boolean) : [],
      categories: categoryParam
        ? (categoryParam.split(",").filter(Boolean) as PromotionFilters["categories"])
        : [],
    };
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setInitialLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  const livePromotions = useMemo(
    () =>
      promotions.filter(
        (promotion) =>
          !promotion.isExpired &&
          new Date(promotion.expiresAt).getTime() >= pageTime,
      ),
    [pageTime, promotions],
  );

  const filteredPromotions = useMemo(() => {
    const result = livePromotions.filter((promotion) => {
      if (filters.query && !matchesSearch(promotion, filters.query)) return false;
      if (
        filters.categories.length &&
        !filters.categories.includes(promotion.category)
      )
        return false;
      if (filters.brands.length && !filters.brands.includes(promotion.brandId))
        return false;
      if (
        filters.selectedBrandsOnly &&
        (!selectedBrands.length || !selectedBrands.includes(promotion.brandId))
      )
        return false;
      if (filters.minPrice !== null && promotion.currentPrice < filters.minPrice)
        return false;
      if (filters.maxPrice !== null && promotion.currentPrice > filters.maxPrice)
        return false;
      if (promotion.discount < filters.minDiscount) return false;
      if (filters.codeMode === "with-code" && !promotion.promoCode) return false;
      if (filters.codeMode === "without-code" && promotion.promoCode) return false;
      if (filters.endingSoon && daysUntil(promotion.expiresAt) > 4) return false;
      if (filters.newOnly && !promotion.isNew) return false;
      if (filters.onlineOnly && !promotion.onlineOnly) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      switch (filters.sort) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "discount":
          return b.discount - a.discount;
        case "price-asc":
          return a.currentPrice - b.currentPrice;
        case "price-desc":
          return b.currentPrice - a.currentPrice;
        case "ending":
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
        default: {
          const score = (promotion: Promotion) =>
            (selectedBrands.includes(promotion.brandId) ? 100 : 0) +
            (favorites.includes(promotion.id) ? 30 : 0) +
            promotion.discount +
            (promotion.isNew ? 12 : 0);
          return score(b) - score(a);
        }
      }
    });
  }, [favorites, filters, livePromotions, selectedBrands]);

  const recommendations = useMemo(() => {
    const viewedCategories = recentlyViewed
      .map((id) => promotions.find((promotion) => promotion.id === id)?.category)
      .filter(Boolean);
    const favoritePromotions = promotions.filter((promotion) =>
      favorites.includes(promotion.id),
    );
    const averageFavoritePrice = favoritePromotions.length
      ? favoritePromotions.reduce((sum, promotion) => sum + promotion.currentPrice, 0) /
        favoritePromotions.length
      : null;

    return livePromotions
      .filter(
        (promotion) =>
          !favorites.includes(promotion.id) &&
          !dismissedRecommendations.includes(promotion.id),
      )
      .map((promotion) => {
        let score = promotion.discount;
        let reason = "Populaire dans vos catégories";
        if (selectedBrands.includes(promotion.brandId)) {
          score += 90;
          reason = `Parce que vous aimez ${promotion.brand}`;
        } else if (
          favoritePromotions.some(
            (favorite) => favorite.category === promotion.category,
          )
        ) {
          score += 60;
          reason = "Similaire à une offre sauvegardée";
        } else if (viewedCategories.includes(promotion.category)) {
          score += 45;
          reason = "Inspirée de vos consultations récentes";
        } else if (
          averageFavoritePrice &&
          Math.abs(promotion.currentPrice - averageFavoritePrice) <
            averageFavoritePrice * 0.35
        ) {
          score += 25;
          reason = "Dans votre fourchette de prix habituelle";
        }
        return { promotion, reason, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [
    dismissedRecommendations,
    favorites,
    livePromotions,
    promotions,
    recentlyViewed,
    selectedBrands,
  ]);

  const heroDeal =
    livePromotions.find((promotion) => promotion.isNew) ?? livePromotions[0];

  const handleRefresh = async () => {
    setError("");
    try {
      await refreshOffers();
    } catch {
      setError("Le flux de démonstration n’a pas pu être actualisé.");
    }
  };

  const resetFilters = () => {
    setFilters({ ...defaultFilters });
    setVisibleCount(12);
  };

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__grid">
          <div className="home-hero__content">
            <span className="eyebrow">
              <span className="live-dot" /> Votre sélection, au meilleur prix
            </span>
            <h1>
              Les meilleurs deals,
              <br />
              <em>partout.</em>
            </h1>
            <p>
              Dealyva rassemble les meilleures promotions en ligne, partout.
              Un flux simple, clair et personnalisé.
            </p>
            <label className="hero-search">
              <Search size={21} aria-hidden="true" />
              <span className="sr-only">Rechercher une offre</span>
              <input
                value={filters.query}
                onChange={(event) =>
                  setFilters({ ...filters, query: event.target.value })
                }
                placeholder="Une marque, un produit, une envie…"
              />
              {filters.query && (
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, query: "" })}
                  aria-label="Effacer la recherche"
                >
                  <X size={17} />
                </button>
              )}
              <button type="button" className="hero-search__submit">
                Rechercher
              </button>
            </label>
            <div className="home-hero__actions">
              <BrandSelector
                large
                selectedOnly={filters.selectedBrandsOnly}
                onSelectedOnlyChange={(selectedBrandsOnly) =>
                  setFilters({ ...filters, selectedBrandsOnly })
                }
              />
              <span>
                <CheckCircle2 size={16} />
                Gratuit, indépendant et transparent
              </span>
            </div>
            <div className="last-update">
              <span>
                Dernière actualisation {formatRelativeTime(lastUpdated)}
              </span>
              <button type="button" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw
                  size={14}
                  className={isRefreshing ? "is-spinning" : ""}
                  aria-hidden="true"
                />
                {isRefreshing ? "Actualisation…" : "Actualiser les offres"}
              </button>
            </div>
          </div>
          {heroDeal && (
            <Link to={`/offre/${heroDeal.id}`} className="hero-deal">
              <img src={heroDeal.image} alt="" />
              <div className="hero-deal__shade" />
              <div className="hero-deal__top">
                <span>La trouvaille du moment</span>
                <span className="discount-badge">−{heroDeal.discount}%</span>
              </div>
              <div className="hero-deal__content">
                <span>
                  {heroDeal.brand} · {heroDeal.merchant}
                </span>
                <h2>{heroDeal.title}</h2>
                <div>
                  <strong>{formatPrice(heroDeal.currentPrice)}</strong>
                  <s>{formatPrice(heroDeal.originalPrice)}</s>
                  <span className="hero-deal__arrow">
                    <ArrowRight size={20} />
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      <main>
        <section className="promotions-section" id="promotions">
          <div className="container">
            <div className="section-heading section-heading--results">
              <div>
                <span className="eyebrow">Promotions sélectionnées</span>
                <h2>Les offres qui valent le détour.</h2>
                <p>
                  {initialLoading
                    ? "Recherche des meilleures opportunités…"
                    : `${filteredPromotions.length} offre${filteredPromotions.length > 1 ? "s" : ""} active${filteredPromotions.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <div className="results-controls">
                <button
                  type="button"
                  className="button button--outline mobile-filter-trigger"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal size={16} />
                  Filtres
                  {getActiveFilterCount(filters) > 0 && (
                    <span>{getActiveFilterCount(filters)}</span>
                  )}
                </button>
                <label className="sort-select">
                  <span>Trier par</span>
                  <select
                    value={filters.sort}
                    onChange={(event) =>
                      setFilters({
                        ...filters,
                        sort: event.target.value as SortOption,
                      })
                    }
                  >
                    {sortOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} aria-hidden="true" />
                </label>
              </div>
            </div>
            <ActiveFilters filters={filters} onChange={setFilters} />

            {error && (
              <div className="status-panel status-panel--error" role="alert">
                <span>
                  <WifiOff size={22} />
                </span>
                <div>
                  <strong>Impossible d’actualiser les offres</strong>
                  <p>{error} Vos résultats actuels restent disponibles.</p>
                </div>
                <button type="button" className="button button--outline" onClick={handleRefresh}>
                  Réessayer
                </button>
              </div>
            )}

            <div className="catalog-layout">
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={resetFilters}
                mobileOpen={filtersOpen}
                onMobileClose={() => setFiltersOpen(false)}
              />
              <div className="catalog-results">
                {initialLoading ? (
                  <div
                    className="promotion-grid"
                    aria-label="Chargement des promotions"
                    aria-busy="true"
                  >
                    {Array.from({ length: 6 }, (_, index) => (
                      <PromotionSkeleton key={index} />
                    ))}
                  </div>
                ) : filteredPromotions.length ? (
                  <>
                    <div className="promotion-grid">
                      {filteredPromotions.slice(0, visibleCount).map((promotion) => (
                        <PromotionCard key={promotion.id} promotion={promotion} />
                      ))}
                    </div>
                    {visibleCount < filteredPromotions.length && (
                      <button
                        type="button"
                        className="button button--outline load-more"
                        onClick={() => setVisibleCount((count) => count + 12)}
                      >
                        Afficher plus d’offres
                        <span>
                          {filteredPromotions.length - visibleCount} restantes
                        </span>
                      </button>
                    )}
                  </>
                ) : (
                  <div className="empty-state">
                    <span className="empty-state__icon">
                      <Search size={27} />
                    </span>
                    <span className="eyebrow">Aucun résultat</span>
                    <h3>Cette sélection est un peu trop précise.</h3>
                    <p>
                      Élargissez votre recherche ou réinitialisez les filtres pour
                      retrouver les offres du catalogue.
                    </p>
                    <button
                      type="button"
                      className="button button--dark"
                      onClick={resetFilters}
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="recommendations-section">
          <div className="container">
            <div className="recommendations-section__intro">
              <span className="sparkle-icon">
                <Sparkles size={20} />
              </span>
              <span className="eyebrow">Sélection personnalisée</span>
              <h2>Ces offres pourraient vous plaire.</h2>
              <p>
                Votre sélection évolue avec les marques, catégories et produits que
                vous consultez. Tout reste dans votre navigateur.
              </p>
            </div>
            <div className="recommendations-grid">
              {recommendations.map(({ promotion, reason }) => (
                <div className="recommendation-item" key={promotion.id}>
                  <PromotionCard promotion={promotion} reason={reason} compact />
                  <button
                    type="button"
                    className="not-interested"
                    onClick={() => dismissRecommendation(promotion.id)}
                  >
                    Cela ne m’intéresse pas
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="transparency-strip">
          <div className="container transparency-strip__inner">
            <div>
              <Clock3 size={20} />
              <span>
                <strong>Des offres partenaires ou de démonstration, toujours identifiées.</strong>
                <small>
                  Les liens d’affiliation et les données fictives sont signalés
                  clairement.
                </small>
              </span>
            </div>
            <Link to="/mentions-legales" className="text-link">
              En savoir plus <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
