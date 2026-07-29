import { useEffect } from "react";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AdSenseProvider } from "./components/AdSense";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ScrollToTop } from "./components/ScrollToTop";
import { ToastRegion } from "./components/ToastRegion";
import BrandsPage from "./screens/BrandsPage";
import CategoriesPage from "./screens/CategoriesPage";
import FavoritesPage from "./screens/FavoritesPage";
import HomePage from "./screens/HomePage";
import LegalPage from "./screens/LegalPage";
import PromotionDetailPage from "./screens/PromotionDetailPage";

const pageTitles: Record<string, string> = {
  "/": "Promotions",
  "/marques": "Marques",
  "/categories": "Catégories",
  "/favoris": "Mes favoris",
  "/mentions-legales": "Mentions légales et confidentialité",
};

function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const title = pathname.startsWith("/offre/")
      ? "Détail de l’offre"
      : (pageTitles[pathname] ?? "Page introuvable");
    document.title = `${title} — Dealyva`;
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
        <p>Revenez au flux pour retrouver les meilleures offres partenaires.</p>
        <Link className="button button--dark" to="/">
          Retourner à l’accueil
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <>
      <RouteMetadata />
      <AdSenseProvider />
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="marques" element={<BrandsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="favoris" element={<FavoritesPage />} />
          <Route path="offre/:id" element={<PromotionDetailPage />} />
          <Route path="mentions-legales" element={<LegalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ToastRegion />
    </>
  );
}
