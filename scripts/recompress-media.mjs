import postgres from "postgres";
import sharp from "sharp";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL (ponela en .env.local)");
  process.exit(1);
}

const MAX = 2000;
const pooled = url.includes("pooler.") || url.includes(":6543") || url.includes("pgbouncer=true");
const sql = postgres(url, { max: 1, prepare: !pooled, connect_timeout: 15 });

try {
  const rows = await sql`select id, filename, mime, size from media order by size desc`;
  console.log(`${rows.length} imagenes en la base\n`);

  let ahorrado = 0;

  for (const row of rows) {
    const [{ bytes }] = await sql`select bytes from media where id = ${row.id}`;
    const input = Buffer.from(bytes);

    const image = sharp(input, { failOn: "none" });
    const meta = await image.metadata();
    const pipeline = image.rotate();
    if ((meta.width ?? 0) > MAX || (meta.height ?? 0) > MAX) {
      pipeline.resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true });
    }
    const out = await pipeline.webp({ quality: 82, effort: 4 }).toBuffer();

    if (out.length >= input.length) {
      console.log(`  = ${row.filename}: ya estaba optimizada (${Math.round(input.length / 1024)} KB)`);
      continue;
    }

    await sql`update media set bytes = ${out}, size = ${out.length}, mime = 'image/webp' where id = ${row.id}`;
    ahorrado += input.length - out.length;
    console.log(
      `  ✓ ${row.filename}: ${Math.round(input.length / 1024)} KB -> ${Math.round(out.length / 1024)} KB`,
    );
  }

  console.log(`\nTotal ahorrado: ${Math.round(ahorrado / 1024)} KB`);
} catch (error) {
  console.error("Error:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
