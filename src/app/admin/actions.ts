"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { sql } from "@/lib/db";
import { createSession, destroySession, isAuthenticated, verifyPassword } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/content";
import { sendLeadEmail } from "@/lib/mail";
import { compressImage } from "@/lib/images";
import { LEAD_STATUSES, type Lead, type LeadStatus, type SiteContent } from "@/lib/types";

async function requireAdmin() {
  if (!(await isAuthenticated())) throw new Error("Not authorized");
}

/* ---------------- Sesion ---------------- */

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!password) return { error: "Enter a password" };

  let ok = false;
  try {
    ok = await verifyPassword(password);
  } catch (error) {
    console.error(error);
    return { error: "The panel is not configured (missing ADMIN_PASSWORD_HASH)" };
  }

  if (!ok) return { error: "Wrong password" };

  await createSession();
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- Contenido ---------------- */

export type SaveState = { ok?: boolean; error?: string };

export async function saveContentAction(json: string): Promise<SaveState> {
  await requireAdmin();
  try {
    const next = JSON.parse(json) as SiteContent;
    await saveContent(next);
    revalidatePath("/");
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (error) {
    console.error("Error guardando contenido:", error);
    return { error: "Could not save. Please try again." };
  }
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export async function uploadImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file selected" };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return { error: "Unsupported format (JPG, PNG, WEBP, AVIF, GIF)" };
  if (file.size > MAX_IMAGE_BYTES) return { error: "File is too large (max 4MB)" };

  try {
    const id = randomUUID();
    const original = Buffer.from(await file.arrayBuffer());
    const { bytes, mime } = await compressImage(original, file.type);

    await sql`
      insert into media (id, filename, mime, bytes, size)
      values (${id}, ${file.name.slice(0, 200)}, ${mime}, ${bytes}, ${bytes.length})
    `;
    return { url: `/api/media/${id}` };
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    return { error: "Image upload failed" };
  }
}

/* ---------------- Mantenimiento de imagenes ---------------- */

export type MediaUsage = { count: number; bytes: number; orphans: number; orphanBytes: number };

/** Ids de imagenes realmente referenciadas por el contenido publicado. */
async function referencedMediaIds(): Promise<Set<string>> {
  const rows = await sql<{ raw: string }[]>`select value::text as raw from content where key = 'site'`;
  const ids = new Set<string>();
  for (const match of (rows[0]?.raw ?? "").matchAll(/\/api\/media\/([0-9a-f-]{36})/g)) {
    ids.add(match[1]);
  }
  return ids;
}

export async function getMediaUsage(): Promise<MediaUsage> {
  await requireAdmin();

  const referenced = await referencedMediaIds();
  const rows = await sql<{ id: string; size: number; recent: boolean }[]>`
    select id, size, created_at > now() - interval '1 hour' as recent from media
  `;

  const orphanRows = rows.filter((row) => !referenced.has(row.id) && !row.recent);
  return {
    count: rows.length,
    bytes: rows.reduce((total, row) => total + row.size, 0),
    orphans: orphanRows.length,
    orphanBytes: orphanRows.reduce((total, row) => total + row.size, 0),
  };
}

/**
 * Borra las imagenes que ya no usa ninguna seccion del sitio. Se respetan las de
 * la ultima hora: pueden estar recien subidas en un editor todavia sin guardar.
 */
export async function cleanupMediaAction(): Promise<{ deleted: number; freedBytes: number }> {
  await requireAdmin();

  const referenced = await referencedMediaIds();
  const rows = await sql<{ id: string; size: number }[]>`
    select id, size from media where created_at < now() - interval '1 hour'
  `;

  const orphans = rows.filter((row) => !referenced.has(row.id));
  if (!orphans.length) return { deleted: 0, freedBytes: 0 };

  await sql`delete from media where id = any(${orphans.map((row) => row.id)}::text[])`;
  revalidatePath("/admin/settings");

  return {
    deleted: orphans.length,
    freedBytes: orphans.reduce((total, row) => total + row.size, 0),
  };
}

/* ---------------- Leads ---------------- */

export async function updateLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "new") as LeadStatus;
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);

  await sql`
    update leads set status = ${status}, notes = ${notes}, updated_at = now() where id = ${id}
  `;
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
}

/** Cambio de estado desde la tabla, sin abrir la ficha del lead. */
export async function updateLeadStatusAction(id: number, status: LeadStatus): Promise<void> {
  await requireAdmin();
  if (!LEAD_STATUSES.some((item) => item.value === status)) return;

  await sql`update leads set status = ${status}, updated_at = now() where id = ${id}`;
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

/** Borrado masivo desde la seleccion multiple de la tabla. */
export async function deleteLeadsAction(ids: number[]): Promise<{ deleted: number }> {
  await requireAdmin();
  const clean = ids.map(Number).filter((id) => Number.isInteger(id) && id > 0);
  if (!clean.length) return { deleted: 0 };

  const rows = await sql`delete from leads where id = any(${clean}::bigint[]) returning id`;
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { deleted: rows.length };
}

export async function deleteLeadAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await sql`delete from leads where id = ${id}`;
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}

export async function resendLeadEmailAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const origin = String(formData.get("origin") ?? "");

  const [lead] = await sql<Lead[]>`select * from leads where id = ${id}`;
  if (!lead) return;

  const content = await getContent();
  const recipients = content.contact.notifyEmails
    .split(/[,;\s]+/)
    .map((value) => value.trim())
    .filter((value) => value.includes("@"));

  const result = await sendLeadEmail(lead, recipients, `${origin}/admin/leads/${id}`);
  await sql`
    update leads
    set mail_status = ${result.ok ? "sent" : "failed"},
        mail_error  = ${result.ok ? null : (result.error ?? null)},
        updated_at  = now()
    where id = ${id}
  `;
  revalidatePath(`/admin/leads/${id}`);
}
