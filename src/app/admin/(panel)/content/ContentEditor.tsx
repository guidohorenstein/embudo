"use client";

import { useState, useTransition } from "react";
import { type Lang } from "@/lib/i18n";
import { saveContentAction } from "../../actions";
import type { SiteContent } from "@/lib/types";
import LangTabs from "../LangTabs";
import ImageField from "./ImageField";
import { Block, Plain, Text } from "./Fields";

/**
 * Un solo editor para todo el texto del sitio, ordenado igual que la pagina:
 * arriba lo que el visitante ve primero, abajo el pie y los mails. Cada bloque
 * dice a que parte de la pagina pertenece.
 */
export default function ContentEditor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [lang, setLang] = useState<Lang>("he");
  const [pending, startTransition] = useTransition();

  const patch = (updater: (draft: SiteContent) => void) =>
    setContent((prev) => {
      const next = structuredClone(prev);
      updater(next);
      return next;
    });

  const save = () =>
    startTransition(async () => {
      const result = await saveContentAction(JSON.stringify(content));
      setStatus(result.ok ? "saved" : "error");
    });

  const move = (index: number, delta: number) =>
    patch((draft) => {
      const target = index + delta;
      const items = draft.gallery.items;
      if (target < 0 || target >= items.length) return;
      [items[index], items[target]] = [items[target], items[index]];
    });

  return (
    <>
      <LangTabs lang={lang} onChange={setLang} />

      <Block title="Search engines" where="The title and description Google shows, and what appears when the link is shared">
        <Text label="Page title" value={content.seo.title} lang={lang} onChange={(v) => patch((d) => void (d.seo.title[lang] = v))} />
        <Text label="Description" value={content.seo.description} lang={lang} rows={3} onChange={(v) => patch((d) => void (d.seo.description[lang] = v))} />
      </Block>

      <Block title="Header and menu" where="The bar fixed at the top of every page">
        <div className="grid2">
          <Text label="Menu · About" value={content.ui.nav.about} lang={lang} onChange={(v) => patch((d) => void (d.ui.nav.about[lang] = v))} />
          <Text label="Menu · Process" value={content.ui.nav.process} lang={lang} onChange={(v) => patch((d) => void (d.ui.nav.process[lang] = v))} />
          <Text label="Menu · Work" value={content.ui.nav.gallery} lang={lang} onChange={(v) => patch((d) => void (d.ui.nav.gallery[lang] = v))} />
          <Text label="Menu · Contact" value={content.ui.nav.contact} lang={lang} onChange={(v) => patch((d) => void (d.ui.nav.contact[lang] = v))} />
        </div>
        <Text label="Button on the right" hint="hidden on phones so it does not crowd the logo" value={content.ui.headerCta} lang={lang} onChange={(v) => patch((d) => void (d.ui.headerCta[lang] = v))} />
      </Block>

      <Block title="Hero" where="The first screen a visitor sees">
        <ImageField label="Background image" value={content.hero.image} onChange={(url) => patch((d) => void (d.hero.image = url))} />
        <Text label="Kicker" hint="small line above the title" value={content.hero.eyebrow} lang={lang} onChange={(v) => patch((d) => void (d.hero.eyebrow[lang] = v))} />
        <div className="grid2">
          <Text label="Title · first line" value={content.hero.titleLine1} lang={lang} onChange={(v) => patch((d) => void (d.hero.titleLine1[lang] = v))} />
          <Text label="Title · highlighted line" hint="shown in red" value={content.hero.titleHighlight} lang={lang} onChange={(v) => patch((d) => void (d.hero.titleHighlight[lang] = v))} />
        </div>
        <Text label="Subtitle" value={content.hero.subtitle} lang={lang} rows={3} onChange={(v) => patch((d) => void (d.hero.subtitle[lang] = v))} />
        <div className="grid2">
          <Text label="Main button" value={content.hero.primaryCta} lang={lang} onChange={(v) => patch((d) => void (d.hero.primaryCta[lang] = v))} />
          <Text label="Secondary button" value={content.hero.secondaryCta} lang={lang} onChange={(v) => patch((d) => void (d.hero.secondaryCta[lang] = v))} />
        </div>
        <Text label="Scroll hint" hint="vertical text at the bottom" value={content.ui.scrollHint} lang={lang} onChange={(v) => patch((d) => void (d.ui.scrollHint[lang] = v))} />

        <h3 className="sub">The three numbers</h3>
        <div className="grid3">
          {content.hero.stats.map((stat, i) => (
            <div key={i}>
              <Plain label={`Number ${i + 1}`} value={stat.value} onChange={(v) => patch((d) => void (d.hero.stats[i].value = v))} />
              <Text label={`Caption ${i + 1}`} value={stat.label} lang={lang} onChange={(v) => patch((d) => void (d.hero.stats[i].label[lang] = v))} />
            </div>
          ))}
        </div>
      </Block>

      <Block title="About the studio" where="Second section, with the two photos">
        <div className="grid2">
          <ImageField label="Main photo" value={content.about.mainImage} onChange={(url) => patch((d) => void (d.about.mainImage = url))} />
          <ImageField label="Detail photo" value={content.about.detailImage} onChange={(url) => patch((d) => void (d.about.detailImage = url))} />
        </div>
        <div className="grid2">
          <Text label="Kicker" value={content.about.eyebrow} lang={lang} onChange={(v) => patch((d) => void (d.about.eyebrow[lang] = v))} />
          <Text label="Round stamp" hint="the red circle over the photo" value={content.about.stamp} lang={lang} onChange={(v) => patch((d) => void (d.about.stamp[lang] = v))} />
        </div>
        <Text label="Heading" value={content.about.title} lang={lang} onChange={(v) => patch((d) => void (d.about.title[lang] = v))} />
        <Text label="First paragraph" value={content.about.paragraph1} lang={lang} rows={3} onChange={(v) => patch((d) => void (d.about.paragraph1[lang] = v))} />
        <Text label="Second paragraph" value={content.about.paragraph2} lang={lang} rows={3} onChange={(v) => patch((d) => void (d.about.paragraph2[lang] = v))} />
        <div className="grid2">
          {content.about.bullets.map((bullet, i) => (
            <Text key={i} label={`Bullet ${i + 1}`} value={bullet} lang={lang} onChange={(v) => patch((d) => void (d.about.bullets[i][lang] = v))} />
          ))}
        </div>
      </Block>

      <Block title="The process" where="The four numbered steps">
        <div className="grid2">
          <Text label="Kicker" value={content.ui.process.eyebrow} lang={lang} onChange={(v) => patch((d) => void (d.ui.process.eyebrow[lang] = v))} />
          <Text label="Heading" value={content.ui.process.title} lang={lang} onChange={(v) => patch((d) => void (d.ui.process.title[lang] = v))} />
        </div>
        <Text label="Intro" value={content.ui.process.intro} lang={lang} rows={2} onChange={(v) => patch((d) => void (d.ui.process.intro[lang] = v))} />
        <div className="grid2">
          {content.ui.process.steps.map((step, i) => (
            <div key={i}>
              <Text label={`Step ${i + 1} · title`} value={step.title} lang={lang} onChange={(v) => patch((d) => void (d.ui.process.steps[i].title[lang] = v))} />
              <Text label={`Step ${i + 1} · text`} value={step.text} lang={lang} rows={2} onChange={(v) => patch((d) => void (d.ui.process.steps[i].text[lang] = v))} />
            </div>
          ))}
        </div>
      </Block>

      <Block title="Gallery" where="The grid of work. The first six show right away, the rest behind a button.">
        <div className="grid2">
          <Text label="Kicker" value={content.gallery.eyebrow} lang={lang} onChange={(v) => patch((d) => void (d.gallery.eyebrow[lang] = v))} />
          <Text label="Heading" value={content.gallery.title} lang={lang} onChange={(v) => patch((d) => void (d.gallery.title[lang] = v))} />
        </div>
        <div className="grid2">
          <Text label="Intro" value={content.gallery.intro} lang={lang} onChange={(v) => patch((d) => void (d.gallery.intro[lang] = v))} />
          <Text label="Show more button" value={content.ui.galleryMore} lang={lang} onChange={(v) => patch((d) => void (d.ui.galleryMore[lang] = v))} />
        </div>
        <Text label="Button under the gallery" value={content.ui.galleryCta} lang={lang} onChange={(v) => patch((d) => void (d.ui.galleryCta[lang] = v))} />

        <h3 className="sub">Pieces ({content.gallery.items.length})</h3>
        <div className="thumbs">
          {content.gallery.items.map((item, i) => (
            <div className="thumb" key={item.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image || "data:,"} alt="" />
              <div className="thumb-body">
                <span className="thumb-pos">#{i + 1}</span>
                <ImageField label="" compact value={item.image} onChange={(url) => patch((d) => void (d.gallery.items[i].image = url))} />
                <input dir="auto" placeholder="Caption" value={item.caption[lang] ?? ""} onChange={(e) => patch((d) => void (d.gallery.items[i].caption[lang] = e.target.value))} />
                <input dir="auto" placeholder="Alt text" value={item.alt[lang] ?? ""} onChange={(e) => patch((d) => void (d.gallery.items[i].alt[lang] = e.target.value))} />
                <div className="row">
                  <button className="btn-a btn-ghost btn-sm" type="button" title="Move earlier" onClick={() => move(i, -1)}>←</button>
                  <button className="btn-a btn-ghost btn-sm" type="button" title="Move later" onClick={() => move(i, 1)}>→</button>
                  <button className="btn-a btn-ghost btn-sm" type="button" onClick={() => patch((d) => void d.gallery.items.splice(i, 1))}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn-a btn-ghost btn-sm"
          type="button"
          style={{ marginTop: 14 }}
          onClick={() =>
            patch((d) =>
              void d.gallery.items.push({
                id: crypto.randomUUID(),
                image: "",
                caption: { he: "", en: "" },
                alt: { he: "", en: "" },
              }),
            )
          }
        >
          + Add piece
        </button>
      </Block>

      <Block title="Contact section" where="The copy next to the form">
        <div className="grid2">
          <Text label="Kicker" value={content.contact.eyebrow} lang={lang} onChange={(v) => patch((d) => void (d.contact.eyebrow[lang] = v))} />
          <Text label="Heading" value={content.contact.title} lang={lang} onChange={(v) => patch((d) => void (d.contact.title[lang] = v))} />
        </div>
        <Text label="Intro" value={content.contact.intro} lang={lang} rows={2} onChange={(v) => patch((d) => void (d.contact.intro[lang] = v))} />

        <h3 className="sub">Studio details shown on the page</h3>
        <div className="grid2">
          <Plain label="Phone" value={content.contact.phone} onChange={(v) => patch((d) => void (d.contact.phone = v))} />
          <Plain label="Email" value={content.contact.email} onChange={(v) => patch((d) => void (d.contact.email = v))} />
          <Text label="Address" value={content.contact.address} lang={lang} onChange={(v) => patch((d) => void (d.contact.address[lang] = v))} />
          <Text label="Opening hours" value={content.contact.hours} lang={lang} onChange={(v) => patch((d) => void (d.contact.hours[lang] = v))} />
        </div>
        <div className="grid3">
          <Text label="Label · phone" value={content.ui.contactLabels.phone} lang={lang} onChange={(v) => patch((d) => void (d.ui.contactLabels.phone[lang] = v))} />
          <Text label="Label · email" value={content.ui.contactLabels.email} lang={lang} onChange={(v) => patch((d) => void (d.ui.contactLabels.email[lang] = v))} />
          <Text label="Label · address" value={content.ui.contactLabels.address} lang={lang} onChange={(v) => patch((d) => void (d.ui.contactLabels.address[lang] = v))} />
        </div>
      </Block>

      <Block title="The form" where="Every label the visitor reads while filling it in">
        <div className="grid2">
          <Text label="Name field" value={content.ui.form.name} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.name[lang] = v))} />
          <Text label="Name placeholder" value={content.ui.form.namePlaceholder} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.namePlaceholder[lang] = v))} />
          <Text label="Phone field" value={content.ui.form.phone} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.phone[lang] = v))} />
          <Text label="Phone placeholder" value={content.ui.form.phonePlaceholder} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.phonePlaceholder[lang] = v))} />
          <Text label="Email field" value={content.ui.form.email} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.email[lang] = v))} />
          <Text label="Style field" value={content.ui.form.style} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.style[lang] = v))} />
          <Text label="Placement field" value={content.ui.form.placement} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.placement[lang] = v))} />
          <Text label="Placement placeholder" value={content.ui.form.placementPlaceholder} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.placementPlaceholder[lang] = v))} />
        </div>
        <Text label="Idea field" value={content.ui.form.idea} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.idea[lang] = v))} />
        <Text label="Idea placeholder" value={content.ui.form.ideaPlaceholder} lang={lang} rows={2} onChange={(v) => patch((d) => void (d.ui.form.ideaPlaceholder[lang] = v))} />
        <Text label="Consent checkbox" value={content.ui.form.consent} lang={lang} rows={2} onChange={(v) => patch((d) => void (d.ui.form.consent[lang] = v))} />
        <div className="grid2">
          <Text label="Submit button" value={content.ui.form.submit} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.submit[lang] = v))} />
          <Text label="Message after sending" value={content.ui.form.sent} lang={lang} onChange={(v) => patch((d) => void (d.ui.form.sent[lang] = v))} />
        </div>

        <h3 className="sub">Style options ({content.form.styles.length})</h3>
        <p className="hint">The first one is preselected. Keep a &ldquo;not sure yet&rdquo; option so nobody feels forced to pick.</p>
        <div className="styles-list">
          {content.form.styles.map((style, i) => (
            <div className="style-row" key={i}>
              <span className="style-index">{i + 1}</span>
              <input dir="auto" value={style[lang] ?? ""} placeholder={style.he} onChange={(e) => patch((d) => void (d.form.styles[i][lang] = e.target.value))} />
              <button className="btn-a btn-ghost btn-sm" type="button" title="Move up" onClick={() => patch((d) => { if (i === 0) return; const l = d.form.styles; [l[i - 1], l[i]] = [l[i], l[i - 1]]; })}>↑</button>
              <button className="btn-a btn-ghost btn-sm" type="button" title="Move down" onClick={() => patch((d) => { const l = d.form.styles; if (i === l.length - 1) return; [l[i], l[i + 1]] = [l[i + 1], l[i]]; })}>↓</button>
              <button className="btn-a btn-ghost btn-sm" type="button" onClick={() => patch((d) => void d.form.styles.splice(i, 1))}>Remove</button>
            </div>
          ))}
        </div>
        <button className="btn-a btn-ghost btn-sm" type="button" style={{ marginTop: 10 }} onClick={() => patch((d) => void d.form.styles.push({ he: "", en: "" }))}>
          + Add style
        </button>
      </Block>

      <Block title="Footer" where="The bottom of every page">
        <Text label="Studio blurb" value={content.ui.footer.blurb} lang={lang} rows={2} onChange={(v) => patch((d) => void (d.ui.footer.blurb[lang] = v))} />
        <div className="grid3">
          <Text label="Column 1 heading" value={content.ui.footer.quickNav} lang={lang} onChange={(v) => patch((d) => void (d.ui.footer.quickNav[lang] = v))} />
          <Text label="Column 2 heading" value={content.ui.footer.important} lang={lang} onChange={(v) => patch((d) => void (d.ui.footer.important[lang] = v))} />
          <Text label="Column 3 heading" value={content.ui.footer.talk} lang={lang} onChange={(v) => patch((d) => void (d.ui.footer.talk[lang] = v))} />
        </div>
        <div className="grid3">
          <Text label="Book link" value={content.ui.footer.bookCta} lang={lang} onChange={(v) => patch((d) => void (d.ui.footer.bookCta[lang] = v))} />
          <Text label="Rights notice" value={content.ui.footer.rights} lang={lang} onChange={(v) => patch((d) => void (d.ui.footer.rights[lang] = v))} />
          <Text label="Credit" value={content.ui.footer.credit} lang={lang} onChange={(v) => patch((d) => void (d.ui.footer.credit[lang] = v))} />
        </div>
      </Block>

      <Block title="WhatsApp button" where="The floating green button at the bottom of the screen">
        <Text label="Pre-filled message" value={content.contact.whatsappMessage} lang={lang} rows={2} onChange={(v) => patch((d) => void (d.contact.whatsappMessage[lang] = v))} />
      </Block>

      <Block title="Automatic reply to the client" where="Sent to whoever leaves their email in the form">
        <label className="toggle">
          <input type="checkbox" checked={content.emails.clientEnabled} onChange={(e) => patch((d) => void (d.emails.clientEnabled = e.target.checked))} />
          <span>Send the confirmation email</span>
        </label>
        {content.emails.clientEnabled ? (
          <>
            <div className="grid2">
              <Text label="Subject" value={content.emails.clientSubject} lang={lang} onChange={(v) => patch((d) => void (d.emails.clientSubject[lang] = v))} />
              <Text label="Heading" value={content.emails.clientHeading} lang={lang} onChange={(v) => patch((d) => void (d.emails.clientHeading[lang] = v))} />
            </div>
            <Text label="Body" hint="use {{name}} to insert their name" value={content.emails.clientBody} lang={lang} rows={6} onChange={(v) => patch((d) => void (d.emails.clientBody[lang] = v))} />
            <Text label="Sign-off" value={content.emails.clientClosing} lang={lang} rows={2} onChange={(v) => patch((d) => void (d.emails.clientClosing[lang] = v))} />
          </>
        ) : null}
      </Block>

      <div className="sticky-save">
        <button className="btn-a" type="button" onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </button>
        {status === "saved" && !pending ? <span className="saved">Saved ✓</span> : null}
        {status === "error" && !pending ? <span className="failed">Could not save</span> : null}
      </div>
    </>
  );
}
