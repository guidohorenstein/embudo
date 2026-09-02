"use client";

const VISITOR_KEY = "noir_visitor";
const ATTRIBUTION_KEY = "noir_attribution";

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
};

export function getVisitorId() {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

/** Guarda la primera atribucion de la sesion y la reutiliza en cada evento. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const) {
    const value = params.get(key);
    if (value) fromUrl[key] = value.slice(0, 200);
  }

  try {
    const stored = sessionStorage.getItem(ATTRIBUTION_KEY);
    if (Object.keys(fromUrl).length === 0 && stored) return JSON.parse(stored) as Attribution;

    const attribution: Attribution = {
      ...fromUrl,
      referrer: document.referrer && !document.referrer.includes(window.location.host)
        ? document.referrer.slice(0, 300)
        : undefined,
    };
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return fromUrl;
  }
}

export function track(name: "view" | "cta_click" | "form_start") {
  try {
    const body = JSON.stringify({
      name,
      path: window.location.pathname,
      visitorId: getVisitorId(),
      ...captureAttribution(),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  } catch {
    /* el tracking nunca debe romper la pagina */
  }
}
