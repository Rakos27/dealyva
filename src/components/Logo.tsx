import { Link } from "react-router-dom";

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link
      to="/"
      className={`logo ${compact ? "logo--compact" : ""}`}
      aria-label="Offrely, retour à l’accueil"
    >
      <span className="logo__mark" aria-hidden="true">
        O
      </span>
      <span className="logo__word">ffrely</span>
      <span className="logo__dot" aria-hidden="true" />
    </Link>
  );
}
