import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, UserRound, X } from "lucide-react";
import { useApp } from "../context/AppContext";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login } = useApp();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("lea@exemple.fr");
  const [password, setPassword] = useState("demo1234");

  if (!open) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    login({
      name: name.trim() || (mode === "login" ? "Léa Martin" : "Nouvel utilisateur"),
      email: email.trim(),
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal__close" type="button" onClick={onClose}>
          <X size={19} />
          <span className="sr-only">Fermer</span>
        </button>
        <span className="eyebrow">Compte de démonstration</span>
        <h2 id="auth-title">
          {mode === "login" ? "Heureux de vous revoir." : "Créez votre espace Offrely."}
        </h2>
        <p className="muted">
          Vos informations restent uniquement dans ce navigateur. Aucun compte
          sécurisé n’est réellement créé.
        </p>

        <div className="segmented auth-modal__tabs" aria-label="Type de formulaire">
          <button
            type="button"
            className={mode === "login" ? "is-active" : ""}
            onClick={() => setMode("login")}
          >
            Connexion
          </button>
          <button
            type="button"
            className={mode === "register" ? "is-active" : ""}
            onClick={() => setMode("register")}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="stack-form">
          {mode === "register" && (
            <label className="field">
              <span>Nom complet</span>
              <span className="field__input">
                <UserRound size={17} aria-hidden="true" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Léa Martin"
                  required
                  autoFocus
                />
              </span>
            </label>
          )}
          <label className="field">
            <span>Adresse e-mail</span>
            <span className="field__input">
              <Mail size={17} aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoFocus={mode === "login"}
              />
            </span>
          </label>
          <label className="field">
            <span>Mot de passe fictif</span>
            <span className="field__input">
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
            </span>
          </label>
          <button className="button button--primary button--wide" type="submit">
            {mode === "login" ? "Se connecter à la démo" : "Créer mon espace démo"}
          </button>
        </form>
        <p className="auth-modal__fineprint">
          Démonstration uniquement — aucune authentification serveur.
        </p>
      </section>
    </div>
  );
}
