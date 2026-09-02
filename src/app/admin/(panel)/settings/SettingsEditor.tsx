"use client";

import { useState, useTransition } from "react";
import { saveContentAction } from "../../actions";
import type { SiteContent } from "@/lib/types";

/**
 * Solo configuracion tecnica. Todo el texto que el visitante lee se edita en
 * la pestana Website, para no tener que buscarlo en dos lugares.
 */
export default function SettingsEditor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
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

  const { brand, contact, tracking } = content;

  return (
    <>
      <div className="panel">
        <h2>Studio name and logos</h2>
        <p className="hint">
          The name stays in English in both languages. Leave a logo empty to fall back to the name in
          text.
        </p>
        <div className="grid3">
          <label className="f">
            <span>Short name</span>
            <input value={brand.name} onChange={(e) => patch((d) => void (d.brand.name = e.target.value))} />
          </label>
          <label className="f">
            <span>Line under the name</span>
            <input value={brand.tagline} onChange={(e) => patch((d) => void (d.brand.tagline = e.target.value))} />
          </label>
          <label className="f">
            <span>Full legal name</span>
            <input value={brand.fullName} onChange={(e) => patch((d) => void (d.brand.fullName = e.target.value))} />
          </label>
        </div>
        <div className="grid2">
          <label className="f">
            <span>Header logo</span>
            <input value={brand.headerLogo} onChange={(e) => patch((d) => void (d.brand.headerLogo = e.target.value))} />
          </label>
          <label className="f">
            <span>Footer logo</span>
            <input value={brand.footerLogo} onChange={(e) => patch((d) => void (d.brand.footerLogo = e.target.value))} />
          </label>
        </div>
      </div>

      <div className="panel">
        <h2>WhatsApp and social links</h2>
        <p className="hint">
          The icon is picked automatically from the URL, so Instagram, Facebook, TikTok, YouTube and X
          each show their own brand icon.
        </p>
        <label className="f" style={{ maxWidth: 320 }}>
          <span>WhatsApp number (international format)</span>
          <input
            value={contact.whatsappNumber}
            onChange={(e) => patch((d) => void (d.contact.whatsappNumber = e.target.value))}
            placeholder="972547505670"
          />
        </label>
        <div className="grid3">
          {contact.socials.map((social, index) => (
            <div key={social.id}>
              <label className="f">
                <span>Label</span>
                <input value={social.label} onChange={(e) => patch((d) => void (d.contact.socials[index].label = e.target.value))} />
              </label>
              <label className="f">
                <span>URL</span>
                <input value={social.url} onChange={(e) => patch((d) => void (d.contact.socials[index].url = e.target.value))} />
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>Email notifications</h2>
        <p className="hint">Where every new lead is sent. Several addresses separated by commas.</p>
        <label className="f">
          <span>Recipients</span>
          <input
            value={contact.notifyEmails}
            onChange={(e) => patch((d) => void (d.contact.notifyEmails = e.target.value))}
            placeholder="studio@example.com, manager@example.com"
          />
        </label>
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
            <input value={tracking.metaPixelId} onChange={(e) => patch((d) => void (d.tracking.metaPixelId = e.target.value.trim()))} placeholder="1234567890" />
          </label>
          <label className="f">
            <span>Google Analytics 4 ID</span>
            <input value={tracking.ga4Id} onChange={(e) => patch((d) => void (d.tracking.ga4Id = e.target.value.trim()))} placeholder="G-XXXXXXX" />
          </label>
          <label className="f">
            <span>Google Tag Manager ID</span>
            <input value={tracking.gtmId} onChange={(e) => patch((d) => void (d.tracking.gtmId = e.target.value.trim()))} placeholder="GTM-XXXXXX" />
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
