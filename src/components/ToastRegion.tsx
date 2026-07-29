import { CheckCircle2, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export function ToastRegion() {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.tone ?? "default"}`}
        >
          <CheckCircle2 size={18} aria-hidden="true" />
          <span>{toast.message}</span>
          <button
            type="button"
            aria-label="Fermer la notification"
            onClick={() => dismissToast(toast.id)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
