import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ScrollToTop } from "./components/ScrollToTop";
import { ToastRegion } from "./components/ToastRegion";
import AdminPage from "./pages/AdminPage";
import BrandsPage from "./pages/BrandsPage";
import CategoriesPage from "./pages/CategoriesPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import LegalPage from "./pages/LegalPage";
import PreferencesPage from "./pages/PreferencesPage";
import ProfilePage from "./pages/ProfilePage";
import PromotionDetailPage from "./pages/PromotionDetailPage";

const pageTitles: Record<string, string> = {
  "/": "Promotions",
  "/marques": "Marques",
  "/categories": "Catégories",
  "/favoris": "Mes favoris",
  "/preferences": "Préférences et alertes",
  "/profil": "Mon profil",
  "/mentions-legales": "Mentions légales et confidentialité",
  "/administration": "Administration",
};

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = pathname.startsWith("/offre/")
      ? "Détail de l’offre"
      : (pageTitles[pathname] ?? "Page introuvable");
    document.title = `${title} — Offrely`;
  }, [pathname]);

  return null;
}

function PublicLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Aller au contenu
      </a>
      <Header />
      <div id="main-content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function NotFoundPage() {
  return (
    <main className="page-shell container">
      <div className="empty-state standalone-empty">
        <span className="error-code">404</span>
        <h1>Cette page s’est égarée.</h1>
        <p>Revenez au flux pour retrouver les meilleures offres de la démo.</p>
        <a className="button button--dark" href="/">
          Retourner à l’accueil
        </a>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <>
      <RouteMetadata />
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="marques" element={<BrandsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="favoris" element={<FavoritesPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="profil" element={<ProfilePage />} />
          <Route path="offre/:id" element={<PromotionDetailPage />} />
          <Route path="mentions-legales" element={<LegalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/administration" element={<AdminPage />} />
        <Route path="/admin" element={<Navigate to="/administration" replace />} />
      </Routes>
      <ToastRegion />
    </>
  );
}
