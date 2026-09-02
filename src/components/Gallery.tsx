"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { track } from "@/lib/client-tracking";
import type { GalleryItem } from "@/lib/types";

export default function Gallery({
  eyebrow,
  title,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: GalleryItem[];
}) {
  const [active, setActive] = useState<GalleryItem | null>(null);

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
          {items.map((item, index) => (
            <button key={item.id} className="gallery-item" type="button" onClick={() => setActive(item)}>
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.alt || item.caption}
                  fill
                  sizes={index === 0 ? "(max-width: 560px) 100vw, 45vw" : "(max-width: 560px) 100vw, 30vw"}
                  className="cover"
                />
              ) : null}
              <span>{item.caption}</span>
            </button>
          ))}
        </div>

        <div className="gallery-more">
          <a className="btn btn-outline" href="#contact" onClick={() => track("cta_click")}>
            יש לכם רעיון? בואו נדבר
          </a>
        </div>
      </div>

      <div
        className={active ? "lightbox open" : "lightbox"}
        role="dialog"
        aria-modal="true"
        aria-label="תצוגת תמונה מוגדלת"
        onClick={(event) => {
          if (event.target === event.currentTarget) setActive(null);
        }}
      >
        <button className="lightbox-close" type="button" aria-label="סגירה" onClick={() => setActive(null)}>
          ×
        </button>
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active.image} alt={active.alt || active.caption} />
        ) : null}
      </div>
    </section>
  );
}
