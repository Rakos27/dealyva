import { FlaskConical } from "lucide-react";

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`demo-badge ${compact ? "demo-badge--compact" : ""}`}>
      <FlaskConical size={13} aria-hidden="true" />
      {compact ? "Démo" : "Données de démonstration"}
    </span>
  );
}
