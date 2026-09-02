export const LANGS = ["he", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "he";

/** Texto traducible. El hebreo es obligatorio; el ingles puede faltar y cae al hebreo. */
export type L = { he: string; en: string };

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/** Resuelve un texto al idioma pedido. Acepta strings sueltos para contenido viejo. */
export function t(value: L | string | undefined, lang: Lang): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang]?.trim() ? value[lang] : value.he;
}

export const dirOf = (lang: Lang) => (lang === "he" ? "rtl" : "ltr");

/** Prefijo de ruta: el hebreo vive en la raiz, el ingles bajo /en. */
export const pathFor = (lang: Lang, path = "") =>
  lang === DEFAULT_LANG ? `/${path}`.replace(/\/+$/, "") || "/" : `/en/${path}`.replace(/\/+$/, "");

/**
 * Textos de interfaz. Son etiquetas del producto, no contenido del estudio:
 * no cambian entre clientes, por eso viven en el codigo y no en el panel.
 */
export const UI = {
  skip: { he: "דילוג לתוכן", en: "Skip to content" },
  homeAria: { he: "דף הבית", en: "Home" },
  langSwitch: { he: "English", en: "עברית" },
  langSwitchAria: { he: "Switch to English", en: "מעבר לעברית" },

  nav: {
    about: { he: "אודות", en: "About" },
    process: { he: "התהליך", en: "Process" },
    gallery: { he: "עבודות", en: "Work" },
    contact: { he: "יצירת קשר", en: "Contact" },
  },
  headerCta: { he: "קביעת פגישת ייעוץ", en: "Book a consultation" },
  menuAria: { he: "פתיחת תפריט", en: "Open menu" },
  navAria: { he: "ניווט ראשי", en: "Main navigation" },
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
  lightboxAria: { he: "תצוגת תמונה מוגדלת", en: "Enlarged image view" },
  close: { he: "סגירה", en: "Close" },

  form: {
    name: { he: "שם מלא *", en: "Full name *" },
    namePlaceholder: { he: "איך קוראים לך?", en: "What's your name?" },
    phone: { he: "טלפון *", en: "Phone *" },
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
    sending: { he: "שולח...", en: "Sending..." },
    sent: { he: "תודה, הפרטים התקבלו. נחזור אליכם בהקדם.", en: "Thanks, we got your details. We'll be in touch soon." },
    errorGeneric: { he: "אירעה שגיאה. נסו שוב או התקשרו אלינו.", en: "Something went wrong. Please try again or call us." },
    errorNetwork: { he: "אין חיבור לשרת. נסו שוב בעוד רגע.", en: "No connection. Please try again in a moment." },
    honeypot: { he: "אתר", en: "Website" },
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
    credit: { he: "עיצוב והקמה: EX Advertising", en: "Design and build: EX Advertising" },
    bookCta: { he: "קביעת ייעוץ", en: "Book a consultation" },
  },

  whatsappAria: { he: "פתיחת שיחה בוואטסאפ", en: "Open a WhatsApp chat" },
  whatsappLabel: { he: "דברו איתנו בוואטסאפ", en: "Chat with us on WhatsApp" },

  a11y: {
    menuAria: { he: "תפריט נגישות", en: "Accessibility menu" },
    title: { he: "נגישות", en: "Accessibility" },
    closeAria: { he: "סגירת התפריט", en: "Close menu" },
    textSize: { he: "גודל טקסט", en: "Text size" },
    contrast: { he: "ניגודיות גבוהה", en: "High contrast" },
    links: { he: "הדגשת קישורים", en: "Highlight links" },
    readable: { he: "גופן קריא", en: "Readable font" },
    noMotion: { he: "עצירת אנימציות", en: "Stop animations" },
    bigCursor: { he: "סמן עכבר גדול", en: "Large cursor" },
    reset: { he: "איפוס הגדרות", en: "Reset" },
    statement: { he: "הצהרת נגישות", en: "Accessibility statement" },
  },

  legal: {
    back: { he: "← חזרה לאתר", en: "← Back to the site" },
    updated: { he: "עודכן", en: "Updated" },
    more: { he: "מסמכים נוספים", en: "More documents" },
    moreAria: { he: "מסמכים נוספים", en: "More documents" },
  },
} as const;
