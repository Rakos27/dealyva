"use client";

import { useSyncExternalStore } from "react";
import { BrowserRouter } from "react-router-dom";

import App from "../src/App";
import { AppProvider } from "../src/context/AppContext";

export default function DealyvaClient() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <div role="status" aria-live="polite">
        Chargement de Dealyva…
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  );
}
