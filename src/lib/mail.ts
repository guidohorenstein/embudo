import "server-only";
import { Resend } from "resend";
import { t, type Lang } from "@/lib/i18n";
import type { Lead, SiteContent } from "@/lib/types";

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );

function row(label: string, value?: string | null) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 12px;background:#f6f4f1;font-weight:700;white-space:nowrap">${escape(label)}</td>
    <td style="padding:8px 12px">${escape(value).replace(/\n/g, "<br>")}</td>
  </tr>`;
}

export function leadEmailHtml(lead: Lead, adminUrl: string) {
  const source = [lead.utm_source, lead.utm_campaign].filter(Boolean).join(" / ");
  return `<div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;background:#f2eee7;padding:24px">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-top:6px solid #cf3028">
    <div style="padding:24px 28px 4px">
      <h1 style="margin:0;font-size:20px">פנייה חדשה מהאתר</h1>
      <p style="margin:6px 0 18px;color:#666;font-size:13px">${escape(
        new Date(lead.created_at).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" }),
      )}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px" dir="rtl">
        ${row("שם", lead.name)}
        ${row("טלפון", lead.phone)}
        ${row("אימייל", lead.email)}
        ${row("סגנון", lead.style)}
        ${row("מיקום בגוף", lead.placement)}
        ${row("הרעיון", lead.idea)}
        ${row("מקור", source || lead.referrer || "ישיר")}
      </table>
      <p style="margin:22px 0 26px">
        <a href="${escape(adminUrl)}" style="background:#cf3028;color:#fff;padding:12px 22px;text-decoration:none;font-weight:700;display:inline-block">צפייה בפנייה בפאנל</a>
      </p>
    </div>
  </div>
</div>`;
}

/** Mail de confirmacion para quien dejo los datos. Va en hebreo, RTL. */
export function clientEmailHtml(content: SiteContent, lead: Lead, lang: Lang) {
  const { emails, contact, brand } = content;
  const dir = lang === "he" ? "rtl" : "ltr";
  const paragraphs = (text: string) =>
    text
      .split(/\n{2,}|\n/)
      .filter(Boolean)
      .map((line) => `<p style="margin:0 0 12px">${escape(line)}</p>`)
      .join("");

  const body = paragraphs(t(emails.clientBody, lang).replaceAll("{{name}}", lead.name));
  const closing = paragraphs(t(emails.clientClosing, lang));

  return `<div dir="${dir}" style="font-family:Arial,Helvetica,sans-serif;background:#f2eee7;padding:24px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-top:6px solid #cf3028">
    <div style="padding:28px 30px">
      <div style="font-size:22px;font-weight:bold;letter-spacing:3px;margin-bottom:2px">${escape(brand.name)}</div>
      <div style="color:#cf3028;font-size:10px;font-weight:bold;letter-spacing:3px;margin-bottom:22px">${escape(brand.tagline)}</div>

      <h1 style="margin:0 0 16px;font-size:20px">${escape(t(emails.clientHeading, lang))}</h1>
      <div style="font-size:15px;line-height:1.6;color:#333">${body}</div>
      <div style="font-size:15px;line-height:1.6;color:#333;margin-top:20px">${closing}</div>

      <hr style="border:0;border-top:1px solid #e6e2dc;margin:26px 0 16px">
      <div style="font-size:13px;color:#777;line-height:1.7">
        ${contact.phone ? `<div>${escape(contact.phone)}</div>` : ""}
        ${t(contact.address, lang) ? `<div>${escape(t(contact.address, lang))}</div>` : ""}
        ${t(contact.hours, lang) ? `<div>${escape(t(contact.hours, lang))}</div>` : ""}
      </div>
    </div>
  </div>
</div>`;
}

export async function sendClientEmail(lead: Lead, content: SiteContent, lang: Lang) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "שירות המייל לא מוגדר (חסר RESEND_API_KEY)" };
  if (!lead.email) return { ok: false, error: "הפונה לא השאיר כתובת מייל" };

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM || "NOIR INK <onboarding@resend.dev>",
      to: [lead.email],
      // Si responden a la confirmacion, la respuesta va al estudio, no al remitente tecnico.
      replyTo: content.contact.email || undefined,
      subject: t(content.emails.clientSubject, lang),
      html: clientEmailHtml(content, lead, lang),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true as const };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "שגיאה לא ידועה" };
  }
}

export async function sendLeadEmail(lead: Lead, to: string[], adminUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "שירות המייל לא מוגדר (חסר RESEND_API_KEY)" };
  if (!to.length) return { ok: false, error: "לא הוגדרו כתובות לקבלת פניות" };

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.MAIL_FROM || "NOIR INK <onboarding@resend.dev>",
      to,
      replyTo: lead.email || undefined,
      subject: `פנייה חדשה מהאתר - ${lead.name} (${lead.phone})`,
      html: leadEmailHtml(lead, adminUrl),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true as const };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "שגיאה לא ידועה" };
  }
}
