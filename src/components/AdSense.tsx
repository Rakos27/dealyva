/* eslint-disable react-refresh/only-export-components */

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
    googlefc?: {
      callbackQueue?: Array<
        | (() => void)
        | {
            CONSENT_API_READY: () => void;
          }
      >;
      showRevocationMessage?: () => void;
    };
  }
}

const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID?.trim() ?? "";
const validClientId = /^ca-pub-\d{16}$/.test(clientId);

export const adSenseEnabled = validClientId;

export const adSenseSlots = {
  homeTop: import.meta.env.VITE_ADSENSE_SLOT_HOME_TOP?.trim() ?? "",
  homeInline: import.meta.env.VITE_ADSENSE_SLOT_HOME_INLINE?.trim() ?? "",
  detail: import.meta.env.VITE_ADSENSE_SLOT_DETAIL?.trim() ?? "",
};

function loadAdSenseScript() {
  if (!validClientId || document.getElementById("dealyva-adsense-script")) {
    return;
  }

  const script = document.createElement("script");
  script.id = "dealyva-adsense-script";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" +
    `?client=${encodeURIComponent(clientId)}`;
  document.head.append(script);
}

export function AdSenseProvider() {
  useEffect(loadAdSenseScript, []);
  return null;
}

interface AdSlotProps {
  slot: string;
  placement: "home-top" | "home-inline" | "detail";
}

export function AdSlot({ slot, placement }: AdSlotProps) {
  const requested = useRef(false);
  const validSlot = /^\d{5,20}$/.test(slot);

  useEffect(() => {
    if (!validClientId || !validSlot || requested.current) {
      return;
    }

    loadAdSenseScript();
    requested.current = true;

    try {
      (window.adsbygoogle ??= []).push({});
    } catch {
      requested.current = false;
    }
  }, [validSlot]);

  if (!validClientId || !validSlot) {
    return null;
  }

  return (
    <aside
      className={`ad-placement ad-placement--${placement}`}
      aria-label="Publicité"
    >
      <span>Publicité</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

export function openAdPrivacySettings(): boolean {
  if (!validClientId) {
    return false;
  }

  window.googlefc ??= {};
  window.googlefc.callbackQueue ??= [];

  if (typeof window.googlefc.showRevocationMessage === "function") {
    window.googlefc.showRevocationMessage();
  } else {
    window.googlefc.callbackQueue.push({
      CONSENT_API_READY: () => window.googlefc?.showRevocationMessage?.(),
    });
  }

  return true;
}
