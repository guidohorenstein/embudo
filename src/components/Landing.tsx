import Image from "next/image";
import { getContent } from "@/lib/content";
import SiteHeader from "@/components/SiteHeader";
import Gallery from "@/components/Gallery";
import LeadForm from "@/components/LeadForm";
import Tracking from "@/components/Tracking";
import CtaLink from "@/components/CtaLink";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import SocialIcon from "@/components/SocialIcon";
import { legalNav } from "@/lib/legal";
import { dirOf, pathFor, t, UI, type Lang } from "@/lib/i18n";

/**
 * La landing completa, parametrizada por idioma. Las rutas /(hebreo) y /en
 * son envoltorios finos sobre este componente.
 *
 * El <html> raiz declara hebreo/RTL. Para el ingles se envuelve todo en un
 * contenedor con lang y dir propios: los lectores de pantalla respetan el
 * atributo mas cercano, y el buscador se guia por las etiquetas hreflang.
 */
export default async function Landing({ lang }: { lang: Lang }) {
  const content = await getContent();
  const { brand, hero, about, gallery, contact, tracking, form, ui } = content;
  const telHref = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;
  const legalHref = (slug: string) => pathFor(lang, `legal/${slug}`);

  return (
    <div lang={lang} dir={dirOf(lang)} className={`site site-${lang}`}>
      <Tracking metaPixelId={tracking.metaPixelId} ga4Id={tracking.ga4Id} gtmId={tracking.gtmId} />
      <a className="skip-link" href="#top">
        {t(UI.skip, lang)}
      </a>
      <SiteHeader
        lang={lang}
        name={brand.name}
        tagline={brand.tagline}
        logo={brand.headerLogo}
        nav={{
          about: t(ui.nav.about, lang),
          process: t(ui.nav.process, lang),
          gallery: t(ui.nav.gallery, lang),
          contact: t(ui.nav.contact, lang),
        }}
        cta={t(ui.headerCta, lang)}
      />

      <main>
        <section className="hero" id="top">
          <div className="hero-bg">
            {hero.image ? (
              <Image src={hero.image} alt="" fill priority sizes="100vw" quality={70} className="hero-img" />
            ) : null}
          </div>
          <div className="container">
            <div className="hero-content">
              <span className="eyebrow">{t(hero.eyebrow, lang)}</span>
              <h1>
                {t(hero.titleLine1, lang)}
                <br />
                <em>{t(hero.titleHighlight, lang)}</em>
              </h1>
              <p>{t(hero.subtitle, lang)}</p>
              <div className="hero-actions">
                <CtaLink className="btn btn-primary" href="#contact">
                  {t(hero.primaryCta, lang)}
                </CtaLink>
                <a className="btn btn-outline" href="#gallery">
                  {t(hero.secondaryCta, lang)}
                </a>
              </div>
              <div className="hero-proof">
                {hero.stats.map((stat, index) => (
                  <div key={index}>
                    <strong>{stat.value}</strong>
                    <span>{t(stat.label, lang)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <span className="scroll-hint">{t(ui.scrollHint, lang)}</span>
        </section>

        <section className="about" id="about">
          <div className="container about-grid">
            <div className="about-media">
              <div className="about-main">
                {about.mainImage ? (
                  <Image
                    src={about.mainImage}
                    alt={t(about.title, lang)}
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
                    alt=""
                    fill
                    sizes="(max-width: 900px) 50vw, 22vw"
                    className="cover"
                  />
                ) : null}
              </div>
              <div className="about-stamp">{t(about.stamp, lang)}</div>
            </div>
            <div>
              <span className="eyebrow">{t(about.eyebrow, lang)}</span>
              <h2 className="section-title">{t(about.title, lang)}</h2>
              <p className="section-copy">{t(about.paragraph1, lang)}</p>
              <p className="section-copy">{t(about.paragraph2, lang)}</p>
              <ul className="about-list">
                {about.bullets.map((bullet, index) => (
                  <li key={index}>{t(bullet, lang)}</li>
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
                <span className="eyebrow">{t(ui.process.eyebrow, lang)}</span>
                <h2 className="section-title">{t(ui.process.title, lang)}</h2>
              </div>
              <p className="section-copy">{t(ui.process.intro, lang)}</p>
            </div>
            <div className="steps">
              {ui.process.steps.map((step, index) => (
                <article className="step" key={index}>
                  <span className="step-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{t(step.title, lang)}</h3>
                  <p>{t(step.text, lang)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Gallery
          lang={lang}
          eyebrow={t(gallery.eyebrow, lang)}
          title={t(gallery.title, lang)}
          intro={t(gallery.intro, lang)}
          items={gallery.items}
          ctaLabel={t(ui.galleryCta, lang)}
          moreLabel={t(ui.galleryMore, lang)}
        />

        <section className="lead" id="contact">
          <div className="container lead-grid">
            <div>
              <span className="eyebrow">{t(contact.eyebrow, lang)}</span>
              <h2 className="section-title">{t(contact.title, lang)}</h2>
              <p className="section-copy">{t(contact.intro, lang)}</p>
              <div className="contact-mini">
                <a href={telHref}>
                  <b>{t(ui.contactLabels.phone, lang)}</b> {contact.phone}
                </a>
                <a href={`mailto:${contact.email}`}>
                  <b>{t(ui.contactLabels.email, lang)}</b> {contact.email}
                </a>
                <span>
                  <b>{t(ui.contactLabels.address, lang)}</b>{" "}
                  {contact.mapUrl ? (
                    <a href={contact.mapUrl} target="_blank" rel="noopener">
                      {t(contact.address, lang)}
                    </a>
                  ) : (
                    t(contact.address, lang)
                  )}
                </span>
              </div>
            </div>
            <LeadForm
              lang={lang}
              styles={form.styles.map((style) => t(style, lang))}
              labels={Object.fromEntries(
                Object.entries(ui.form).map(([clave, valor]) => [clave, t(valor, lang)]),
              ) as Record<string, string>}
            />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo">
              {brand.footerLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="footer-logo-img"
                  src={brand.footerLogo}
                  alt={brand.fullName}
                  width={1200}
                  height={633}
                />
              ) : (
                <strong>{brand.name}</strong>
              )}
              <p>{t(ui.footer.blurb, lang)}</p>
              <div className="socials">
                {contact.socials.map((social) => (
                  <a key={social.id} href={social.url} target="_blank" rel="noopener" aria-label={social.label}>
                    <SocialIcon url={social.url} label={social.label} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4>{t(ui.footer.quickNav, lang)}</h4>
              <div className="footer-links">
                <a href="#about">{t(ui.nav.about, lang)}</a>
                <a href="#process">{t(ui.nav.process, lang)}</a>
                <a href="#gallery">{t(ui.nav.gallery, lang)}</a>
                <a href="#contact">{t(ui.footer.bookCta, lang)}</a>
              </div>
            </div>
            <div>
              <h4>{t(ui.footer.important, lang)}</h4>
              <div className="footer-links">
                {legalNav(lang).map((item) => (
                  <a key={item.slug} href={legalHref(item.slug)}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4>{t(ui.footer.talk, lang)}</h4>
              <div className="footer-links">
                <a href={telHref}>{contact.phone}</a>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                {contact.mapUrl ? (
                  <a href={contact.mapUrl} target="_blank" rel="noopener">
                    {t(contact.address, lang)}
                  </a>
                ) : (
                  <span>{t(contact.address, lang)}</span>
                )}
                <span>{t(contact.hours, lang)}</span>
              </div>
            </div>
          </div>
          {contact.quoteUrl ? (
            <div className="footer-quote">
              <a href={contact.quoteUrl} target="_blank" rel="noopener">
                {t(ui.footer.quoteLabel, lang)}
              </a>
            </div>
          ) : null}

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {brand.fullName}. {t(ui.footer.rights, lang)}
            </span>
            <span>{t(ui.footer.credit, lang)}</span>
          </div>
        </div>
      </footer>

      <WhatsAppFloat
        lang={lang}
        number={contact.whatsappNumber}
        message={t(contact.whatsappMessage, lang)}
      />
      <AccessibilityWidget lang={lang} statementHref={legalHref("accessibility")} />
    </div>
  );
}
