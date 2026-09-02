"use client";

import { useRef, useState } from "react";
import { captureAttribution, getVisitorId, track } from "@/lib/client-tracking";
import { t, UI, type Lang } from "@/lib/i18n";

type State = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

export default function LeadForm({ lang, styles }: { lang: Lang; styles: string[] }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const started = useRef(false);

  const onFirstInput = () => {
    if (started.current) return;
    started.current = true;
    track("form_start");
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.kind === "sending") return;
    setState({ kind: "sending" });

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          consent: undefined,
          // El idioma viaja con el lead: define en cual se le responde por mail.
          lang,
          visitorId: getVisitorId(),
          ...captureAttribution(),
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setState({ kind: "error", message: payload.error || t(UI.form.errorGeneric, lang) });
        return;
      }

      window.fbq?.("track", "Lead");
      window.gtag?.("event", "generate_lead");
      window.dataLayer?.push({ event: "generate_lead" });

      form.reset();
      started.current = false;
      setState({ kind: "sent", message: t(UI.form.sent, lang) });
    } catch {
      setState({ kind: "error", message: t(UI.form.errorNetwork, lang) });
    }
  }

  return (
    <form className="lead-form" onSubmit={onSubmit} onInput={onFirstInput}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">{t(UI.form.name, lang)}</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={t(UI.form.namePlaceholder, lang)}
            required
            maxLength={80}
          />
        </div>
        <div className="field">
          <label htmlFor="phone">{t(UI.form.phone, lang)}</label>
          <input id="phone" name="phone" type="tel" placeholder="050-000-0000" required maxLength={30} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="email">{t(UI.form.email, lang)}</label>
          <input id="email" name="email" type="email" placeholder="name@mail.com" maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="style">{t(UI.form.style, lang)}</label>
          <select id="style" name="style" defaultValue={styles[0]}>
            {styles.map((style) => (
              <option key={style}>{style}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="placement">{t(UI.form.placement, lang)}</label>
        <input
          id="placement"
          name="placement"
          type="text"
          placeholder={t(UI.form.placementPlaceholder, lang)}
          maxLength={120}
        />
      </div>

      <div className="field">
        <label htmlFor="idea">{t(UI.form.idea, lang)}</label>
        <textarea
          id="idea"
          name="idea"
          placeholder={t(UI.form.ideaPlaceholder, lang)}
          maxLength={2000}
        />
      </div>

      {/* Honeypot anti-spam: invisible para personas, tentador para bots. */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="website">{t(UI.form.honeypot, lang)}</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="privacy">
        <input type="checkbox" name="consent" required /> {t(UI.form.consent, lang)}
      </label>

      <button className="btn btn-primary" type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? t(UI.form.sending, lang) : t(UI.form.submit, lang)}
      </button>

      {state.message ? (
        <p className={state.kind === "error" ? "form-status error" : "form-status"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
