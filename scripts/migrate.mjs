import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL (ponela en .env.local)");
  process.exit(1);
}

const pooled = url.includes("pooler.") || url.includes(":6543") || url.includes("pgbouncer=true");
const sql = postgres(url, { max: 1, prepare: !pooled });
const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

try {
  await sql.unsafe(schema);
  console.log("Migracion aplicada correctamente.");
} catch (error) {
  console.error("Error aplicando la migracion:", error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
