import { sql } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // El id es inmutable: cada subida o recorte crea una fila nueva, nunca se
  // reescribe una existente. Por eso alcanza con el id como ETag y el navegador
  // (y el optimizador de imagenes de Next) puede revalidar con un 304 vacio.
  const etag = `"${id}"`;
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  const rows = await sql<{ mime: string; bytes: Buffer }[]>`
    select mime, bytes from media where id = ${id}
  `;
  if (!rows.length) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(rows[0].bytes), {
    headers: {
      "Content-Type": rows[0].mime,
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: etag,
    },
  });
}
