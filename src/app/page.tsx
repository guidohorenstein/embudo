import type { Metadata } from "next";
import Image from "next/image";
import { getContent } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import Gallery from "@/components/Gallery";
import LeadForm from "@/components/LeadForm";
import Tracking from "@/components/Tracking";
import CtaLink from "@/components/CtaLink";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { LEGAL_NAV } from "@/lib/legal";

// El contenido se cachea y se invalida al guardar desde el panel
// (saveContentAction llama a revalidatePath("/")), asi la landing
// no consulta la base en cada visita.
export const revalidate = 300;

const PROCESS = [
  { num: "01", title: "שיחת היכרות", text: "מספרים על הרעיון, המיקום, הגודל והסגנון שאתם אוהבים." },
  { num: "02", title: "בניית קונספט", text: "מחדדים את הכיוון ומפתחים סקיצה מקורית במיוחד עבורכם." },
  { num: "03", title: "יום הקעקוע", text: "עוברים יחד על הסקיצה, ההתאמה לגוף ומתחילים בקצב שלכם." },
  { num: "04", title: "החלמה וליווי", text: "מקבלים הנחיות ברורות וזמינות לכל שאלה לאורך ההחלמה." },
];

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      images: content.hero.image ? [content.hero.image] : undefined,
      locale: "he_IL",
      type: "website",
    },
  };
}

export default async function Page() {
  const content = await getContent();
  const { brand, hero, about, gallery, contact, tracking } = content;
  const telHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <Tracking metaPixelId={tracking.metaPixelId} ga4Id={tracking.ga4Id} gtmId={tracking.gtmId} />
      <a className="skip-link" href="#top">דילוג לתוכן</a>
      <SiteHeader name={brand.name} tagline={brand.tagline} />

      <main>
        <section className="hero" id="top">
          <div className="hero-bg">
            {hero.image ? (
              <Image
                src={hero.image}
                alt=""
                fill
                priority
                sizes="100vw"
                quality={70}
                className="hero-img"
              />
            ) : null}
          </div>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow">{hero.eyebrow}</span>
              <h1>
                {hero.titleLine1}
                <br />
                <em>{hero.titleHighlight}</em>
              </h1>
              <p>{hero.subtitle}</p>
              <div className="hero-actions">
                <CtaLink className="btn btn-primary" href="#contact">
                  {hero.primaryCta}
                </CtaLink>
                <a className="btn btn-outline" href="#gallery">
                  {hero.secondaryCta}
                </a>
              </div>
              <div className="hero-proof">
                {hero.stats.map((stat) => (
                  <div key={stat.label}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <span className="scroll-hint">SCROLL TO DISCOVER</span>
        </section>

        <section className="about" id="about">
          <div className="container about-grid">
            <div className="about-media">
              <div className="about-main">
                {about.mainImage ? (
                  <Image
                    src={about.mainImage}
                    alt="אמן קעקועים עובד בסטודיו"
                    fill
                    sizes="(max-width: 900px) 100vw, 45vw"
                    className="cover"
                  />
                ) : null}
              </div>
              <div className="about-detail">
                {about.detailImage ? (
                  <Image
                    src={about.detailImage}
                    alt="פרט של עבודת קעקוע"
                    fill
                    sizes="(max-width: 900px) 50vw, 22vw"
                    className="cover"
                  />
                ) : null}
              </div>
              <div className="about-stamp">{about.stamp}</div>
            </div>
            <div>
              <span className="eyebrow">{about.eyebrow}</span>
              <h2 className="section-title">{about.title}</h2>
              <p className="section-copy">{about.paragraph1}</p>
              <p className="section-copy">{about.paragraph2}</p>
              <ul className="about-list">
                {about.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <span className="signature">{about.signature}</span>
            </div>
          </div>
        </section>

        <section className="process" id="process">
          <div className="container">
            <div className="process-head">
              <div>
                <span className="eyebrow">THE PROCESS</span>
                <h2 className="section-title">מהרעיון ועד העור.</h2>
              </div>
              <p className="section-copy">
                תהליך מסודר שמוריד את סימני השאלה ומשאיר מקום לדבר החשוב באמת, היצירה.
              </p>
            </div>
            <div className="steps">
              {PROCESS.map((step) => (
                <article className="step" key={step.num}>
                  <span className="step-num">{step.num}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Gallery
          eyebrow={gallery.eyebrow}
          title={gallery.title}
          intro={gallery.intro}
          items={gallery.items}
        />

        <section className="lead" id="contact">
          <div className="container lead-grid">
            <div>
              <span className="eyebrow">{contact.eyebrow}</span>
              <h2 className="section-title">{contact.title}</h2>
              <p className="section-copy">{contact.intro}</p>
              <div className="contact-mini">
                <a href={telHref}>
                  <b>טלפון</b> {contact.phone}
                </a>
                <a href={`mailto:${contact.email}`}>
                  <b>אימייל</b> {contact.email}
                </a>
                <span>
                  <b>כתובת</b> {contact.address}
                </span>
              </div>
            </div>
            <LeadForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo">
              <strong>{brand.name}</strong>
              <p>סטודיו לקעקועים בעיצוב אישי, עם תהליך מדויק, יחס אנושי ואמנות שנשארת.</p>
              <div className="socials">
                {contact.socials.map((social) => (
                  <a key={social.id} href={social.url} target="_blank" rel="noopener" aria-label={social.label}>
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4>ניווט מהיר</h4>
              <div className="footer-links">
                <a href="#about">אודות</a>
                <a href="#process">התהליך</a>
                <a href="#gallery">גלריה</a>
                <a href="#contact">קביעת ייעוץ</a>
              </div>
            </div>
            <div>
              <h4>פרטים חשובים</h4>
              <div className="footer-links">
                {LEGAL_NAV.map((item) => (
                  <a key={item.slug} href={`/legal/${item.slug}`}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4>דברו איתנו</h4>
              <div className="footer-links">
                <a href={telHref}>{contact.phone}</a>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <span>{contact.address}</span>
                <span>{contact.hours}</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {brand.fullName}. כל הזכויות שמורות.</span>
            <span>עיצוב והקמה: EX Advertising</span>
          </div>
        </div>
      </footer>

      <WhatsAppFloat number={contact.whatsappNumber} message={contact.whatsappMessage} />
      <AccessibilityWidget statementHref="/legal/accessibility" />
    </>
  );
}
