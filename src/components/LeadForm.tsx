"use client";

import { useRef, useState } from "react";
import { captureAttribution, getVisitorId, track } from "@/lib/client-tracking";

const STYLES = ["עדיין לא בטוח/ה", "פיין ליין", "בלאקוורק", "ריאליזם", "קאבר"];

type State = { kind: "idle" | "sending" | "sent" | "error"; message?: string };

export default function LeadForm() {
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
          visitorId: getVisitorId(),
          ...captureAttribution(),
        }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setState({ kind: "error", message: payload.error || "אירעה שגיאה. נסו שוב או התקשרו אלינו." });
        return;
      }

      window.fbq?.("track", "Lead");
      window.gtag?.("event", "generate_lead");
      window.dataLayer?.push({ event: "generate_lead" });

      form.reset();
      started.current = false;
      setState({ kind: "sent", message: "תודה, הפרטים התקבלו. נחזור אליכם בהקדם." });
    } catch {
      setState({ kind: "error", message: "אין חיבור לשרת. נסו שוב בעוד רגע." });
    }
  }

  return (
    <form className="lead-form" onSubmit={onSubmit} onInput={onFirstInput} noValidate={false}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="name">שם מלא *</label>
          <input id="name" name="name" type="text" placeholder="איך קוראים לך?" required maxLength={80} />
        </div>
        <div className="field">
          <label htmlFor="phone">טלפון *</label>
          <input id="phone" name="phone" type="tel" placeholder="050-000-0000" required maxLength={30} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="email">אימייל</label>
          <input id="email" name="email" type="email" placeholder="name@mail.com" maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="style">סגנון מועדף</label>
          <select id="style" name="style" defaultValue={STYLES[0]}>
            {STYLES.map((style) => (
              <option key={style}>{style}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="placement">מיקום בגוף</label>
        <input id="placement" name="placement" type="text" placeholder="לדוגמה: אמה פנימית" maxLength={120} />
      </div>

      <div className="field">
        <label htmlFor="idea">ספרו לי על הרעיון</label>
        <textarea
          id="idea"
          name="idea"
          placeholder="רעיון, גודל משוער, משמעות וכל פרט שיכול לעזור..."
          maxLength={2000}
        />
      </div>

      {/* Honeypot anti-spam: invisible para personas, tentador para bots. */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label htmlFor="website">אתר</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="privacy">
        <input type="checkbox" name="consent" required /> אני מאשר/ת קבלת פנייה בנוגע לבקשה שלי ומסכים/ה
        למדיניות הפרטיות.
      </label>

      <button className="btn btn-primary" type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "שולח..." : "שליחת פרטים וקביעת שיחה ←"}
      </button>

      {state.message ? (
        <p className={state.kind === "error" ? "form-status error" : "form-status"} role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
