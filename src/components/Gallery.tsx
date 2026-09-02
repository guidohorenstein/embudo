"use client";

import { useEffect, useState } from "react";
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
  moreLabel,
}: {
  lang: Lang;
  eyebrow: string;
  title: string;
  intro: string;
  items: GalleryItem[];
  ctaLabel: string;
  moreLabel: string;
}) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  // Se muestran las primeras y el resto se revela a pedido: una galeria muy larga
  // empuja el formulario fuera de la pantalla y baja la conversion.
  const [visibleCount, setVisibleCount] = useState(PRIMERAS);
  const visibles = items.slice(0, visibleCount);
  const quedan = items.length - visibles.length;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

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
            <button key={item.id} className="gallery-item" type="button" onClick={() => setActive(item)}>
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
          <a className="btn btn-primary" href="#contact" onClick={() => track("cta_click")}>
            {ctaLabel}
          </a>
        </div>
      </div>

      <div
        className={active ? "lightbox open" : "lightbox"}
        role="dialog"
        aria-modal="true"
        aria-label={t(UI.lightboxAria, lang)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActive(null);
        }}
      >
        <button className="lightbox-close" type="button" aria-label={t(UI.close, lang)} onClick={() => setActive(null)}>
          ×
        </button>
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active.image} alt={t(active.alt, lang) || t(active.caption, lang)} />
        ) : null}
      </div>
    </section>
  );
}
