import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content";
import { getLegalDoc, LEGAL_NAV, LEGAL_SLUGS, type LegalSlug } from "@/lib/legal";

export const revalidate = 300;

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return {};

  const content = await getContent();
  const doc = getLegalDoc(slug, content);
  return {
    title: `${doc.title} | ${content.brand.fullName}`,
    description: doc.intro.slice(0, 160),
    robots: { index: true, follow: true },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const content = await getContent();
  const doc = getLegalDoc(slug, content);

  return (
    <div className="legal">
      <a className="skip-link" href="#legal-content">
        דילוג לתוכן
      </a>

      <header className="legal-header">
        <div className="container legal-header-inner">
          <Link className="legal-logo" href="/">
            <strong>{content.brand.name}</strong>
            <span>{content.brand.tagline}</span>
          </Link>
          <Link className="legal-back" href="/">
            ← חזרה לאתר
          </Link>
        </div>
      </header>

      <main className="container legal-body" id="legal-content">
        <p className="eyebrow">{content.brand.fullName}</p>
        <h1>{doc.title}</h1>
        <p className="legal-updated">עודכן: {doc.updated}</p>
        <p className="legal-intro">{doc.intro}</p>

        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
        ))}

        <nav className="legal-nav" aria-label="מסמכים נוספים">
          <h2>מסמכים נוספים</h2>
          <ul>
            {LEGAL_NAV.filter((item) => item.slug !== doc.slug).map((item) => (
              <li key={item.slug}>
                <Link href={`/legal/${item.slug}`}>{item.label}</Link>
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
