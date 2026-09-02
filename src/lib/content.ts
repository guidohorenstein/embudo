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
    title: {
      he: "Zen House Tattoo & Piercing Studio | קעקועים ופירסינג",
      en: "Zen House Tattoo & Piercing Studio | Custom tattoos and piercing",
    },
    description: {
      he: "סטודיו לקעקועים ופירסינג בעיצוב אישי. עיצוב מקורי, קו מדויק, סביבה סטרילית וליווי אישי מהרעיון ועד ההחלמה.",
      en: "A custom tattoo and piercing studio. Original design, precise linework, a sterile space and personal guidance from the first idea to full healing.",
    },
  },
  hero: {
    eyebrow: { he: "CUSTOM TATTOO & PIERCING", en: "CUSTOM TATTOO & PIERCING" },
    titleLine1: { he: "לא עוד קעקוע.", en: "Not just a tattoo." },
    titleHighlight: { he: "הסיפור שלך", en: "Your story" },
    subtitle: {
      he: "עיצוב מקורי שנבנה סביבך, בקו מדויק, בסביבה סטרילית ובליווי אישי מהרגע הראשון ועד ההחלמה.",
      en: "An original design built around you, with precise linework, in a sterile space, with personal guidance from the first moment to full healing.",
    },
    primaryCta: { he: "בואו ניצור משהו חד פעמי ←", en: "Let's create something one of a kind →" },
    secondaryCta: { he: "לצפייה בעבודות", en: "See the work" },
    image:
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=2200&q=88",
    stats: [
      { value: "12+", label: { he: "שנות ניסיון", en: "Years of experience" } },
      { value: "1,200+", label: { he: "עבודות מקוריות", en: "Original pieces" } },
      { value: "5.0", label: { he: "דירוג לקוחות", en: "Client rating" } },
    ],
  },
  about: {
    eyebrow: { he: "ABOUT THE STUDIO", en: "ABOUT THE STUDIO" },
    title: { he: "אמנות שמתחילה בהקשבה.", en: "Art that starts with listening." },
    paragraph1: {
      he: "בזן האוס כל עבודה מתחילה הרבה לפני המחט. היא מתחילה בסיפור, בכיוון ובבניית סקיצה שלא תראו על אף אחד אחר.",
      en: "At Zen House every piece starts long before the needle. It starts with a story, a direction, and a sketch you will not see on anyone else.",
    },
    paragraph2: {
      he: "בסטודיו תקבלו תהליך אישי, שקוף ומדויק. נדבר, נחדד את הרעיון, נבנה את העיצוב יחד ונעבוד בקצב שמרגיש נכון לכם.",
      en: "You get a personal, transparent and precise process. We talk, sharpen the idea, build the design together and work at the pace that feels right for you.",
    },
    bullets: [
      { he: "סקיצה מותאמת אישית", en: "A sketch made for you" },
      { he: "ציוד סטרילי חד פעמי", en: "Sterile single-use equipment" },
      { he: "ליווי מלא בהחלמה", en: "Full support while healing" },
      { he: "פרטיות ואווירה רגועה", en: "Privacy and a calm space" },
    ],
    stamp: { he: "100% עיצוב מקורי", en: "100% original design" },
    mainImage:
      "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=1200&q=88",
    detailImage:
      "https://images.unsplash.com/photo-1542727365-19732a80dcfd?auto=format&fit=crop&w=700&q=85",
  },
  gallery: {
    eyebrow: { he: "SELECTED WORK", en: "SELECTED WORK" },
    title: { he: "עבודות נבחרות.", en: "Selected work." },
    intro: { he: "לחצו על תמונה להגדלה.", en: "Tap an image to enlarge it." },
    items: [
      {
        id: "g1",
        image:
          "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1000&q=88",
        caption: { he: "BLACKWORK · CUSTOM", en: "BLACKWORK · CUSTOM" },
        alt: { he: "קעקוע שחור מפורט", en: "Detailed blackwork tattoo" },
      },
      {
        id: "g2",
        image:
          "https://images.unsplash.com/photo-1590246814883-57c511794e5b?auto=format&fit=crop&w=800&q=88",
        caption: { he: "FINE LINE", en: "FINE LINE" },
        alt: { he: "קעקוע קווי", en: "Fine line tattoo" },
      },
      {
        id: "g3",
        image:
          "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&w=800&q=88",
        caption: { he: "REALISM", en: "REALISM" },
        alt: { he: "קעקוע על הזרוע", en: "Tattoo on the arm" },
      },
      {
        id: "g4",
        image:
          "https://images.unsplash.com/photo-1572197364459-bf17e8c79e4b?auto=format&fit=crop&w=800&q=88",
        caption: { he: "DETAIL", en: "DETAIL" },
        alt: { he: "פרט קעקוע", en: "Tattoo detail" },
      },
      {
        id: "g5",
        image:
          "https://images.unsplash.com/photo-1521369421116-0f6115fcb5be?auto=format&fit=crop&w=800&q=88",
        caption: { he: "IN PROGRESS", en: "IN PROGRESS" },
        alt: { he: "עבודת קעקוע בסטודיו", en: "Tattoo work in the studio" },
      },
    ],
  },
  contact: {
    eyebrow: { he: "LET'S CREATE", en: "LET'S CREATE" },
    title: { he: "יש לכם רעיון? בואו ניתן לו צורה.", en: "Got an idea? Let's give it shape." },
    intro: {
      he: "השאירו פרטים וספרו בקצרה מה יש לכם בראש. נחזור אליכם לשיחת היכרות ללא התחייבות.",
      en: "Leave your details and tell us briefly what you have in mind. We'll get back to you for a no-obligation chat.",
    },
    phone: "054-750-5670",
    email: "daginstruments@gmail.com",
    address: { he: "הצאלון 67, שדה יצחק", en: "67 Ha'tseelon st, Sede Itzhak" },
    hours: { he: "ראשון עד שבת, 10:00-22:00", en: "Sunday to Saturday, 10:00-22:00" },
    whatsappNumber: "972547505670",
    whatsappMessage: {
      he: "היי, הגעתי מהאתר ואשמח לשמוע פרטים על קעקוע.",
      en: "Hi, I came from the website and I'd like to hear more about getting a tattoo.",
    },
    socials: [
      { id: "s1", label: "IG", url: "https://instagram.com/" },
      { id: "s2", label: "FB", url: "https://www.facebook.com/zenhouse.tattoo/" },
      { id: "s3", label: "TT", url: "https://www.tiktok.com/@zenhouse.tattoo" },
    ],
    mapUrl: "https://maps.app.goo.gl/uzXdguH5oDgYAsC76",
    quoteUrl: "https://www.zenhousetattoo.com/start",
    notifyEmails: "daginstruments@gmail.com",
  },
  tracking: {
    metaPixelId: "",
    ga4Id: "",
    gtmId: "",
  },
  form: {
    styles: [
      { he: "עדיין לא בטוח/ה", en: "Not sure yet" },
      { he: "יפני", en: "Japanese" },
      { he: "פורטרט", en: "Portrait" },
      { he: "ניאו טרדישנל", en: "Neo traditional" },
      { he: "פיין ליין", en: "Fine line" },
      { he: "לטרינג", en: "Lettering" },
      { he: "ריאליזם", en: "Realism" },
      { he: "בלאקוורק", en: "Blackwork" },
      { he: "ניו סקול", en: "New school" },
      { he: "טראש פולקה", en: "Trash polka" },
      { he: "פיוצ׳ריסטי", en: "Futuristic" },
      { he: "אולד סקול", en: "Old school" },
      { he: "סוריאליזם", en: "Surrealism" },
      { he: "אבסטרקט", en: "Abstract" },
    ],
  },
  ui: {
    nav: {
      about: { he: "אודות", en: "About" },
      process: { he: "התהליך", en: "Process" },
      gallery: { he: "עבודות", en: "Work" },
      contact: { he: "יצירת קשר", en: "Contact" },
    },
    headerCta: { he: "קביעת פגישת ייעוץ", en: "Book a consultation" },
    scrollHint: { he: "SCROLL TO DISCOVER", en: "SCROLL TO DISCOVER" },
    process: {
      eyebrow: { he: "THE PROCESS", en: "THE PROCESS" },
      title: { he: "מהרעיון ועד העור.", en: "From idea to skin." },
      intro: {
        he: "תהליך מסודר שמוריד את סימני השאלה ומשאיר מקום לדבר החשוב באמת, היצירה.",
        en: "A clear process that takes the guesswork out and leaves room for what matters: the work itself.",
      },
      steps: [
        {
          title: { he: "שיחת היכרות", en: "First conversation" },
          text: {
            he: "מספרים על הרעיון, המיקום, הגודל והסגנון שאתם אוהבים.",
            en: "Tell us the idea, the placement, the size and the style you like.",
          },
        },
        {
          title: { he: "בניית קונספט", en: "Building the concept" },
          text: {
            he: "מחדדים את הכיוון ומפתחים סקיצה מקורית במיוחד עבורכם.",
            en: "We sharpen the direction and develop an original sketch made only for you.",
          },
        },
        {
          title: { he: "יום הקעקוע", en: "Tattoo day" },
          text: {
            he: "עוברים יחד על הסקיצה, ההתאמה לגוף ומתחילים בקצב שלכם.",
            en: "We go over the sketch together, fit it to your body and start at your pace.",
          },
        },
        {
          title: { he: "החלמה וליווי", en: "Healing and follow-up" },
          text: {
            he: "מקבלים הנחיות ברורות וזמינות לכל שאלה לאורך ההחלמה.",
            en: "You get clear aftercare instructions and we stay reachable throughout.",
          },
        },
      ],
    },
    galleryCta: { he: "יש לכם רעיון? בואו נדבר", en: "Got an idea? Let's talk" },
    galleryMore: { he: "לעוד עבודות", en: "Show more work" },
    form: {
      name: { he: "שם מלא *", en: "Full name *" },
      namePlaceholder: { he: "איך קוראים לך?", en: "What's your name?" },
      phone: { he: "טלפון *", en: "Phone *" },
      phonePlaceholder: { he: "050-000-0000", en: "050-000-0000" },
      email: { he: "אימייל", en: "Email" },
      style: { he: "סגנון מועדף", en: "Preferred style" },
      placement: { he: "מיקום בגוף", en: "Placement" },
      placementPlaceholder: { he: "לדוגמה: אמה פנימית", en: "For example: inner forearm" },
      idea: { he: "ספרו לי על הרעיון", en: "Tell us about the idea" },
      ideaPlaceholder: {
        he: "רעיון, גודל משוער, משמעות וכל פרט שיכול לעזור...",
        en: "The idea, rough size, meaning, anything that helps...",
      },
      consent: {
        he: "אני מאשר/ת קבלת פנייה בנוגע לבקשה שלי ומסכים/ה למדיניות הפרטיות.",
        en: "I agree to be contacted about my request and accept the privacy policy.",
      },
      submit: { he: "שליחת פרטים וקביעת שיחה ←", en: "Send details and book a call →" },
      sent: {
        he: "תודה, הפרטים התקבלו. נחזור אליכם בהקדם.",
        en: "Thanks, we got your details. We'll be in touch soon.",
      },
    },
    contactLabels: {
      phone: { he: "טלפון", en: "Phone" },
      email: { he: "אימייל", en: "Email" },
      address: { he: "כתובת", en: "Address" },
    },
    footer: {
      blurb: {
        he: "סטודיו לקעקועים ופירסינג בעיצוב אישי, עם תהליך מדויק, יחס אנושי ואמנות שנשארת.",
        en: "A custom tattoo and piercing studio: a precise process, a human approach, and art that lasts.",
      },
      quickNav: { he: "ניווט מהיר", en: "Quick links" },
      important: { he: "פרטים חשובים", en: "Good to know" },
      talk: { he: "דברו איתנו", en: "Get in touch" },
      rights: { he: "כל הזכויות שמורות.", en: "All rights reserved." },
      credit: { he: "עיצוב והקמה: Guido Horenstein", en: "Design and build: Guido Horenstein" },
      bookCta: { he: "קביעת ייעוץ", en: "Book a consultation" },
      quoteLabel: { he: "מחשבון מחיר לקעקוע ←", en: "Tattoo price estimate →" },
    },
  },
  emails: {
    clientEnabled: true,
    clientSubject: {
      he: "קיבלנו את הפנייה שלך · Zen House Tattoo",
      en: "We got your message · Zen House Tattoo",
    },
    clientHeading: { he: "תודה, קיבלנו את הפרטים", en: "Thanks, we got your details" },
    // {{name}} se reemplaza con el nombre que dejo la persona en el formulario.
    clientBody: {
      he: "היי {{name}}, תודה שפנית אלינו.\nהפנייה שלך התקבלה ונחזור אליך בהקדם לשיחת היכרות קצרה, ללא התחייבות, כדי להבין בדיוק מה יש לך בראש.\nבינתיים אפשר לעיין בעבודות שלנו באתר, ואם עולה שאלה דחופה אפשר פשוט להשיב למייל הזה.",
      en: "Hi {{name}}, thanks for reaching out.\nWe received your message and will get back to you shortly for a short, no-obligation chat to understand exactly what you have in mind.\nIn the meantime feel free to browse our work on the site, and if something urgent comes up you can simply reply to this email.",
    },
    clientClosing: {
      he: "נדבר בקרוב,\nZen House Tattoo & Piercing Studio",
      en: "Talk soon,\nZen House Tattoo & Piercing Studio",
    },
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const isTranslatable = (value: unknown): value is { he: string; en: string } =>
  isObject(value) && typeof value.he === "string" && typeof value.en === "string";

/**
 * Merge por seccion: lo guardado pisa al default, lo faltante se completa.
 *
 * Tolera contenido anterior al bilingue: si el default espera {he, en} y lo
 * guardado es un texto suelto, se toma como hebreo y el ingles cae al default.
 * Sin esto, una fila vieja dejaria el sitio en ingles mostrando hebreo.
 */
function merge<T>(base: T, override: unknown): T {
  if (isTranslatable(base) && typeof override === "string") {
    return { he: override, en: base.en } as T;
  }
  if (!isObject(override) || !isObject(base)) return (override ?? base) as T;

  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = (base as Record<string, unknown>)[key];
    if (Array.isArray(current) && Array.isArray(value)) {
      // Los arrays vienen enteros de lo guardado, pero cada elemento se
      // normaliza contra el primer elemento del default, que hace de molde.
      result[key] = value.map((item) => merge(current[0], item));
      continue;
    }
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

/** Marca de la ultima escritura, para detectar ediciones simultaneas. */
export async function getContentVersion(): Promise<string> {
  try {
    const rows = await sql<{ updated_at: Date }[]>`
      select updated_at from content where key = 'site'
    `;
    return rows.length ? new Date(rows[0].updated_at).toISOString() : "";
  } catch {
    return "";
  }
}

/**
 * El panel guarda el documento entero, asi que una pestaña abierta desde antes
 * pisaria en silencio lo que se haya cambiado mientras tanto. Se guarda solo si
 * la fila sigue en la version que el editor cargo.
 */
export async function saveContent(
  next: SiteContent,
  expectedVersion: string,
): Promise<{ ok: true; version: string } | { ok: false; reason: "conflict" }> {
  if (!expectedVersion) {
    const rows = await sql<{ updated_at: Date }[]>`
      insert into content (key, value, updated_at)
      values ('site', ${sql.json(next as never)}, now())
      on conflict (key) do nothing
      returning updated_at
    `;
    if (!rows.length) return { ok: false, reason: "conflict" };
    return { ok: true, version: new Date(rows[0].updated_at).toISOString() };
  }

  const rows = await sql<{ updated_at: Date }[]>`
    update content
    set value = ${sql.json(next as never)}, updated_at = now()
    where key = 'site' and updated_at = ${expectedVersion}::timestamptz
    returning updated_at
  `;
  if (!rows.length) return { ok: false, reason: "conflict" };
  return { ok: true, version: new Date(rows[0].updated_at).toISOString() };
}
