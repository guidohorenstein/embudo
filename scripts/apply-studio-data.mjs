/**
 * Vuelca los datos reales del estudio sobre el contenido guardado.
 * Solo pisa los campos listados: fotos, textos y todo lo demas quedan como esten.
 */
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL");
  process.exit(1);
}

const pooled = url.includes("pooler.") || url.includes(":6543") || url.includes("pgbouncer=true");
const sql = postgres(url, { max: 1, prepare: !pooled, connect_timeout: 15 });

const DATOS = {
  brand: {
    name: "ZEN HOUSE",
    tagline: "TATTOO & PIERCING STUDIO",
    fullName: "Zen House Tattoo & Piercing Studio",
  },
  seo: {
    title: "Zen House Tattoo & Piercing Studio | קעקועים ופירסינג",
  },
  contact: {
    phone: "054-750-5670",
    email: "daginstruments@gmail.com",
    address: "הצאלון 67, שדה יצחק",
    hours: "ראשון עד שבת, 10:00-22:00",
    whatsappNumber: "972547505670",
    notifyEmails: "daginstruments@gmail.com",
  },
  about: {
    signature: "ZEN HOUSE",
  },
  emails: {
    clientSubject: "קיבלנו את הפנייה שלך · Zen House Tattoo",
    clientClosing: "נדבר בקרוב,\nZen House Tattoo & Piercing Studio",
  },
};

try {
  const [row] = await sql`select value from content where key = 'site'`;
  const actual = row?.value ?? {};

  const siguiente = { ...actual };
  for (const [seccion, campos] of Object.entries(DATOS)) {
    siguiente[seccion] = { ...(actual[seccion] ?? {}), ...campos };
  }

  await sql`
    insert into content (key, value, updated_at)
    values ('site', ${sql.json(siguiente)}, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;

  console.log("Datos del estudio aplicados:\n");
  for (const [seccion, campos] of Object.entries(DATOS)) {
    for (const [clave, valor] of Object.entries(campos)) {
      console.log(`  ${seccion}.${clave} = ${String(valor).replace(/\n/g, " / ")}`);
    }
  }
} catch (error) {
  console.error("Error:", error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
