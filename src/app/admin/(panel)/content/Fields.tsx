"use client";

import type { L, Lang } from "@/lib/i18n";

/**
 * Campos del editor. Cada uno muestra el idioma que se esta editando y escribe
 * solo esa mitad del par {he, en}, para que el formulario no duplique su largo.
 */

export function Text({
  label,
  hint,
  value,
  lang,
  onChange,
  rows,
}: {
  label: string;
  hint?: string;
  value: L;
  lang: Lang;
  onChange: (next: string) => void;
  rows?: number;
}) {
  const vacioEnIngles = lang === "en" && !value.en?.trim();

  return (
    <label className="f">
      <span>
        {label}
        {hint ? <em className="field-hint">{hint}</em> : null}
      </span>
      {rows ? (
        <textarea
          dir="auto"
          rows={rows}
          value={value[lang] ?? ""}
          placeholder={vacioEnIngles ? value.he : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          dir="auto"
          value={value[lang] ?? ""}
          placeholder={vacioEnIngles ? value.he : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {vacioEnIngles ? <em className="field-fallback">Empty — the Hebrew text will be shown</em> : null}
    </label>
  );
}

export function Plain({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="f">
      <span>
        {label}
        {hint ? <em className="field-hint">{hint}</em> : null}
      </span>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

/** Encabezado de bloque, para que se entienda a que parte de la pagina pertenece. */
export function Block({
  title,
  where,
  children,
}: {
  title: string;
  where: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      <p className="hint">{where}</p>
      {children}
    </div>
  );
}
