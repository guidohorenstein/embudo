import type { L } from "@/lib/i18n";

export type LeadStatus = "new" | "contacted" | "scheduled" | "won" | "lost";

// Etiquetas del panel: van en ingles (el sitio publico es bilingue).
export const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "#cf3028" },
  { value: "contacted", label: "Contacted", color: "#c98a13" },
  { value: "scheduled", label: "Booked", color: "#2563d9" },
  { value: "won", label: "Won", color: "#237348" },
  { value: "lost", label: "Lost", color: "#6b6b6b" },
];

export type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  style: string | null;
  placement: string | null;
  idea: string | null;
  status: LeadStatus;
  notes: string;
  /** Idioma en el que navegaba la persona: define en que idioma se le responde. */
  lang: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  visitor_id: string | null;
  user_agent: string | null;
  ip: string | null;
  mail_status: "pending" | "sent" | "failed";
  mail_error: string | null;
  client_mail_status: "skipped" | "sent" | "failed";
  client_mail_error: string | null;
  created_at: string;
  updated_at: string;
};

export type Stat = { value: string; label: L };
export type GalleryItem = { id: string; image: string; caption: L; alt: L };
export type SocialLink = { id: string; label: string; url: string };

export type SiteContent = {
  /** El nombre del estudio va en ingles en los dos idiomas, por pedido del cliente. */
  brand: {
    name: string;
    tagline: string;
    fullName: string;
    headerLogo: string;
    footerLogo: string;
  };
  seo: {
    title: L;
    description: L;
  };
  hero: {
    eyebrow: L;
    titleLine1: L;
    titleHighlight: L;
    subtitle: L;
    primaryCta: L;
    secondaryCta: L;
    image: string;
    stats: Stat[];
  };
  about: {
    eyebrow: L;
    title: L;
    paragraph1: L;
    paragraph2: L;
    bullets: L[];
    signature: string;
    stamp: L;
    mainImage: string;
    detailImage: string;
  };
  gallery: {
    eyebrow: L;
    title: L;
    intro: L;
    items: GalleryItem[];
  };
  contact: {
    eyebrow: L;
    title: L;
    intro: L;
    phone: string;
    email: string;
    address: L;
    hours: L;
    whatsappNumber: string;
    whatsappMessage: L;
    socials: SocialLink[];
    /** Enlace a Google Maps. Si esta vacio, la direccion se muestra como texto. */
    mapUrl: string;
    /** Pagina externa donde el estudio cotiza tatuajes. */
    quoteUrl: string;
    notifyEmails: string;
  };
  tracking: {
    metaPixelId: string;
    ga4Id: string;
    gtmId: string;
  };
  form: {
    /** Opciones del desplegable de estilo en el formulario. */
    styles: L[];
  };
  /** Textos de interfaz visibles: etiquetas de menu, formulario y pie. */
  ui: {
    nav: { about: L; process: L; gallery: L; contact: L };
    headerCta: L;
    scrollHint: L;
    process: { eyebrow: L; title: L; intro: L; steps: { title: L; text: L }[] };
    galleryCta: L;
    galleryMore: L;
    form: {
      name: L;
      namePlaceholder: L;
      phone: L;
      phonePlaceholder: L;
      email: L;
      style: L;
      placement: L;
      placementPlaceholder: L;
      idea: L;
      ideaPlaceholder: L;
      consent: L;
      submit: L;
      sent: L;
    };
    contactLabels: { phone: L; email: L; address: L };
    footer: {
      blurb: L;
      quickNav: L;
      important: L;
      talk: L;
      rights: L;
      credit: L;
      bookCta: L;
      quoteLabel: L;
    };
  };
  emails: {
    /** Mail automatico que recibe quien deja los datos en el formulario. */
    clientEnabled: boolean;
    clientSubject: L;
    clientHeading: L;
    clientBody: L;
    clientClosing: L;
  };
};
