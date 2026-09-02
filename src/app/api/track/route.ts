import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";

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
