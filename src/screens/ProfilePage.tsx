import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Clock3,
  Heart,
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DemoBadge } from "../components/DemoBadge";
import { useApp } from "../context/AppContext";
import { formatDate, formatPrice } from "../lib/format";

const frequencyLabels = {
  instant: "En temps réel",
  daily: "Résumé quotidien",
  weekly: "Résumé hebdomadaire",
} as const;

export default function ProfilePage() {
  const {
    user,
    login,
    logout,
    favorites,
    selectedBrands,
    brands,
    promotions,
    recentlyViewed,
    alerts,
    deleteAllData,
  } = useApp();
  const [name, setName] = useState("Léa Martin");
  const [email, setEmail] = useState("lea@exemple.fr");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);

  const followedBrands = useMemo(
    () => brands.filter((brand) => selectedBrands.includes(brand.id)),
    [brands, selectedBrands],
  );
  const viewedPromotions = useMemo(
    () =>
      recentlyViewed
        .map((promotionId) =>
          promotions.find((promotion) => promotion.id === promotionId),
        )
        .filter((promotion) => promotion !== undefined)
        .slice(0, 6),
    [promotions, recentlyViewed],
  );
  const enabledAlertCount = [
    alerts.favoriteBrand,
    alerts.discountThreshold,
    alerts.priceDrop,
    alerts.expiringSoon,
  ].filter(Boolean).length;

  useEffect(() => {
    if (!deleteDialogOpen) return;

    cancelDeleteRef.current?.focus();
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDeleteDialogOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [deleteDialogOpen]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ name, email });
  };

  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    deleteAllData();
  };

  return (
    <main className="page-shell account-page profile-page">
      <section className="account-hero profile-hero" aria-labelledby="profile-title">
        <div>
          <p className="eyebrow">
            <UserRound size={16} aria-hidden="true" />
            Espace personnel
          </p>
          <h1 id="profile-title">
            {user ? `Bonjour, ${user.name.split(" ")[0]}.` : "Votre Dealyva, à votre image."}
          </h1>
          <p>
            Retrouvez ici vos marques, votre activité et les réglages conservés
            localement sur cet appareil.
          </p>
        </div>
        <DemoBadge />
      </section>

      {!user ? (
        <section className="demo-login-panel" aria-labelledby="demo-login-title">
          <div className="demo-login-panel__intro">
            <span className="demo-login-panel__icon">
              <LogIn size={24} aria-hidden="true" />
            </span>
            <p className="eyebrow">Compte de démonstration</p>
            <h2 id="demo-login-title">Ouvrez votre espace personnel.</h2>
            <p>
              Cette connexion sert uniquement à présenter l’expérience
              Dealyva. Aucun mot de passe, compte serveur ou donnée sensible
              n’est utilisé.
            </p>
            <ul className="feature-check-list">
              <li>
                <ShieldCheck size={17} aria-hidden="true" />
                Données limitées à votre navigateur
              </li>
              <li>
                <Heart size={17} aria-hidden="true" />
                Favoris et marques déjà conservés
              </li>
              <li>
                <Bell size={17} aria-hidden="true" />
                Alertes entièrement fictives
              </li>
            </ul>
          </div>

          <form className="profile-login-form" onSubmit={handleLogin}>
            <label className="field">
              <span>Nom complet</span>
              <span className="field__input">
                <UserRound size={17} aria-hidden="true" />
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </span>
            </label>
            <label className="field">
              <span>Adresse e-mail</span>
              <span className="field__input">
                <Mail size={17} aria-hidden="true" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </span>
            </label>
            <button className="button button--primary button--wide" type="submit">
              Entrer dans mon espace démo
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <small>
              En continuant, vous utilisez une simulation locale sans
              authentification sécurisée.
            </small>
          </form>
        </section>
      ) : (
        <section className="profile-identity" aria-labelledby="identity-title">
          <span className="avatar profile-identity__avatar" aria-hidden="true">
            {user.initials}
          </span>
          <div className="profile-identity__details">
            <p className="eyebrow">Compte local actif</p>
            <h2 id="identity-title">{user.name}</h2>
            <p>
              <Mail size={15} aria-hidden="true" />
              {user.email}
            </p>
            <small>
              Espace créé le {formatDate(user.joinedAt)} · Démonstration
            </small>
          </div>
          <button
            type="button"
            className="button button--secondary"
            onClick={logout}
          >
            <LogOut size={17} aria-hidden="true" />
            Se déconnecter
          </button>
        </section>
      )}

      <section className="profile-stats" aria-label="Résumé de votre activité">
        <article>
          <span>
            <Heart size={19} aria-hidden="true" />
          </span>
          <div>
            <strong>{favorites.length}</strong>
            <p>offre{favorites.length > 1 ? "s" : ""} en favoris</p>
          </div>
          <Link to="/favoris" aria-label="Voir mes favoris">
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </article>
        <article>
          <span>
            <Store size={19} aria-hidden="true" />
          </span>
          <div>
            <strong>{selectedBrands.length}</strong>
            <p>marque{selectedBrands.length > 1 ? "s" : ""} suivie{selectedBrands.length > 1 ? "s" : ""}</p>
          </div>
          <Link to="/marques" aria-label="Voir mes marques">
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </article>
        <article>
          <span>
            <Clock3 size={19} aria-hidden="true" />
          </span>
          <div>
            <strong>{recentlyViewed.length}</strong>
            <p>offre{recentlyViewed.length > 1 ? "s" : ""} consultée{recentlyViewed.length > 1 ? "s" : ""}</p>
          </div>
          <a href="#history" aria-label="Voir mon historique">
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </article>
      </section>

      <div className="profile-dashboard">
        <section className="profile-card" aria-labelledby="brands-profile-title">
          <div className="profile-card__heading">
            <div>
              <p className="eyebrow">Vos affinités</p>
              <h2 id="brands-profile-title">Marques favorites</h2>
            </div>
            <Link className="text-link" to="/marques">
              Gérer
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          {followedBrands.length > 0 ? (
            <div className="profile-brand-list">
              {followedBrands.slice(0, 8).map((brand) => (
                <Link
                  key={brand.id}
                  to={`/?marque=${brand.id}`}
                  className="profile-brand"
                >
                  <span style={{ background: brand.tone }} aria-hidden="true">
                    {brand.initials}
                  </span>
                  <strong>{brand.name}</strong>
                </Link>
              ))}
              {followedBrands.length > 8 && (
                <Link className="profile-brand profile-brand--more" to="/marques">
                  +{followedBrands.length - 8}
                  <small>autres</small>
                </Link>
              )}
            </div>
          ) : (
            <div className="profile-card__empty">
              <Store size={22} aria-hidden="true" />
              <p>
                Sélectionnez quelques marques pour personnaliser votre flux.
              </p>
              <Link className="button button--secondary" to="/marques">
                Choisir mes marques
              </Link>
            </div>
          )}
        </section>

        <section className="profile-card" aria-labelledby="preferences-profile-title">
          <div className="profile-card__heading">
            <div>
              <p className="eyebrow">Votre rythme</p>
              <h2 id="preferences-profile-title">Préférences et alertes</h2>
            </div>
            <Link className="text-link" to="/preferences">
              Modifier
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="profile-preference-summary">
            <span className="profile-preference-summary__icon">
              <Bell size={21} aria-hidden="true" />
            </span>
            <div>
              <strong>
                {enabledAlertCount} alerte{enabledAlertCount > 1 ? "s" : ""} active
                {enabledAlertCount > 1 ? "s" : ""}
              </strong>
              <p>{frequencyLabels[alerts.frequency]}</p>
            </div>
          </div>
          <ul className="profile-preference-list">
            <li className={alerts.favoriteBrand ? "is-active" : ""}>
              <span>{alerts.favoriteBrand && <Sparkles size={13} />}</span>
              Nouvelles offres de vos marques
            </li>
            <li className={alerts.discountThreshold ? "is-active" : ""}>
              <span>{alerts.discountThreshold && <Sparkles size={13} />}</span>
              Réductions d’au moins {alerts.threshold} %
            </li>
            <li className={alerts.priceDrop ? "is-active" : ""}>
              <span>{alerts.priceDrop && <Sparkles size={13} />}</span>
              Baisses de prix
            </li>
            <li className={alerts.expiringSoon ? "is-active" : ""}>
              <span>{alerts.expiringSoon && <Sparkles size={13} />}</span>
              Rappels avant expiration
            </li>
          </ul>
        </section>

        <section
          className="profile-card profile-history"
          id="history"
          aria-labelledby="history-title"
        >
          <div className="profile-card__heading">
            <div>
              <p className="eyebrow">Récemment consulté</p>
              <h2 id="history-title">Votre historique</h2>
            </div>
            <Clock3 size={20} aria-hidden="true" />
          </div>
          {viewedPromotions.length > 0 ? (
            <ol className="history-list">
              {viewedPromotions.map((promotion) => (
                <li key={promotion.id}>
                  <Link to={`/offre/${promotion.id}`}>
                    <img src={promotion.image} alt="" loading="lazy" />
                    <span>
                      <small>{promotion.brand}</small>
                      <strong>{promotion.title}</strong>
                    </span>
                    <span className="history-list__price">
                      {formatPrice(promotion.currentPrice)}
                      <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <div className="profile-card__empty">
              <Clock3 size={22} aria-hidden="true" />
              <p>Les offres ouvertes récemment apparaîtront ici.</p>
              <Link className="button button--secondary" to="/">
                Explorer les offres
              </Link>
            </div>
          )}
        </section>
      </div>

      <section className="danger-zone" aria-labelledby="data-control-title">
        <div>
          <p className="eyebrow">Contrôle de vos données</p>
          <h2 id="data-control-title">Effacer mes données locales</h2>
          <p>
            Supprime le compte démo, les favoris, les marques, l’historique,
            les alertes et les modifications d’administration enregistrés dans
            ce navigateur.
          </p>
        </div>
        <button
          className="button button--danger-outline"
          type="button"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 size={17} aria-hidden="true" />
          Supprimer mes données
        </button>
      </section>

      {deleteDialogOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setDeleteDialogOpen(false)}
        >
          <section
            className="modal confirm-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal__close"
              type="button"
              onClick={() => setDeleteDialogOpen(false)}
              aria-label="Fermer la confirmation"
            >
              <X size={19} aria-hidden="true" />
            </button>
            <span className="confirm-delete-modal__icon">
              <AlertTriangle size={24} aria-hidden="true" />
            </span>
            <p className="eyebrow">Action irréversible</p>
            <h2 id="delete-dialog-title">Tout recommencer&nbsp;?</h2>
            <p id="delete-dialog-description">
              Cette action remettra Dealyva à son état initial et supprimera
              toutes les données de démonstration que vous avez personnalisées
              sur cet appareil.
            </p>
            <div className="modal__actions">
              <button
                ref={cancelDeleteRef}
                className="button button--secondary"
                type="button"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Annuler
              </button>
              <button
                className="button button--danger"
                type="button"
                onClick={confirmDelete}
              >
                <Trash2 size={17} aria-hidden="true" />
                Oui, tout supprimer
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
