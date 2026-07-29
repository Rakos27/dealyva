import {
  ArrowLeft,
  BadgeCheck,
  BellPlus,
  Check,
  RefreshCw,
  ShieldCheck,
  Store,
} from "lucide-react";
import { useMemo, type CSSProperties } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatedNumber } from "../components/AnimatedNumber";
import { PromotionCard } from "../components/PromotionCard";
import { useApp } from "../context/AppContext";
import { formatRelativeTime } from "../lib/format";

export default function BrandDetailPage() {
  const { brandId } = useParams();
  const {
    brands,
    categories,
    promotions,
    selectedBrands,
    toggleBrand,
    lastUpdated,
    isFeedLoading,
  } = useApp();
  const brand = brands.find((item) => item.id === brandId);
  const offers = useMemo(
    () =>
      promotions
        .filter((item) => item.brandId === brandId && !item.isExpired)
        .sort(
          (first, second) =>
            Number(Boolean(second.isNew)) - Number(Boolean(first.isNew)) ||
            second.discount - first.discount,
        ),
    [brandId, promotions],
  );

  if (!brand) {
    return (
      <main className="page-shell container">
        <div className="empty-state standalone-empty">
          <span className="eyebrow">
            {isFeedLoading ? "Chargement" : "Marque introuvable"}
          </span>
          <h1>
            {isFeedLoading
              ? "Chargement de la marque…"
              : "Cette marque n’est pas dans le catalogue."}
          </h1>
          {!isFeedLoading && (
            <>
              <p>
                Son partenariat est peut-être terminé ou aucune offre n’est
                disponible actuellement.
              </p>
              <Link className="button button--dark" to="/marques">
                Voir toutes les marques
              </Link>
            </>
          )}
        </div>
      </main>
    );
  }

  const category = categories.find((item) => item.id === brand.category);
  const selected = selectedBrands.includes(brand.id);
  const otherBrands = brands
    .filter(
      (item) => item.id !== brand.id && item.category === brand.category,
    )
    .slice(0, 4);

  return (
    <main
      className="page-shell brand-detail-page"
      style={{ "--brand-tone": brand.tone } as CSSProperties}
    >
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/">Promotions</Link>
        <span>/</span>
        <Link to="/marques">Marques</Link>
        <span>/</span>
        <span aria-current="page">{brand.name}</span>
      </nav>

      <Link className="back-link" to="/marques">
        <ArrowLeft aria-hidden="true" size={16} />
        Toutes les marques
      </Link>

      <header className="brand-detail-hero">
        <span className="brand-detail-hero__mark" aria-hidden="true">
          {brand.initials}
        </span>
        <div>
          <p className="eyebrow">
            <BadgeCheck aria-hidden="true" size={16} />
            Annonceur partenaire
          </p>
          <h1>Promotions {brand.name}</h1>
          <p>
            Retrouvez les offres {brand.name} actuellement transmises par le
            réseau partenaire. Vérifiez toujours les conditions finales sur le
            site du marchand.
          </p>
        </div>
        <button
          className={`button ${selected ? "button--secondary" : "button--dark"}`}
          type="button"
          onClick={() => toggleBrand(brand.id)}
          aria-pressed={selected}
        >
          {selected ? <Check size={17} /> : <BellPlus size={17} />}
          {selected ? "Marque suivie" : "Suivre cette marque"}
        </button>
      </header>

      <dl className="brand-detail-stats">
        <div>
          <dt>Offres actives</dt>
          <dd><AnimatedNumber value={offers.length} /></dd>
        </div>
        <div>
          <dt>Catégorie</dt>
          <dd>{category?.name ?? "Autres"}</dd>
        </div>
        <div>
          <dt>Dernière mise à jour</dt>
          <dd>{formatRelativeTime(lastUpdated)}</dd>
        </div>
      </dl>

      <section className="brand-trust-strip" aria-label="Méthode de vérification">
        <span>
          <RefreshCw aria-hidden="true" size={18} />
          Synchronisation régulière
        </span>
        <span>
          <ShieldCheck aria-hidden="true" size={18} />
          Source partenaire identifiée
        </span>
        <span>
          <Store aria-hidden="true" size={18} />
          Achat effectué chez le marchand
        </span>
      </section>

      <section className="brand-detail-offers" aria-labelledby="brand-offers-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catalogue en cours</p>
            <h2 id="brand-offers-title">
              {offers.length > 0
                ? `${offers.length} offre${offers.length > 1 ? "s" : ""} à découvrir`
                : "Aucune offre active pour le moment"}
            </h2>
          </div>
        </div>
        {offers.length > 0 ? (
          <div className="promotion-grid promotion-grid--three">
            {offers.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Store aria-hidden="true" size={32} />
            <h3>Le flux {brand.name} est actuellement vide</h3>
            <p>
              Suivez la marque pour la retrouver facilement lorsqu’une nouvelle
              promotion sera disponible.
            </p>
          </div>
        )}
      </section>

      {otherBrands.length > 0 && (
        <section className="related-brands" aria-labelledby="related-brands-title">
          <p className="eyebrow">Même catégorie</p>
          <h2 id="related-brands-title">D’autres marques à explorer</h2>
          <div>
            {otherBrands.map((item) => (
              <Link key={item.id} to={`/marque/${item.id}`}>
                <span
                  className="brand-mark"
                  style={{ "--brand-tone": item.tone } as CSSProperties}
                >
                  {item.initials}
                </span>
                <strong>{item.name}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
