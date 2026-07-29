import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Heart,
  Menu,
  Moon,
  Settings2,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { AuthModal } from "./AuthModal";
import { DemoBadge } from "./DemoBadge";
import { Logo } from "./Logo";

const navItems = [
  { to: "/", label: "Promotions", end: true },
  { to: "/marques", label: "Marques" },
  { to: "/categories", label: "Catégories" },
  { to: "/favoris", label: "Mes favoris" },
];

export function Header() {
  const { theme, toggleTheme, user, logout, favorites, selectedBrands } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setAccountOpen(false);
        setNotificationsOpen(false);
        setAuthOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Logo />
          <nav className="desktop-nav" aria-label="Navigation principale">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "is-active" : "")}
                onClick={() => {
                  setAccountOpen(false);
                  setNotificationsOpen(false);
                }}
              >
                {item.label}
                {item.to === "/favoris" && favorites.length > 0 && (
                  <span className="nav-count">{favorites.length}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="site-header__actions">
            <DemoBadge compact />
            <div className="popover-wrap">
              <button
                className="icon-button header-icon"
                type="button"
                aria-label="Voir les notifications"
                aria-expanded={notificationsOpen}
                onClick={() => {
                  setNotificationsOpen((value) => !value);
                  setAccountOpen(false);
                }}
              >
                <Bell size={19} />
                {(favorites.length > 0 || selectedBrands.length > 0) && (
                  <span className="notification-dot" />
                )}
              </button>
              {notificationsOpen && (
                <div className="popover notification-popover">
                  <div className="popover__header">
                    <strong>Vos actualités</strong>
                    <span>Démo</span>
                  </div>
                  <div className="notification-item">
                    <span className="notification-item__icon">
                      <Heart size={16} />
                    </span>
                    <div>
                      <strong>Vos sélections sont prêtes</strong>
                      <p>
                        {selectedBrands.length
                          ? `${selectedBrands.length} marques alimentent votre flux personnalisé.`
                          : "Choisissez vos marques pour personnaliser ce flux."}
                      </p>
                    </div>
                  </div>
                  <Link className="text-link" to="/preferences">
                    Gérer les alertes
                  </Link>
                </div>
              )}
            </div>
            <button
              className="icon-button header-icon"
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"
              }
            >
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            {user ? (
              <div className="popover-wrap" ref={accountRef}>
                <button
                  className="avatar-button"
                  type="button"
                  onClick={() => {
                    setAccountOpen((value) => !value);
                    setNotificationsOpen(false);
                  }}
                  aria-label="Ouvrir le menu du profil"
                  aria-expanded={accountOpen}
                >
                  <span>{user.initials}</span>
                  <ChevronDown size={14} aria-hidden="true" />
                </button>
                {accountOpen && (
                  <div className="popover account-popover">
                    <div className="account-popover__identity">
                      <span className="avatar avatar--large">{user.initials}</span>
                      <div>
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </div>
                    </div>
                    <Link to="/profil">
                      <UserRound size={16} /> Mon profil
                    </Link>
                    <Link to="/preferences">
                      <Settings2 size={16} /> Préférences
                    </Link>
                    <button type="button" onClick={logout}>
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="button button--dark header-login"
                type="button"
                onClick={() => setAuthOpen(true)}
              >
                Se connecter
              </button>
            )}
            <button
              className="icon-button mobile-menu-button"
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="mobile-nav container" aria-label="Navigation mobile">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "is-active" : "")}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
                {item.to === "/favoris" && favorites.length > 0 && (
                  <span>{favorites.length}</span>
                )}
              </NavLink>
            ))}
            <NavLink to="/preferences" onClick={() => setMobileOpen(false)}>
              Préférences et alertes
            </NavLink>
            {!user && (
              <button
                className="button button--primary"
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setAuthOpen(true);
                }}
              >
                Se connecter
              </button>
            )}
          </nav>
        )}
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
