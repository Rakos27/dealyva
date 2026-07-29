/* eslint-disable react-refresh/only-export-components */

import type { ReactNode } from "react";

import "../src/styles.css";

export const metadata = {
  title: "Promotions — Dealyva",
  description:
    "Dealyva rassemble des promotions partenaires vérifiées et explique clairement son modèle d’affiliation.",
  icons: {
    icon: "/brand/dealyva-logo-carre.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
