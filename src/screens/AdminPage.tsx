import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Edit3,
  Eye,
  LayoutDashboard,
  Layers3,
  Plus,
  Search,
  ShieldCheck,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DemoBadge } from "../components/DemoBadge";
import { Logo } from "../components/Logo";
import { useApp } from "../context/AppContext";
import { formatDate, formatPrice } from "../lib/format";
import type {
  AdminPromotionDraft,
  Brand,
  Category,
  CategoryId,
  Promotion,
} from "../types";

type AdminTab = "dashboard" | "promotions" | "brands" | "categories";

const tabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Vue d’ensemble", icon: LayoutDashboard },
  { id: "promotions", label: "Promotions", icon: Tag },
  { id: "brands", label: "Marques", icon: Store },
  { id: "categories", label: "Catégories", icon: Layers3 },
];

const today = new Date();
const defaultExpiry = new Date(today.getTime() + 14 * 86_400_000)
  .toISOString()
  .slice(0, 10);

const emptyDraft: AdminPromotionDraft = {
  title: "",
  brandId: "",
  merchant: "",
  category: "mode",
  originalPrice: 100,
  currentPrice: 75,
  promoCode: "",
  expiresAt: defaultExpiry,
};

export default function AdminPage() {
  const {
    promotions,
    brands,
    categories,
    favorites,
    addPromotion,
    updatePromotion,
    deletePromotion,
    expirePromotion,
    addBrand,
    deleteBrand,
    updateCategory,
    showToast,
  } = useApp();
  const [pageTime] = useState(Date.now);
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [search, setSearch] = useState("");
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [draft, setDraft] = useState<AdminPromotionDraft>(emptyDraft);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [brandDraft, setBrandDraft] = useState({
    name: "",
    category: "mode" as CategoryId,
    initials: "",
    tone: "#252525",
  });

  const livePromotions = promotions.filter(
    (promotion) =>
      !promotion.isExpired &&
      new Date(promotion.expiresAt).getTime() >= pageTime,
  );
  const expiredPromotions = promotions.length - livePromotions.length;
  const averageDiscount = livePromotions.length
    ? Math.round(
        livePromotions.reduce((sum, promotion) => sum + promotion.discount, 0) /
          livePromotions.length,
      )
    : 0;
  const totalSavings = livePromotions.reduce(
    (sum, promotion) => sum + promotion.savings,
    0,
  );

  const filteredPromotions = useMemo(() => {
    const query = search.toLocaleLowerCase("fr").trim();
    return promotions
      .filter((promotion) =>
        [promotion.title, promotion.brand, promotion.merchant]
          .join(" ")
          .toLocaleLowerCase("fr")
          .includes(query),
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [promotions, search]);

  const filteredBrands = useMemo(() => {
    const query = search.toLocaleLowerCase("fr").trim();
    return brands
      .filter((brand) => brand.name.toLocaleLowerCase("fr").includes(query))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [brands, search]);

  const openCreatePromotion = () => {
    setEditingPromotion(null);
    setDraft({
      ...emptyDraft,
      brandId: brands[0]?.id ?? "",
      category: brands[0]?.category ?? "mode",
    });
    setPromotionModalOpen(true);
  };

  const openEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setDraft({
      title: promotion.title,
      brandId: promotion.brandId,
      merchant: promotion.merchant,
      category: promotion.category,
      originalPrice: promotion.originalPrice,
      currentPrice: promotion.currentPrice,
      promoCode: promotion.promoCode ?? "",
      expiresAt: promotion.expiresAt.slice(0, 10),
    });
    setPromotionModalOpen(true);
  };

  const savePromotion = (event: FormEvent) => {
    event.preventDefault();
    const selectedBrand = brands.find((brand) => brand.id === draft.brandId);
    const normalizedDraft = {
      ...draft,
      category: selectedBrand?.category ?? draft.category,
      expiresAt: new Date(`${draft.expiresAt}T23:59:59`).toISOString(),
    };
    if (editingPromotion) {
      updatePromotion(editingPromotion.id, normalizedDraft);
      showToast("Promotion mise à jour localement", "success");
    } else {
      addPromotion(normalizedDraft);
      showToast("Promotion ajoutée à la démonstration", "success");
    }
    setPromotionModalOpen(false);
  };

  const saveBrand = (event: FormEvent) => {
    event.preventDefault();
    addBrand({
      ...brandDraft,
      initials:
        brandDraft.initials.trim() ||
        brandDraft.name
          .split(/\s+/)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
    });
    showToast(`${brandDraft.name} ajoutée au catalogue`, "success");
    setBrandDraft({
      name: "",
      category: "mode",
      initials: "",
      tone: "#252525",
    });
    setBrandModalOpen(false);
  };

  const confirmDeletePromotion = (promotion: Promotion) => {
    if (
      window.confirm(
        `Supprimer « ${promotion.title} » de cette démonstration locale ?`,
      )
    ) {
      deletePromotion(promotion.id);
      showToast("Promotion supprimée", "danger");
    }
  };

  const confirmDeleteBrand = (brand: Brand) => {
    const associated = promotions.filter(
      (promotion) => promotion.brandId === brand.id,
    ).length;
    if (
      window.confirm(
        `${brand.name} possède ${associated} offre${associated > 1 ? "s" : ""}. Supprimer cette marque locale ?`,
      )
    ) {
      deleteBrand(brand.id);
      showToast("Marque supprimée", "danger");
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <Logo />
          <span>Admin</span>
        </div>
        <nav aria-label="Navigation administration">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={tab === item.id ? "is-active" : ""}
                onClick={() => {
                  setTab(item.id);
                  setSearch("");
                }}
              >
                <Icon size={18} />
                {item.label}
                <ChevronRight size={14} />
              </button>
            );
          })}
        </nav>
        <div className="admin-sidebar__foot">
          <div>
            <ShieldCheck size={17} />
            <span>
              <strong>Mode local</strong>
              <small>Aucune donnée serveur</small>
            </span>
          </div>
          <Link to="/">
            <ArrowLeft size={16} /> Revenir au site
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="eyebrow">Espace de gestion</span>
            <h1>{tabs.find((item) => item.id === tab)?.label}</h1>
          </div>
          <div>
            <DemoBadge />
            {tab === "promotions" && (
              <button
                type="button"
                className="button button--primary"
                onClick={openCreatePromotion}
              >
                <Plus size={17} /> Ajouter une promotion
              </button>
            )}
            {tab === "brands" && (
              <button
                type="button"
                className="button button--primary"
                onClick={() => setBrandModalOpen(true)}
              >
                <Plus size={17} /> Ajouter une marque
              </button>
            )}
          </div>
        </header>

        <div className="admin-demo-notice">
          <CheckCircle2 size={17} />
          <span>
            Les modifications de cet espace sont enregistrées uniquement dans
            votre navigateur et peuvent être réinitialisées depuis le profil.
          </span>
        </div>

        {tab === "dashboard" && (
          <AdminDashboard
            promotions={promotions}
            brands={brands}
            categories={categories}
            favoritesCount={favorites.length}
            liveCount={livePromotions.length}
            expiredCount={expiredPromotions}
            averageDiscount={averageDiscount}
            totalSavings={totalSavings}
            onNavigate={setTab}
          />
        )}

        {tab === "promotions" && (
          <section className="admin-panel">
            <AdminSearch
              value={search}
              onChange={setSearch}
              placeholder="Rechercher une offre, une marque ou un marchand…"
              count={filteredPromotions.length}
            />
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Promotion</th>
                    <th>Prix</th>
                    <th>Réduction</th>
                    <th>Expiration</th>
                    <th>État</th>
                    <th>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPromotions.map((promotion) => {
                    const expired =
                      promotion.isExpired ||
                      new Date(promotion.expiresAt).getTime() < pageTime;
                    return (
                      <tr key={promotion.id}>
                        <td>
                          <div className="admin-product-cell">
                            <img src={promotion.image} alt="" />
                            <span>
                              <strong>{promotion.title}</strong>
                              <small>
                                {promotion.brand} · {promotion.merchant}
                              </small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <strong>{formatPrice(promotion.currentPrice)}</strong>
                          <s>{formatPrice(promotion.originalPrice)}</s>
                        </td>
                        <td>
                          <span className="admin-discount">−{promotion.discount}%</span>
                        </td>
                        <td>{formatDate(promotion.expiresAt)}</td>
                        <td>
                          <span
                            className={`admin-status ${expired ? "is-expired" : promotion.isNew ? "is-new" : "is-live"}`}
                          >
                            {expired ? "Expirée" : promotion.isNew ? "Nouvelle" : "Active"}
                          </span>
                        </td>
                        <td>
                          <div className="admin-row-actions">
                            <Link
                              to={`/offre/${promotion.id}`}
                              target="_blank"
                              aria-label="Prévisualiser"
                            >
                              <Eye size={15} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => openEditPromotion(promotion)}
                              aria-label="Modifier"
                            >
                              <Edit3 size={15} />
                            </button>
                            {!expired && (
                              <button
                                type="button"
                                onClick={() => {
                                  expirePromotion(promotion.id);
                                  showToast("Offre signalée comme expirée");
                                }}
                                aria-label="Marquer comme expirée"
                              >
                                <Clock3 size={15} />
                              </button>
                            )}
                            <button
                              type="button"
                              className="is-danger"
                              onClick={() => confirmDeletePromotion(promotion)}
                              aria-label="Supprimer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "brands" && (
          <section className="admin-panel">
            <AdminSearch
              value={search}
              onChange={setSearch}
              placeholder="Rechercher une marque…"
              count={filteredBrands.length}
            />
            <div className="admin-brand-grid">
              {filteredBrands.map((brand) => {
                const category = categories.find(
                  (item) => item.id === brand.category,
                );
                const offerCount = promotions.filter(
                  (promotion) => promotion.brandId === brand.id,
                ).length;
                return (
                  <article className="admin-brand-card" key={brand.id}>
                    <span style={{ background: brand.tone }}>{brand.initials}</span>
                    <div>
                      <strong>{brand.name}</strong>
                      <small>
                        {category?.name} · {offerCount} offre
                        {offerCount > 1 ? "s" : ""}
                      </small>
                    </div>
                    <button
                      type="button"
                      onClick={() => confirmDeleteBrand(brand)}
                      aria-label={`Supprimer ${brand.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {tab === "categories" && (
          <section className="admin-category-grid">
            {categories.map((category) => (
              <CategoryAdminCard
                key={category.id}
                category={category}
                brandCount={
                  brands.filter((brand) => brand.category === category.id).length
                }
                offerCount={
                  promotions.filter(
                    (promotion) => promotion.category === category.id,
                  ).length
                }
                onSave={(updates) => {
                  updateCategory(category.id, updates);
                  showToast(`${category.name} mise à jour`, "success");
                }}
              />
            ))}
          </section>
        )}
      </main>

      {promotionModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setPromotionModalOpen(false)}
        >
          <section
            className="modal admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="promotion-form-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal__close"
              type="button"
              onClick={() => setPromotionModalOpen(false)}
            >
              <X size={18} />
              <span className="sr-only">Fermer</span>
            </button>
            <span className="eyebrow">Catalogue local</span>
            <h2 id="promotion-form-title">
              {editingPromotion ? "Modifier la promotion" : "Nouvelle promotion"}
            </h2>
            <PromotionForm
              draft={draft}
              brands={brands}
              onChange={setDraft}
              onSubmit={savePromotion}
              submitLabel={editingPromotion ? "Enregistrer" : "Ajouter l’offre"}
            />
          </section>
        </div>
      )}

      {brandModalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setBrandModalOpen(false)}
        >
          <section
            className="modal admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="brand-form-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal__close"
              type="button"
              onClick={() => setBrandModalOpen(false)}
            >
              <X size={18} />
              <span className="sr-only">Fermer</span>
            </button>
            <span className="eyebrow">Catalogue local</span>
            <h2 id="brand-form-title">Ajouter une marque</h2>
            <form className="admin-form" onSubmit={saveBrand}>
              <label className="field">
                <span>Nom de la marque</span>
                <span className="field__input">
                  <input
                    value={brandDraft.name}
                    onChange={(event) =>
                      setBrandDraft({ ...brandDraft, name: event.target.value })
                    }
                    placeholder="Ex. Atelier Nova"
                    required
                    autoFocus
                  />
                </span>
              </label>
              <div className="admin-form__row">
                <label className="field">
                  <span>Initiales</span>
                  <span className="field__input">
                    <input
                      value={brandDraft.initials}
                      maxLength={3}
                      onChange={(event) =>
                        setBrandDraft({
                          ...brandDraft,
                          initials: event.target.value.toUpperCase(),
                        })
                      }
                      placeholder="AN"
                    />
                  </span>
                </label>
                <label className="field">
                  <span>Couleur</span>
                  <span className="field__input color-input">
                    <input
                      type="color"
                      value={brandDraft.tone}
                      onChange={(event) =>
                        setBrandDraft({ ...brandDraft, tone: event.target.value })
                      }
                    />
                    {brandDraft.tone}
                  </span>
                </label>
              </div>
              <label className="field">
                <span>Catégorie</span>
                <select
                  value={brandDraft.category}
                  onChange={(event) =>
                    setBrandDraft({
                      ...brandDraft,
                      category: event.target.value as CategoryId,
                    })
                  }
                >
                  {categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="button button--primary button--wide" type="submit">
                Ajouter la marque
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

interface AdminDashboardProps {
  promotions: Promotion[];
  brands: Brand[];
  categories: Category[];
  favoritesCount: number;
  liveCount: number;
  expiredCount: number;
  averageDiscount: number;
  totalSavings: number;
  onNavigate: (tab: AdminTab) => void;
}

function AdminDashboard({
  promotions,
  brands,
  categories,
  favoritesCount,
  liveCount,
  expiredCount,
  averageDiscount,
  totalSavings,
  onNavigate,
}: AdminDashboardProps) {
  const stats = [
    {
      label: "Offres actives",
      value: liveCount,
      detail: `${expiredCount} expirées`,
      icon: Tag,
      tone: "red",
    },
    {
      label: "Marques",
      value: brands.length,
      detail: `${categories.length} catégories`,
      icon: Store,
      tone: "dark",
    },
    {
      label: "Réduction moyenne",
      value: `${averageDiscount}%`,
      detail: "sur les offres actives",
      icon: TrendingUp,
      tone: "green",
    },
    {
      label: "Favoris locaux",
      value: favoritesCount,
      detail: `${formatPrice(totalSavings)} économisables`,
      icon: CircleDollarSign,
      tone: "sand",
    },
  ];
  const recent = [...promotions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  return (
    <>
      <section className="admin-stats" aria-label="Statistiques">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.label}>
              <span className={`admin-stat-icon admin-stat-icon--${stat.tone}`}>
                <Icon size={20} />
              </span>
              <small>{stat.label}</small>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </article>
          );
        })}
      </section>
      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-activity">
          <div className="admin-panel__heading">
            <div>
              <span className="eyebrow">Catalogue</span>
              <h2>Ajouts récents</h2>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => onNavigate("promotions")}
            >
              Tout gérer <ChevronRight size={15} />
            </button>
          </div>
          <div className="admin-activity-list">
            {recent.map((promotion) => (
              <div key={promotion.id}>
                <img src={promotion.image} alt="" />
                <span>
                  <strong>{promotion.title}</strong>
                  <small>
                    {promotion.brand} · ajoutée le{" "}
                    {formatDate(promotion.createdAt)}
                  </small>
                </span>
                <b>−{promotion.discount}%</b>
              </div>
            ))}
          </div>
        </section>
        <section className="admin-panel admin-health">
          <div className="admin-panel__heading">
            <div>
              <span className="eyebrow">État de la démo</span>
              <h2>Qualité du catalogue</h2>
            </div>
            <BarChart3 size={20} />
          </div>
          <div className="health-score">
            <span>
              <strong>96</strong>
              <small>/ 100</small>
            </span>
            <div>
              <b style={{ width: "96%" }} />
            </div>
            <p>Le catalogue fictif est prêt pour la présentation.</p>
          </div>
          <ul>
            <li>
              <CheckCircle2 size={16} /> Prix et économies cohérents
            </li>
            <li>
              <CheckCircle2 size={16} /> Toutes les catégories représentées
            </li>
            <li>
              <CheckCircle2 size={16} /> Statut de démonstration visible
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}

function AdminSearch({
  value,
  onChange,
  placeholder,
  count,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  count: number;
}) {
  return (
    <div className="admin-searchbar">
      <label>
        <Search size={18} />
        <span className="sr-only">Rechercher</span>
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
        {value && (
          <button type="button" onClick={() => onChange("")} aria-label="Effacer">
            <X size={15} />
          </button>
        )}
      </label>
      <span>{count} éléments</span>
    </div>
  );
}

function PromotionForm({
  draft,
  brands,
  onChange,
  onSubmit,
  submitLabel,
}: {
  draft: AdminPromotionDraft;
  brands: Brand[];
  onChange: (draft: AdminPromotionDraft) => void;
  onSubmit: (event: FormEvent) => void;
  submitLabel: string;
}) {
  const selectedBrand = brands.find((brand) => brand.id === draft.brandId);

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <label className="field">
        <span>Titre de l’offre</span>
        <span className="field__input">
          <input
            value={draft.title}
            onChange={(event) => onChange({ ...draft, title: event.target.value })}
            placeholder="Ex. Casque sans fil premium"
            required
            autoFocus
          />
        </span>
      </label>
      <div className="admin-form__row">
        <label className="field">
          <span>Marque</span>
          <select
            value={draft.brandId}
            onChange={(event) => {
              const brand = brands.find((item) => item.id === event.target.value);
              onChange({
                ...draft,
                brandId: event.target.value,
                category: brand?.category ?? draft.category,
              });
            }}
            required
          >
            {brands.map((brand) => (
              <option value={brand.id} key={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Marchand</span>
          <span className="field__input">
            <input
              value={draft.merchant}
              onChange={(event) =>
                onChange({ ...draft, merchant: event.target.value })
              }
              placeholder={selectedBrand?.name ?? "Marchand"}
              required
            />
          </span>
        </label>
      </div>
      <div className="admin-form__row">
        <label className="field">
          <span>Ancien prix (€)</span>
          <span className="field__input">
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={draft.originalPrice}
              onChange={(event) =>
                onChange({ ...draft, originalPrice: Number(event.target.value) })
              }
              required
            />
          </span>
        </label>
        <label className="field">
          <span>Nouveau prix (€)</span>
          <span className="field__input">
            <input
              type="number"
              min="0"
              step="0.01"
              max={draft.originalPrice}
              value={draft.currentPrice}
              onChange={(event) =>
                onChange({ ...draft, currentPrice: Number(event.target.value) })
              }
              required
            />
          </span>
        </label>
      </div>
      <div className="admin-form__row">
        <label className="field">
          <span>Code promotionnel (facultatif)</span>
          <span className="field__input">
            <input
              value={draft.promoCode}
              onChange={(event) =>
                onChange({
                  ...draft,
                  promoCode: event.target.value.toUpperCase(),
                })
              }
              placeholder="DEALYVA20"
            />
          </span>
        </label>
        <label className="field">
          <span>Date d’expiration</span>
          <span className="field__input">
            <input
              type="date"
              value={draft.expiresAt.slice(0, 10)}
              onChange={(event) =>
                onChange({ ...draft, expiresAt: event.target.value })
              }
              required
            />
          </span>
        </label>
      </div>
      <div className="admin-form__preview">
        <span>Réduction calculée</span>
        <strong>
          −
          {draft.originalPrice > 0
            ? Math.round(
                ((draft.originalPrice - draft.currentPrice) /
                  draft.originalPrice) *
                  100,
              )
            : 0}
          %
        </strong>
      </div>
      <button className="button button--primary button--wide" type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

function CategoryAdminCard({
  category,
  brandCount,
  offerCount,
  onSave,
}: {
  category: Category;
  brandCount: number;
  offerCount: number;
  onSave: (updates: Partial<Category>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);
  const [accent, setAccent] = useState(category.accent);

  return (
    <article className="admin-category-card">
      <div className="admin-category-card__image">
        <img src={category.image} alt="" />
        <span style={{ background: accent }} />
      </div>
      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave({ name, description, accent });
            setEditing(false);
          }}
        >
          <input value={name} onChange={(event) => setName(event.target.value)} />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
          />
          <label>
            Couleur
            <input
              type="color"
              value={accent}
              onChange={(event) => setAccent(event.target.value)}
            />
          </label>
          <div>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => setEditing(false)}
            >
              Annuler
            </button>
            <button className="button button--primary" type="submit">
              Enregistrer
            </button>
          </div>
        </form>
      ) : (
        <div className="admin-category-card__content">
          <span>{category.eyebrow}</span>
          <h2>{category.name}</h2>
          <p>{category.description}</p>
          <div>
            <small>{brandCount} marques</small>
            <small>{offerCount} offres</small>
            <button type="button" onClick={() => setEditing(true)}>
              <Edit3 size={15} /> Modifier
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
