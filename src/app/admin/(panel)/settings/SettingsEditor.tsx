"use client";

import { useState, useTransition } from "react";
import { type Lang } from "@/lib/i18n";
import LangTabs from "../LangTabs";
import { saveContentAction } from "../../actions";
import type { SiteContent } from "@/lib/types";

export default function SettingsEditor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  // Se edita un idioma por vez: dos campos por texto haria el formulario ilegible.
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

  const { contact, tracking } = content;

  return (
    <>
      <LangTabs lang={lang} onChange={setLang} />

      <div className="panel">
        <h2>Studio name</h2>
        <p className="hint">
          Shown in the header, the footer and the emails. It stays in English on the Hebrew site.
        </p>
        <div className="grid3">
          <label className="f">
            <span>Logo text</span>
            <input
              value={content.brand.name}
              onChange={(e) => patch((d) => void (d.brand.name = e.target.value))}
            />
          </label>
          <label className="f">
            <span>Line under the logo</span>
            <input
              value={content.brand.tagline}
              onChange={(e) => patch((d) => void (d.brand.tagline = e.target.value))}
            />
          </label>
          <label className="f">
            <span>Full legal name</span>
            <input
              value={content.brand.fullName}
              onChange={(e) => patch((d) => void (d.brand.fullName = e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="panel">
        <h2>Contact section</h2>
        <p className="hint">The copy shown next to the lead form</p>
        <div className="grid2">
          <label className="f">
            <span>Kicker (English)</span>
            <input
              value={contact.eyebrow[lang]}
              onChange={(e) => patch((d) => void (d.contact.eyebrow[lang] = e.target.value))}
            />
          </label>
          <label className="f">
            <span>Heading</span>
            <input
              dir="auto"
              value={contact.title[lang]}
              onChange={(e) => patch((d) => void (d.contact.title[lang] = e.target.value))}
            />
          </label>
        </div>
        <label className="f">
          <span>Intro text</span>
          <textarea
            dir="auto"
            value={contact.intro[lang]}
            onChange={(e) => patch((d) => void (d.contact.intro[lang] = e.target.value))}
          />
        </label>
      </div>

      <div className="panel">
        <h2>Studio details</h2>
        <p className="hint">Shown in the contact section and in the footer</p>
        <div className="grid2">
          <label className="f">
            <span>Phone</span>
            <input
              value={contact.phone}
              onChange={(e) => patch((d) => void (d.contact.phone = e.target.value))}
            />
          </label>
          <label className="f">
            <span>Email</span>
            <input
              value={contact.email}
              onChange={(e) => patch((d) => void (d.contact.email = e.target.value))}
            />
          </label>
        </div>
        <div className="grid2">
          <label className="f">
            <span>Address</span>
            <input
              dir="auto"
              value={contact.address[lang]}
              onChange={(e) => patch((d) => void (d.contact.address[lang] = e.target.value))}
            />
          </label>
          <label className="f">
            <span>Opening hours</span>
            <input
              dir="auto"
              value={contact.hours[lang]}
              onChange={(e) => patch((d) => void (d.contact.hours[lang] = e.target.value))}
            />
          </label>
        </div>
        <div className="grid2">
          <label className="f">
            <span>WhatsApp number (international format)</span>
            <input
              value={contact.whatsappNumber}
              onChange={(e) => patch((d) => void (d.contact.whatsappNumber = e.target.value))}
              placeholder="972501234567"
            />
          </label>
          <label className="f">
            <span>Pre-filled WhatsApp message</span>
            <input
              dir="auto"
              value={contact.whatsappMessage[lang]}
              onChange={(e) => patch((d) => void (d.contact.whatsappMessage[lang] = e.target.value))}
            />
          </label>
        </div>

        <h3 style={{ fontSize: ".95rem", margin: "18px 0 8px" }}>Social links</h3>
        <div className="grid3">
          {contact.socials.map((social, index) => (
            <div key={social.id}>
              <label className="f">
                <span>Label</span>
                <input
                  value={social.label}
                  onChange={(e) => patch((d) => void (d.contact.socials[index].label = e.target.value))}
                />
              </label>
              <label className="f">
                <span>URL</span>
                <input
                  value={social.url}
                  onChange={(e) => patch((d) => void (d.contact.socials[index].url = e.target.value))}
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Tattoo styles</h2>
        <p className="hint">
          The options in the form&rsquo;s style dropdown. The first one is preselected — keep the
          &ldquo;not sure yet&rdquo; option there so nobody feels forced to pick.
        </p>

        <div className="styles-list">
          {content.form.styles.map((style, index) => (
            <div className="style-row" key={index}>
              <span className="style-index">{index + 1}</span>
              <input
                dir="auto"
                value={style[lang]}
                onChange={(e) => patch((d) => void (d.form.styles[index][lang] = e.target.value))}
              />
              <button
                className="btn-a btn-ghost btn-sm"
                type="button"
                title="Move up"
                onClick={() =>
                  patch((d) => {
                    if (index === 0) return;
                    const list = d.form.styles;
                    [list[index - 1], list[index]] = [list[index], list[index - 1]];
                  })
                }
              >
                ↑
              </button>
              <button
                className="btn-a btn-ghost btn-sm"
                type="button"
                title="Move down"
                onClick={() =>
                  patch((d) => {
                    const list = d.form.styles;
                    if (index === list.length - 1) return;
                    [list[index], list[index + 1]] = [list[index + 1], list[index]];
                  })
                }
              >
                ↓
              </button>
              <button
                className="btn-a btn-ghost btn-sm"
                type="button"
                onClick={() => patch((d) => void d.form.styles.splice(index, 1))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          className="btn-a btn-ghost btn-sm"
          type="button"
          style={{ marginTop: 10 }}
          onClick={() => patch((d) => void d.form.styles.push({ he: "", en: "" }))}
        >
          + Add style
        </button>
      </div>

      <div className="panel">
        <h2>Email notifications</h2>
        <p className="hint">Every new lead is sent here. Separate multiple addresses with commas.</p>
        <label className="f">
          <span>Recipients</span>
          <input
            value={contact.notifyEmails}
            onChange={(e) => patch((d) => void (d.contact.notifyEmails = e.target.value))}
            placeholder="studio@noirink.co.il, manager@noirink.co.il"
          />
        </label>
      </div>

      <div className="panel">
        <h2>Auto-reply to the client</h2>
        <p className="hint">
          Sent in Hebrew to whoever leaves their email in the form, right after they submit. Use{" "}
          <code>{"{{name}}"}</code> to insert their name. Replies come back to the studio address
          above.
        </p>

        <label className="toggle">
          <input
            type="checkbox"
            checked={content.emails.clientEnabled}
            onChange={(e) => patch((d) => void (d.emails.clientEnabled = e.target.checked))}
          />
          <span>Send an automatic confirmation email</span>
        </label>

        {content.emails.clientEnabled ? (
          <>
            <div className="grid2">
              <label className="f">
                <span>Subject</span>
                <input
                  dir="auto"
                  value={content.emails.clientSubject[lang]}
                  onChange={(e) => patch((d) => void (d.emails.clientSubject[lang] = e.target.value))}
                />
              </label>
              <label className="f">
                <span>Heading</span>
                <input
                  dir="auto"
                  value={content.emails.clientHeading[lang]}
                  onChange={(e) => patch((d) => void (d.emails.clientHeading[lang] = e.target.value))}
                />
              </label>
            </div>
            <label className="f">
              <span>Body</span>
              <textarea
                dir="auto"
                rows={6}
                value={content.emails.clientBody[lang]}
                onChange={(e) => patch((d) => void (d.emails.clientBody[lang] = e.target.value))}
              />
            </label>
            <label className="f">
              <span>Sign-off</span>
              <textarea
                dir="auto"
                value={content.emails.clientClosing[lang]}
                onChange={(e) => patch((d) => void (d.emails.clientClosing[lang] = e.target.value))}
              />
            </label>
          </>
        ) : null}
      </div>

      <div className="panel">
        <h2>Pixels and analytics</h2>
        <p className="hint">
          Leave blank to skip loading the script. The conversion event fires automatically on form
          submit (Lead / generate_lead).
        </p>
        <div className="grid3">
          <label className="f">
            <span>Meta Pixel ID</span>
            <input
              value={tracking.metaPixelId}
              onChange={(e) => patch((d) => void (d.tracking.metaPixelId = e.target.value.trim()))}
              placeholder="1234567890"
            />
          </label>
          <label className="f">
            <span>Google Analytics 4 ID</span>
            <input
              value={tracking.ga4Id}
              onChange={(e) => patch((d) => void (d.tracking.ga4Id = e.target.value.trim()))}
              placeholder="G-XXXXXXX"
            />
          </label>
          <label className="f">
            <span>Google Tag Manager ID</span>
            <input
              value={tracking.gtmId}
              onChange={(e) => patch((d) => void (d.tracking.gtmId = e.target.value.trim()))}
              placeholder="GTM-XXXXXX"
            />
          </label>
        </div>
      </div>

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
