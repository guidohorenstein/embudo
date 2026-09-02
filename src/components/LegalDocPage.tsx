import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { getLegalDoc, legalNav, LEGAL_SLUGS, type LegalSlug } from "@/lib/legal";
import { dirOf, pathFor, t, UI, type Lang } from "@/lib/i18n";

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

export default async function LegalDocPage({ slug, lang }: { slug: string; lang: Lang }) {
  if (!isLegalSlug(slug)) notFound();

  const content = await getContent();
  const doc = getLegalDoc(slug, content, lang);

  return (
    <div className="legal" lang={lang} dir={dirOf(lang)}>
      <a className="skip-link" href="#legal-content">
        {t(UI.skip, lang)}
      </a>

      <header className="legal-header">
        <div className="container legal-header-inner">
          <Link className="legal-logo" href={pathFor(lang)}>
            {content.brand.headerLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="logo-img"
                src={content.brand.headerLogo}
                alt={content.brand.name}
                width={900}
                height={158}
              />
            ) : (
              <>
                <strong>{content.brand.name}</strong>
                <span>{content.brand.tagline}</span>
              </>
            )}
          </Link>
          <Link className="legal-back" href={pathFor(lang)}>
            {t(UI.legal.back, lang)}
          </Link>
        </div>
      </header>

      <main className="container legal-body" id="legal-content">
        <p className="eyebrow">{content.brand.fullName}</p>
        <h1>{doc.title}</h1>
        <p className="legal-updated">
          {t(UI.legal.updated, lang)}: {doc.updated}
        </p>
        <p className="legal-intro">{doc.intro}</p>

        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        ))}

        <nav className="legal-nav" aria-label={t(UI.legal.moreAria, lang)}>
          <h2>{t(UI.legal.more, lang)}</h2>
          <ul>
            {legalNav(lang)
              .filter((item) => item.slug !== doc.slug)
              .map((item) => (
                <li key={item.slug}>
                  <Link href={pathFor(lang, `legal/${item.slug}`)}>{item.label}</Link>
                </li>
              ))}
          </ul>
        </nav>
      </main>

      <footer className="legal-foot">
        <div className="container">
          © {new Date().getFullYear()} {content.brand.fullName} · {content.contact.phone} ·{" "}
          <a href={`mailto:${content.contact.email}`}>{content.contact.email}</a>
        </div>
      </footer>
    </div>
  );
}
