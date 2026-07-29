import { Link } from "react-router-dom";

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link
      to="/"
      className={`logo ${compact ? "logo--compact" : ""}`}
      aria-label="Dealyva, retour à l’accueil"
    >
      <span className="logo__mark" aria-hidden="true">
        D
      </span>
      <span className="logo__word">ealyva</span>
      <span className="logo__dot" aria-hidden="true" />
    </Link>
  );
}
