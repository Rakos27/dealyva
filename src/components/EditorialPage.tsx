import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EditorialPageProps {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  intro: string;
  children: ReactNode;
  aside?: ReactNode;
}

export function EditorialPage({
  eyebrow,
  icon: Icon,
  title,
  intro,
  children,
  aside,
}: EditorialPageProps) {
  return (
    <main className="page-shell editorial-page">
      <header className="editorial-hero">
        <p className="eyebrow">
          <Icon aria-hidden="true" size={16} />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <div className={aside ? "editorial-layout" : "editorial-layout editorial-layout--wide"}>
        <article className="editorial-content">{children}</article>
        {aside && <aside className="editorial-aside">{aside}</aside>}
      </div>
    </main>
  );
}
