"use client";

import { LANGS, type Lang } from "@/lib/i18n";

const NOMBRES: Record<Lang, string> = { he: "עברית · Hebrew", en: "English" };

/**
 * Selector de idioma del editor. Se edita un idioma por vez: mostrar dos campos
 * por cada texto duplicaria el largo del formulario y lo volveria ilegible.
 */
export default function LangTabs({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (next: Lang) => void;
}) {
  return (
    <div className="lang-tabs">
      <span className="lang-tabs-label">Editing language</span>
      <div className="lang-tabs-buttons" role="group" aria-label="Editing language">
        {LANGS.map((value) => (
          <button
            key={value}
            type="button"
            className={value === lang ? "active" : undefined}
            aria-pressed={value === lang}
            onClick={() => onChange(value)}
            lang={value}
          >
            {NOMBRES[value]}
          </button>
        ))}
      </div>
      <span className="lang-tabs-hint">
        Fields below show the {lang === "he" ? "Hebrew" : "English"} version. Anything left empty in
        English falls back to Hebrew on the site.
      </span>
    </div>
  );
}
