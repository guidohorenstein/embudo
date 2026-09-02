"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Panel de accesibilidad. Las preferencias se aplican como clases y variables
 * sobre <html>, asi el CSS hace todo el trabajo y no hay que tocar componentes.
 * Se guardan en localStorage para que sobrevivan a la navegacion.
 */

type Prefs = {
  scale: number;
  contrast: boolean;
  links: boolean;
  readable: boolean;
  noMotion: boolean;
  bigCursor: boolean;
};

const DEFAULTS: Prefs = {
  scale: 1,
  contrast: false,
  links: false,
  readable: false,
  noMotion: false,
  bigCursor: false,
};

const SCALES = [1, 1.15, 1.3, 1.5];
const KEY = "a11y-prefs";

export default function AccessibilityWidget({ statementHref }: { statementHref: string }) {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const apply = useCallback((next: Prefs) => {
    const root = document.documentElement;
    root.style.setProperty("--a11y-scale", String(next.scale));
    root.classList.toggle("a11y-contrast", next.contrast);
    root.classList.toggle("a11y-links", next.links);
    root.classList.toggle("a11y-readable", next.readable);
    root.classList.toggle("a11y-no-motion", next.noMotion);
    root.classList.toggle("a11y-cursor", next.bigCursor);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = { ...DEFAULTS, ...(JSON.parse(saved) as Partial<Prefs>) };
        setPrefs(parsed);
        apply(parsed);
      }
    } catch {
      /* modo privado o almacenamiento bloqueado */
    }
  }, [apply]);

  const update = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    apply(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* no se puede guardar, pero la preferencia igual queda aplicada */
    }
  };

  const reset = () => {
    setPrefs(DEFAULTS);
    apply(DEFAULTS);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignorado */
    }
  };

  // Escape cierra y devuelve el foco al boton, como espera un lector de pantalla.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggles: { key: keyof Prefs; label: string }[] = [
    { key: "contrast", label: "ניגודיות גבוהה" },
    { key: "links", label: "הדגשת קישורים" },
    { key: "readable", label: "גופן קריא" },
    { key: "noMotion", label: "עצירת אנימציות" },
    { key: "bigCursor", label: "סמן עכבר גדול" },
  ];

  return (
    <>
      <button
        ref={buttonRef}
        className="float accessibility"
        type="button"
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="תפריט נגישות"
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M20.5 7.3a1 1 0 0 0-1.2-.75L15 7.6a12 12 0 0 1-6 0L4.7 6.55a1 1 0 1 0-.46 1.94L8 9.4v3.03L6.1 19.6a1 1 0 0 0 1.93.52L9.9 13.9h4.2l1.87 6.22a1 1 0 0 0 1.93-.52L16 12.43V9.4l3.76-.9a1 1 0 0 0 .74-1.2Z" />
        </svg>
        <span className="float-label">אפשרויות נגישות</span>
      </button>

      {open ? (
        <div className="a11y-panel" id="a11y-panel" role="dialog" aria-label="אפשרויות נגישות" ref={panelRef}>
          <div className="a11y-head">
            <strong>נגישות</strong>
            <button type="button" onClick={() => setOpen(false)} aria-label="סגירת התפריט">
              ×
            </button>
          </div>

          <div className="a11y-group">
            <span className="a11y-label">גודל טקסט</span>
            <div className="a11y-sizes">
              {SCALES.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={prefs.scale === value ? "active" : undefined}
                  onClick={() => update({ scale: value })}
                  aria-pressed={prefs.scale === value}
                >
                  {Math.round(value * 100)}%
                </button>
              ))}
            </div>
          </div>

          <div className="a11y-group">
            {toggles.map((item) => (
              <label className="a11y-toggle" key={item.key}>
                <input
                  type="checkbox"
                  checked={Boolean(prefs[item.key])}
                  onChange={(event) => update({ [item.key]: event.target.checked } as Partial<Prefs>)}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>

          <div className="a11y-foot">
            <button type="button" className="a11y-reset" onClick={reset}>
              איפוס הגדרות
            </button>
            <a href={statementHref}>הצהרת נגישות</a>
          </div>
        </div>
      ) : null}
    </>
  );
}
