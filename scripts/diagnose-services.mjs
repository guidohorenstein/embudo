import postgres from "postgres";
import { readFileSync } from "node:fs";

const url = process.env.DATABASE_URL;
if (url) {
  const pooled = /pooler\.|:6543|pgbouncer=true/.test(url);
  const sql = postgres(url, { max: 1, prepare: !pooled, connect_timeout: 10 });
  try {
    const tables = await sql`select tablename from pg_tables where schemaname = 'public'`;
    console.log("Database tables:", tables.map((r) => r.tablename));
    const columns = await sql`select column_name from information_schema.columns where table_schema = 'public' and table_name = 'leads'`;
    console.log("Lead columns:", columns.map((r) => r.column_name));
    const [row] = await sql`select value from content where key = 'site'`;
    const content = row?.value;
    if (content) {
      console.log("Contact:", JSON.stringify({ phone: content.contact?.phone, address: content.contact?.address, mapUrl: content.contact?.mapUrl, hasRecipients: Boolean(content.contact?.notifyEmails) }));
      const images = [content.hero?.image, content.about?.mainImage, content.about?.detailImage, ...(content.gallery?.items ?? []).map((item) => item.image)].filter(Boolean);
      for (const image of [...new Set(images)]) {
        if (image.startsWith("/api/media/")) {
          const [media] = await sql`select mime, size from media where id = ${image.split("/").pop()}`;
          console.log("Image:", image, media ? `${media.mime}, ${media.size} bytes` : "MISSING");
        } else if (image.startsWith("https://")) {
          try {
            const response = await fetch(image, { method: "HEAD", signal: AbortSignal.timeout(15000) });
            console.log("Image:", image, response.status, response.headers.get("content-type"));
          } catch (error) { console.log("Image:", image, error.message); }
        }
      }
    }
    const statuses = await sql`select mail_status, client_mail_status, count(*)::int as count from leads group by mail_status, client_mail_status`;
    console.log("Delivery counts:", statuses);
    const errors = await sql`select distinct mail_error from leads where mail_error is not null limit 5`;
    console.log("Delivery errors:", errors);
  } catch (error) {
    console.log("Database error:", { code: error.code, message: error.message });
    process.exitCode = 1;
  } finally { await sql.end({ timeout: 2 }); }
} else { console.log("DATABASE_URL missing"); process.exitCode = 1; }

if (process.env.RESEND_API_KEY) {
  try {
    const response = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` }, signal: AbortSignal.timeout(15000) });
    const body = await response.json();
    console.log("Resend domains:", response.status, body.data?.map(({ name, status }) => ({ name, status })) ?? { message: body.message });
  } catch (error) { console.log("Resend error:", error.message); }
}

const defaults = readFileSync(new URL("../src/lib/content.ts", import.meta.url), "utf8");
const images = [...new Set(defaults.match(/https:\/\/images\.unsplash\.com\/[^"\s]+/g))];
await Promise.all(images.map(async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15000) });
    console.log("Default image:", url, response.status, response.headers.get("content-type"));
  } catch (error) { console.log("Default image:", url, error.message); }
}));
