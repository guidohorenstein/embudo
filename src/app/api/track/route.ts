import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  name: z.enum(["view", "cta_click", "form_start"]),
  path: z.string().max(200).optional(),
  visitorId: z.string().max(64).optional(),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  referrer: z.string().max(300).optional(),
});

export async function POST(request: Request) {
  try {
    // Quien tiene sesion de admin es el estudio mirando su propio sitio, no un
    // cliente potencial: sus visitas falsearian la tasa de conversion.
    if (await isAuthenticated()) return NextResponse.json({ ok: true, skipped: "admin" });

    // Lo mismo con el desarrollo local: no debe ensuciar las metricas reales.
    const host = request.headers.get("host") ?? "";
    if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
      return NextResponse.json({ ok: true, skipped: "local" });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ ok: false }, { status: 400 });
    const data = parsed.data;

    await sql`
      insert into events (name, path, referrer, utm_source, utm_medium, utm_campaign, visitor_id)
      values (${data.name}, ${data.path || "/"}, ${data.referrer || null},
              ${data.utm_source || null}, ${data.utm_medium || null},
              ${data.utm_campaign || null}, ${data.visitorId || null})
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("No se pudo registrar el evento:", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
