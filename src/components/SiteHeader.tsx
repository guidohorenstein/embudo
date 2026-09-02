"use client";

import { useState } from "react";
import { track } from "@/lib/client-tracking";
import { pathFor, t, UI, type Lang } from "@/lib/i18n";

export default function SiteHeader({
  lang,
  name,
  tagline,
  logo,
}: {
  lang: Lang;
  name: string;
  tagline: string;
  logo?: string;
}) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    document.body.classList.remove("menu-open");
  };

  const links = [
    { href: "#about", label: t(UI.nav.about, lang) },
    { href: "#process", label: t(UI.nav.process, lang) },
    { href: "#gallery", label: t(UI.nav.gallery, lang) },
    { href: "#contact", label: t(UI.nav.contact, lang) },
  ];

  const other: Lang = lang === "he" ? "en" : "he";

  return (
    <header className="site-header">
      <div className="container header-inner">
        <button
          className="menu-toggle"
          type="button"
          aria-label={t(UI.menuAria, lang)}
          aria-expanded={open}
          onClick={() => {
            const next = !open;
            setOpen(next);
            document.body.classList.toggle("menu-open", next);
          }}
        >
          {open ? "×" : "☰"}
        </button>

        <nav className={open ? "nav open" : "nav"} aria-label={t(UI.navAria, lang)}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="logo" href={pathFor(lang)} aria-label={`${name} ${t(UI.homeAria, lang)}`}>
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

        <div className="header-end">
          {/* Enlace real, no boton: el buscador tiene que poder seguirlo. */}
          <a className="lang-switch" href={pathFor(other)} aria-label={t(UI.langSwitchAria, lang)} lang={other}>
            {t(UI.langSwitch, lang)}
          </a>
          <a className="header-action" href="#contact" onClick={() => track("cta_click")}>
            {t(UI.headerCta, lang)}
          </a>
        </div>
      </div>
    </header>
  );
}
