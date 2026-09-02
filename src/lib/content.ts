import "server-only";
import { cache } from "react";
import { sql } from "@/lib/db";
import type { SiteContent } from "@/lib/types";

export const DEFAULT_CONTENT: SiteContent = {
  brand: {
    name: "ZEN HOUSE",
    tagline: "TATTOO & PIERCING STUDIO",
    fullName: "Zen House Tattoo & Piercing Studio",
    headerLogo: "/zen-wordmark-light.png",
    footerLogo: "/zen-logo-light.png",
  },
  seo: {
    title: "Zen House Tattoo & Piercing Studio | קעקועים ופירסינג",
    description:
      "סטודיו לקעקועים בעיצוב אישי בתל אביב. עיצוב מקורי, קו מדויק, סביבה סטרילית וליווי אישי מהרעיון ועד ההחלמה.",
  },
  hero: {
    eyebrow: "CUSTOM TATTOO ART · TEL AVIV",
    titleLine1: "לא עוד קעקוע.",
    titleHighlight: "הסיפור שלך",
    subtitle:
      "עיצוב מקורי שנבנה סביבך, בקו מדויק, בסביבה סטרילית ובליווי אישי מהרגע הראשון ועד ההחלמה.",
    primaryCta: "בואו ניצור משהו חד פעמי ←",
    secondaryCta: "לצפייה בעבודות",
    image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=2200&q=88",
    stats: [
      { value: "12+", label: "שנות ניסיון" },
      { value: "1,200+", label: "עבודות מקוריות" },
      { value: "5.0", label: "דירוג לקוחות" },
    ],
  },
  about: {
    eyebrow: "ABOUT THE ARTIST",
    title: "אמנות שמתחילה בהקשבה.",
    paragraph1:
      "אני דניאל, אמן קעקועים שמתמחה בבלאקוורק, פיין ליין וריאליזם. מבחינתי, קעקוע טוב מתחיל הרבה לפני המחט. הוא מתחיל בסיפור, בכיוון ובבניית סקיצה שלא תראו על אף אחד אחר.",
    paragraph2:
      "בסטודיו תקבלו תהליך אישי, שקוף ומדויק. נדבר, נחדד את הרעיון, נבנה את העיצוב יחד ונעבוד בקצב שמרגיש נכון לכם.",
    bullets: [
      "סקיצה מותאמת אישית",
      "ציוד סטרילי חד פעמי",
      "ליווי מלא בהחלמה",
      "פרטיות ואווירה רגועה",
    ],
    signature: "ZEN HOUSE",
    stamp: "100% עיצוב מקורי",
    mainImage:
      "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1200&q=88",
    detailImage:
      "https://images.unsplash.com/photo-1542727365-19732a80dcfd?auto=format&fit=crop&w=700&q=85",
  },
  gallery: {
    eyebrow: "SELECTED WORK",
    title: "עבודות נבחרות.",
    intro: "לחצו על תמונה להגדלה.",
    items: [
      {
        id: "g1",
        image:
          "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1000&q=88",
        caption: "BLACKWORK · CUSTOM",
        alt: "קעקוע שחור מפורט",
      },
      {
        id: "g2",
        image:
          "https://images.unsplash.com/photo-1590246814883-57c511794e5b?auto=format&fit=crop&w=800&q=88",
        caption: "FINE LINE",
        alt: "קעקוע קווי",
      },
      {
        id: "g3",
        image:
          "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=88",
        caption: "REALISM",
        alt: "קעקוע על הזרוע",
      },
      {
        id: "g4",
        image:
          "https://images.unsplash.com/photo-1572197364459-bf17e8c79e4b?auto=format&fit=crop&w=800&q=88",
        caption: "DETAIL",
        alt: "פרט קעקוע",
      },
      {
        id: "g5",
        image:
          "https://images.unsplash.com/photo-1521369421116-0f6115fcb5be?auto=format&fit=crop&w=800&q=88",
        caption: "IN PROGRESS",
        alt: "עבודת קעקוע בסטודיו",
      },
    ],
  },
  contact: {
    eyebrow: "LET'S CREATE",
    title: "יש לכם רעיון? בואו ניתן לו צורה.",
    intro: "השאירו פרטים וספרו בקצרה מה יש לכם בראש. אחזור אליכם לשיחת היכרות ללא התחייבות.",
    phone: "054-750-5670",
    email: "daginstruments@gmail.com",
    address: "הצאלון 67, שדה יצחק",
    hours: "ראשון עד שבת, 10:00-22:00",
    whatsappNumber: "972547505670",
    whatsappMessage: "היי, הגעתי מהאתר ואשמח לשמוע פרטים על קעקוע.",
    socials: [
      { id: "s1", label: "IG", url: "https://instagram.com/" },
      { id: "s2", label: "FB", url: "https://facebook.com/" },
      { id: "s3", label: "TT", url: "https://tiktok.com/" },
    ],
    notifyEmails: "daginstruments@gmail.com",
  },
  tracking: {
    metaPixelId: "",
    ga4Id: "",
    gtmId: "",
  },
  form: {
    styles: [
      "עדיין לא בטוח/ה",
      "יפני",
      "פורטרט",
      "ניאו טרדישנל",
      "פיין ליין",
      "לטרינג",
      "ריאליזם",
      "בלאקוורק",
      "ניו סקול",
      "טראש פולקה",
      "פיוצ'ריסטי",
      "אולד סקול",
      "סוריאליזם",
      "אבסטרקט",
    ],
  },
  emails: {
    clientEnabled: true,
    clientSubject: "קיבלנו את הפנייה שלך · Zen House Tattoo",
    clientHeading: "תודה, קיבלנו את הפרטים",
    // {{name}} se reemplaza con el nombre que dejo la persona en el formulario.
    clientBody:
      "היי {{name}}, תודה שפנית אלינו.\nהפנייה שלך התקבלה ואחזור אליך בהקדם לשיחת היכרות קצרה, ללא התחייבות, כדי להבין בדיוק מה יש לך בראש.\nבינתיים אפשר לעיין בעבודות שלנו באתר, ואם עולה שאלה דחופה אפשר פשוט להשיב למייל הזה.",
    clientClosing: "נדבר בקרוב,\nZen House Tattoo & Piercing Studio",
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Merge superficial por seccion: lo guardado pisa al default, lo faltante se completa. */
function merge<T>(base: T, override: unknown): T {
  if (!isObject(override) || !isObject(base)) return (override ?? base) as T;
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = (base as Record<string, unknown>)[key];
    result[key] = isObject(current) && isObject(value) ? merge(current, value) : value;
  }
  return result as T;
}

// cache(): la pagina llama a getContent desde generateMetadata y desde el render.
// Sin esto serian dos consultas por request en vez de una.
export const getContent = cache(async function getContent(): Promise<SiteContent> {
  try {
    const rows = await sql<{ value: unknown }[]>`select value from content where key = 'site'`;
    if (!rows.length) return DEFAULT_CONTENT;
    return merge(DEFAULT_CONTENT, rows[0].value);
  } catch (error) {
    console.error("No se pudo leer el contenido, uso los valores por defecto:", error);
    return DEFAULT_CONTENT;
  }
});

export async function saveContent(next: SiteContent) {
  await sql`
    insert into content (key, value, updated_at)
    values ('site', ${sql.json(next as never)}, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
}
