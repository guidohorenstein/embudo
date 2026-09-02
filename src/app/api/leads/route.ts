import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { getContent } from "@/lib/content";
import { sendClientEmail, sendLeadEmail } from "@/lib/mail";
import type { Lead } from "@/lib/types";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  style: z.string().trim().max(80).optional(),
  placement: z.string().trim().max(120).optional(),
  idea: z.string().trim().max(2000).optional(),
  website: z.string().max(200).optional(), // honeypot
  visitorId: z.string().max(64).optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  referrer: z.string().max(300).optional(),
});

/**
 * Limite anti-spam contado en la base, no en memoria: en Vercel cada request
 * puede tocar una instancia distinta, asi que un contador en memoria no ve
 * los envios anteriores y el limite nunca se aplica.
 */
async function rateLimited(ip: string) {
  if (ip === "unknown") return false;

  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count
    from leads
    where ip = ${ip} and created_at > now() - interval '10 minutes'
  `;
  return count >= 5;
}

/** Evita el doble envio por doble click o por recargar la pagina. */
async function isDuplicate(phone: string, name: string) {
  const [{ count }] = await sql<{ count: number }[]>`
    select count(*)::int as count
    from leads
    where phone = ${phone} and name = ${name} and created_at > now() - interval '2 minutes'
  `;
  return count > 0;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "בקשה לא תקינה" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "אנא מלאו שם וטלפון תקינים." }, { status: 400 });
  }

  const data = parsed.data;
  // Bot: completo el campo trampa. Respondo ok para no darle pistas.
  if (data.website) return NextResponse.json({ ok: true });

  try {
    if (await rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "יותר מדי בקשות. נסו שוב מאוחר יותר." },
        { status: 429 },
      );
    }

    // Un reenvio identico se responde como exito: para la persona el mensaje
    // ya llego, y no ensucia el panel con duplicados.
    if (await isDuplicate(data.phone, data.name)) return NextResponse.json({ ok: true });

    const [lead] = await sql<Lead[]>`
      insert into leads
        (name, phone, email, style, placement, idea,
         utm_source, utm_medium, utm_campaign, utm_term, utm_content,
         referrer, visitor_id, user_agent, ip)
      values
        (${data.name}, ${data.phone}, ${data.email || null}, ${data.style || null},
         ${data.placement || null}, ${data.idea || null},
         ${data.utm_source || null}, ${data.utm_medium || null}, ${data.utm_campaign || null},
         ${data.utm_term || null}, ${data.utm_content || null},
         ${data.referrer || null}, ${data.visitorId || null},
         ${request.headers.get("user-agent")?.slice(0, 400) || null}, ${ip})
      returning *
    `;

    const content = await getContent();
    const recipients = content.contact.notifyEmails
      .split(/[,;\s]+/)
      .map((value) => value.trim())
      .filter((value) => value.includes("@"));

    const origin = request.headers.get("origin") || new URL(request.url).origin;

    // Los dos mails salen en paralelo: la notificacion al estudio y, si la persona
    // dejo direccion y esta habilitado en el panel, la confirmacion para ella.
    const wantsClientEmail = content.emails.clientEnabled && Boolean(lead.email);
    const [result, clientResult] = await Promise.all([
      sendLeadEmail(lead, recipients, `${origin}/admin/leads/${lead.id}`),
      wantsClientEmail ? sendClientEmail(lead, content) : Promise.resolve(null),
    ]);

    await sql`
      update leads
      set mail_status        = ${result.ok ? "sent" : "failed"},
          mail_error         = ${result.ok ? null : (result.error ?? null)},
          client_mail_status = ${clientResult ? (clientResult.ok ? "sent" : "failed") : "skipped"},
          client_mail_error  = ${clientResult && !clientResult.ok ? (clientResult.error ?? null) : null},
          updated_at         = now()
      where id = ${lead.id}
    `;

    if (!result.ok) console.error("El lead se guardo pero el mail al estudio fallo:", result.error);
    if (clientResult && !clientResult.ok) {
      console.error("La confirmacion al cliente fallo:", clientResult.error);
    }

    // El lead quedo guardado: para el visitante el envio fue exitoso aunque el mail falle.
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error guardando el lead:", error);
    return NextResponse.json(
      { ok: false, error: "אירעה שגיאה בשמירת הפנייה. נסו שוב או התקשרו אלינו." },
      { status: 500 },
    );
  }
}
