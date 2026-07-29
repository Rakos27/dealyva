/* eslint-disable react-refresh/only-export-components */

import type { ReactNode } from "react";

import "../src/styles.css";

export const metadata = {
  title: "Promotions — Offrely",
  description:
    "Offrely rassemble les promotions en ligne des marques qui comptent pour vous.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
