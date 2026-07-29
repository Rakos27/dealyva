import { useMemo, type CSSProperties } from "react";
import {
  ArrowRight,
  Layers3,
  Sparkles,
  Store,
  Tags,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function CategoriesPage() {
  const { brands, categories, promotions } = useApp();

  const categoryStats = useMemo(
    () =>
      new Map(
        categories.map((category) => {
          const categoryPromotions = promotions.filter(
            (promotion) =>
              promotion.category === category.id && !promotion.isExpired,
          );
          const categoryBrandIds = new Set(
            brands
              .filter((brand) => brand.category === category.id)
              .map((brand) => brand.id),
          );
          const bestDiscount = categoryPromotions.reduce(
            (best, promotion) => Math.max(best, promotion.discount),
            0,
          );

          return [
            category.id,
            {
              offerCount: categoryPromotions.length,
              brandCount: categoryBrandIds.size,
              bestDiscount,
            },
          ];
        }),
      ),
    [brands, categories, promotions],
  );

  const activePromotions = promotions.filter(
    (promotion) => !promotion.isExpired,
  );
  const representedCategories = categories.filter(
    (category) => (categoryStats.get(category.id)?.offerCount ?? 0) > 0,
  ).length;

  return (
    <main className="page-shell catalog-page categories-page">
      <section className="catalog-hero" aria-labelledby="categories-title">
        <div className="catalog-hero__content">
          <p className="eyebrow">
            <Sparkles aria-hidden="true" size={16} />
            Explorer autrement
          </p>
          <h1 id="categories-title">Une envie, une catégorie.</h1>
          <p className="catalog-hero__intro">
            Parcourez les univers Offrely et accédez directement aux
            réductions qui correspondent à vos projets du moment.
          </p>
        </div>

        <dl className="catalog-hero__stats" aria-label="Aperçu des catégories">
          <div>
            <dt>Univers</dt>
            <dd>{categories.length}</dd>
          </div>
          <div>
            <dt>Univers avec des offres</dt>
            <dd>{representedCategories}</dd>
          </div>
          <div>
            <dt>Offres en cours</dt>
            <dd>{activePromotions.length}</dd>
          </div>
        </dl>
      </section>

      <section
        className="catalog-results"
        aria-labelledby="category-results-title"
      >
        <div className="section-heading section-heading--inline">
          <div>
            <p className="eyebrow">Tous les univers</p>
            <h2 id="category-results-title">Explorez le catalogue</h2>
          </div>
          <p>
            Des sélections fictives, pensées pour illustrer toute la richesse
            du futur service.
          </p>
        </div>

        <div className="category-catalog-grid">
          {categories.map((category, index) => {
            const stats = categoryStats.get(category.id);

            return (
              <article
                className={`category-catalog-card${
                  index === 0 || index === 5
                    ? " category-catalog-card--featured"
                    : ""
                }`}
                key={category.id}
                style={
                  { "--category-accent": category.accent } as CSSProperties
                }
              >
                <div className="category-catalog-card__visual">
                  <img
                    src={category.image}
                    alt=""
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                  <span className="category-catalog-card__eyebrow">
                    {category.eyebrow}
                  </span>
                </div>

                <div className="category-catalog-card__content">
                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                  </div>

                  <dl
                    className="category-catalog-card__stats"
                    aria-label={`Chiffres clés pour ${category.name}`}
                  >
                    <div>
                      <dt>
                        <Tags aria-hidden="true" size={15} />
                        Offres
                      </dt>
                      <dd>{stats?.offerCount ?? 0}</dd>
                    </div>
                    <div>
                      <dt>
                        <Store aria-hidden="true" size={15} />
                        Marques
                      </dt>
                      <dd>{stats?.brandCount ?? 0}</dd>
                    </div>
                    <div>
                      <dt>
                        <Layers3 aria-hidden="true" size={15} />
                        Jusqu’à
                      </dt>
                      <dd>
                        {stats?.bestDiscount
                          ? `−${stats.bestDiscount} %`
                          : "Bientôt"}
                      </dd>
                    </div>
                  </dl>

                  <Link
                    className="button button--category"
                    to={`/?categorie=${category.id}`}
                  >
                    Explorer {category.name.toLocaleLowerCase("fr")}
                    <ArrowRight aria-hidden="true" size={17} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="catalog-note" aria-label="Information">
        <Sparkles aria-hidden="true" size={20} />
        <div>
          <h2>Un catalogue vivant, présenté en démonstration</h2>
          <p>
            Les offres, réductions et disponibilités de cette version sont
            fictives. Elles illustrent le fonctionnement d’Offrely avant la
            connexion de flux marchands réels.
          </p>
        </div>
        <Link className="text-link" to="/">
          Voir toutes les promotions
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </aside>
    </main>
  );
}

export default CategoriesPage;
