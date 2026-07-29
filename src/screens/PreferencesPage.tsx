import type { ReactNode } from "react";
import {
  Bell,
  BellRing,
  Check,
  Clock3,
  Heart,
  MailWarning,
  Percent,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DemoBadge } from "../components/DemoBadge";
import { useApp } from "../context/AppContext";
import type { AlertSettings } from "../types";

interface AlertSwitchProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  icon: ReactNode;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
}

const frequencyLabels: Record<AlertSettings["frequency"], string> = {
  instant: "En temps réel",
  daily: "Résumé quotidien",
  weekly: "Résumé hebdomadaire",
};

function AlertSwitch({
  id,
  title,
  description,
  checked,
  icon,
  onChange,
  children,
}: AlertSwitchProps) {
  const descriptionId = `${id}-description`;

  return (
    <article className={`alert-setting${checked ? " is-active" : ""}`}>
      <div className="alert-setting__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="alert-setting__content">
        <div className="alert-setting__heading">
          <div>
            <h3>{title}</h3>
            <p id={descriptionId}>{description}</p>
          </div>
          <label className="switch-control">
            <span className="sr-only">
              {checked ? "Désactiver" : "Activer"} : {title}
            </span>
            <input
              id={id}
              type="checkbox"
              role="switch"
              checked={checked}
              aria-describedby={descriptionId}
              onChange={(event) => onChange(event.target.checked)}
            />
            <span className="switch-control__track" aria-hidden="true">
              <span className="switch-control__thumb" />
            </span>
          </label>
        </div>
        {children}
      </div>
    </article>
  );
}

export default function PreferencesPage() {
  const {
    alerts,
    updateAlerts,
    selectedBrands,
    brands,
    showToast,
  } = useApp();

  const followedBrands = brands.filter((brand) =>
    selectedBrands.includes(brand.id),
  );
  const enabledAlertCount = [
    alerts.favoriteBrand,
    alerts.discountThreshold,
    alerts.priceDrop,
    alerts.expiringSoon,
  ].filter(Boolean).length;

  const setAlert = <Key extends keyof AlertSettings>(
    key: Key,
    value: AlertSettings[Key],
  ) => {
    updateAlerts({ [key]: value });
  };

  return (
    <main className="page-shell account-page preferences-page">
      <section className="account-hero" aria-labelledby="preferences-title">
        <div>
          <p className="eyebrow">
            <BellRing size={16} aria-hidden="true" />
            Alertes et préférences
          </p>
          <h1 id="preferences-title">À vous de donner le rythme.</h1>
          <p>
            Choisissez ce qui mérite votre attention. Vos réglages sont
            enregistrés automatiquement sur cet appareil.
          </p>
        </div>
        <div className="account-hero__aside">
          <span className="preference-score" aria-label={`${enabledAlertCount} alertes actives sur 4`}>
            <strong>{enabledAlertCount}</strong>
            <small>/ 4 actives</small>
          </span>
          <DemoBadge />
        </div>
      </section>

      <aside className="demo-notice" aria-labelledby="alerts-demo-title">
        <MailWarning size={22} aria-hidden="true" />
        <div>
          <h2 id="alerts-demo-title">Aucune notification réelle n’est envoyée</h2>
          <p>
            Ces alertes illustrent le futur service Dealyva. Aucun service
            d’e-mail, de notification push ou de suivi de prix n’est connecté.
          </p>
        </div>
        <DemoBadge compact />
      </aside>

      <div className="preferences-layout">
        <section
          className="settings-panel"
          aria-labelledby="notification-types-title"
        >
          <div className="settings-panel__heading">
            <div>
              <p className="eyebrow">Types d’alertes</p>
              <h2 id="notification-types-title">Ce que vous souhaitez suivre</h2>
            </div>
            <Bell size={21} aria-hidden="true" />
          </div>

          <div className="alert-settings-list">
            <AlertSwitch
              id="favorite-brand-alert"
              title="Nouvelle offre d’une marque favorite"
              description="Recevoir une alerte lorsqu’une marque de votre sélection publie une promotion."
              checked={alerts.favoriteBrand}
              icon={<Heart size={20} />}
              onChange={(checked) => setAlert("favoriteBrand", checked)}
            >
              <div className="followed-brand-preview">
                {followedBrands.length > 0 ? (
                  <>
                    <div className="mini-avatar-stack" aria-hidden="true">
                      {followedBrands.slice(0, 4).map((brand) => (
                        <span
                          key={brand.id}
                          style={{ background: brand.tone }}
                        >
                          {brand.initials}
                        </span>
                      ))}
                    </div>
                    <p>
                      {followedBrands.length} marque
                      {followedBrands.length > 1 ? "s" : ""} suivie
                      {followedBrands.length > 1 ? "s" : ""}
                    </p>
                  </>
                ) : (
                  <Link className="text-link" to="/marques">
                    Choisir mes marques
                  </Link>
                )}
              </div>
            </AlertSwitch>

            <AlertSwitch
              id="discount-threshold-alert"
              title="Réduction supérieure à un seuil"
              description="Être prévenu lorsqu’une réduction atteint le pourcentage qui compte pour vous."
              checked={alerts.discountThreshold}
              icon={<Percent size={20} />}
              onChange={(checked) =>
                setAlert("discountThreshold", checked)
              }
            >
              <div
                className={`threshold-control${alerts.discountThreshold ? "" : " is-disabled"}`}
              >
                <label htmlFor="discount-threshold">
                  Seuil minimum
                  <output htmlFor="discount-threshold">
                    −{alerts.threshold} %
                  </output>
                </label>
                <input
                  id="discount-threshold"
                  type="range"
                  min="10"
                  max="70"
                  step="5"
                  value={alerts.threshold}
                  disabled={!alerts.discountThreshold}
                  onChange={(event) =>
                    setAlert("threshold", Number(event.target.value))
                  }
                />
                <div className="range-scale" aria-hidden="true">
                  <span>−10 %</span>
                  <span>−70 %</span>
                </div>
              </div>
            </AlertSwitch>

            <AlertSwitch
              id="price-drop-alert"
              title="Baisse de prix d’un produit"
              description="Suivre une nouvelle baisse sur les produits que vous avez sauvegardés."
              checked={alerts.priceDrop}
              icon={<TrendingDown size={20} />}
              onChange={(checked) => setAlert("priceDrop", checked)}
            />

            <AlertSwitch
              id="expiring-alert"
              title="Offre bientôt expirée"
              description="Recevoir un rappel avant la fin d’une promotion enregistrée dans vos favoris."
              checked={alerts.expiringSoon}
              icon={<Clock3 size={20} />}
              onChange={(checked) => setAlert("expiringSoon", checked)}
            />
          </div>
        </section>

        <aside className="preferences-sidebar">
          <fieldset className="frequency-card">
            <legend>
              <span className="eyebrow">Fréquence</span>
              Quand souhaitez-vous être informé&nbsp;?
            </legend>
            <p>
              Ce rythme s’applique à toutes les alertes de démonstration
              activées.
            </p>
            <div className="frequency-options">
              {(
                Object.entries(frequencyLabels) as [
                  AlertSettings["frequency"],
                  string,
                ][]
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`frequency-option${alerts.frequency === value ? " is-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="alert-frequency"
                    value={value}
                    checked={alerts.frequency === value}
                    onChange={() => setAlert("frequency", value)}
                  />
                  <span className="frequency-option__check" aria-hidden="true">
                    {alerts.frequency === value && <Check size={13} />}
                  </span>
                  <span>
                    <strong>{label}</strong>
                    <small>
                      {value === "instant"
                        ? "Dès qu’une occasion apparaît"
                        : value === "daily"
                          ? "Un aperçu chaque matin"
                          : "Une sélection chaque lundi"}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <section className="preference-summary" aria-labelledby="summary-title">
            <Sparkles size={20} aria-hidden="true" />
            <div>
              <p className="eyebrow">Votre configuration</p>
              <h2 id="summary-title">
                {enabledAlertCount === 0
                  ? "Mode silencieux"
                  : `${enabledAlertCount} alerte${enabledAlertCount > 1 ? "s" : ""} · ${frequencyLabels[alerts.frequency]}`}
              </h2>
              <p>
                Les changements sont conservés localement et peuvent être
                modifiés à tout moment.
              </p>
            </div>
            <button
              className="button button--secondary button--wide"
              type="button"
              onClick={() =>
                showToast("Vos préférences sont bien enregistrées", "success")
              }
            >
              Vérifier l’enregistrement
            </button>
          </section>
        </aside>
      </div>
    </main>
  );
}
