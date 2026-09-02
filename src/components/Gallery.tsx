"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { track } from "@/lib/client-tracking";
import { t, UI, type Lang } from "@/lib/i18n";
import type { GalleryItem } from "@/lib/types";

// La primera pieza ocupa dos filas de la grilla: con cinco queda cerrada,
// con seis sobra una sola imagen en una fila nueva.
const PRIMERAS = 5;

export default function Gallery({
  lang,
  eyebrow,
  title,
  intro,
  items,
  ctaLabel,
  ctaHref,
  moreLabel,
}: {
  lang: Lang;
  eyebrow: string;
  title: string;
  intro: string;
  items: GalleryItem[];
  ctaLabel: string;
  ctaHref: string;
  moreLabel: string;
}) {
  // Se guarda el indice, no la pieza: hace falta para moverse entre fotos.
  const [abierta, setAbierta] = useState<number | null>(null);
  // Se muestran las primeras y el resto se revela a pedido: una galeria muy larga
  // empuja el formulario fuera de la pantalla y baja la conversion.
  const [visibleCount, setVisibleCount] = useState(PRIMERAS);
  const visibles = items.slice(0, visibleCount);
  const quedan = items.length - visibles.length;

  const cerrar = useCallback(() => setAbierta(null), []);
  const mover = useCallback(
    (paso: number) =>
      setAbierta((actual) => (actual === null ? null : (actual + paso + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (abierta === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return cerrar();
      // En hebreo la lectura va al reves, asi que las flechas se invierten
      // para coincidir con la posicion visual de los botones.
      const adelante = lang === "he" ? "ArrowLeft" : "ArrowRight";
      const atras = lang === "he" ? "ArrowRight" : "ArrowLeft";
      if (event.key === adelante) mover(1);
      if (event.key === atras) mover(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierta, cerrar, mover, lang]);

  const pieza = abierta === null ? null : items[abierta];
  const externo = /^https?:/i.test(ctaHref);

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="gallery-head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="section-title">{title}</h2>
          </div>
          <p className="section-copy">{intro}</p>
        </div>

        <div className="gallery-grid">
          {visibles.map((item, index) => (
            <button
              key={item.id}
              className="gallery-item"
              type="button"
              onClick={() => setAbierta(index)}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={t(item.alt, lang) || t(item.caption, lang)}
                  fill
                  sizes={index === 0 ? "(max-width: 560px) 100vw, 45vw" : "(max-width: 560px) 100vw, 30vw"}
                  className="cover"
                />
              ) : null}
              <span>{t(item.caption, lang)}</span>
            </button>
          ))}
        </div>

        <div className="gallery-more">
          {quedan > 0 ? (
            <>
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => setVisibleCount((n) => n + PRIMERAS)}
              >
                {moreLabel} ({quedan})
              </button>
              <span className="gallery-count">
                {t(UI.galleryCount, lang)
                  .replace("{shown}", String(visibles.length))
                  .replace("{total}", String(items.length))}
              </span>
            </>
          ) : null}
          <a
            className="btn btn-primary"
            href={ctaHref}
            target={externo ? "_blank" : undefined}
            rel={externo ? "noopener" : undefined}
            onClick={() => track("cta_click")}
          >
            {ctaLabel}
          </a>
        </div>
      </div>

      <div
        className={pieza ? "lightbox open" : "lightbox"}
        role="dialog"
        aria-modal="true"
        aria-label={t(UI.lightboxAria, lang)}
        onClick={(event) => {
          if (event.target === event.currentTarget) cerrar();
        }}
      >
        <button className="lightbox-close" type="button" aria-label={t(UI.close, lang)} onClick={cerrar}>
          ×
        </button>

        {pieza ? (
          <>
            {items.length > 1 ? (
              <button
                className="lightbox-nav prev"
                type="button"
                aria-label={t(UI.prev, lang)}
                onClick={(event) => {
                  event.stopPropagation();
                  mover(-1);
                }}
              >
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                  <path d="M15 4 L7 12 L15 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}

            <figure className="lightbox-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pieza.image} alt={t(pieza.alt, lang) || t(pieza.caption, lang)} />
              <figcaption>
                <span>{t(pieza.caption, lang)}</span>
                <span className="lightbox-index">
                  {abierta! + 1} / {items.length}
                </span>
              </figcaption>
            </figure>

            {items.length > 1 ? (
              <button
                className="lightbox-nav next"
                type="button"
                aria-label={t(UI.next, lang)}
                onClick={(event) => {
                  event.stopPropagation();
                  mover(1);
                }}
              >
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
                  <path d="M9 4 L17 12 L9 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
