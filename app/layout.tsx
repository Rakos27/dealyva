/* eslint-disable react-refresh/only-export-components */

import type { ReactNode } from "react";

import "../src/styles.css";

export const metadata = {
  title: "Promotions — Dealyva",
  description:
    "Dealyva rassemble les meilleures promotions en ligne, partout.",
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
