"use client";

import { useState } from "react";
import { track } from "@/lib/client-tracking";

const LINKS = [
  { href: "#about", label: "אודות" },
  { href: "#process", label: "התהליך" },
  { href: "#gallery", label: "עבודות" },
  { href: "#contact", label: "יצירת קשר" },
];

export default function SiteHeader({
  name,
  tagline,
  logo,
}: {
  name: string;
  tagline: string;
  logo?: string;
}) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    document.body.classList.remove("menu-open");
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          className="menu-toggle"
          type="button"
          aria-label="פתיחת תפריט"
          aria-expanded={open}
          onClick={() => {
            const next = !open;
            setOpen(next);
            document.body.classList.toggle("menu-open", next);
          }}
        >
          {open ? "×" : "☰"}
        </button>

        <nav className={open ? "nav open" : "nav"} aria-label="ניווט ראשי">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="logo" href="#top" aria-label={`${name} דף הבית`}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="logo-img" src={logo} alt={name} width={900} height={158} />
          ) : (
            <>
              <strong>{name}</strong>
              <span>{tagline}</span>
            </>
          )}
        </a>

        <a className="header-action" href="#contact" onClick={() => track("cta_click")}>
          קביעת פגישת ייעוץ
        </a>
      </div>
    </header>
  );
}
