export type LeadStatus = "new" | "contacted" | "scheduled" | "won" | "lost";

// Etiquetas del panel: van en ingles (el sitio publico sigue en hebreo).
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

export type Stat = { value: string; label: string };
export type GalleryItem = { id: string; image: string; caption: string; alt: string };
export type SocialLink = { id: string; label: string; url: string };

export type SiteContent = {
  /** El nombre del estudio va en ingles tambien en la version hebrea. */
  brand: {
    name: string;
    tagline: string;
    fullName: string;
    /** Wordmark horizontal para el header. Si esta vacio se muestra el nombre en texto. */
    headerLogo: string;
    /** Lockup completo para el pie de pagina. */
    footerLogo: string;
  };
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleHighlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
    stats: Stat[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraph1: string;
    paragraph2: string;
    bullets: string[];
    signature: string;
    stamp: string;
    mainImage: string;
    detailImage: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    intro: string;
    items: GalleryItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
    whatsappNumber: string;
    whatsappMessage: string;
    socials: SocialLink[];
    notifyEmails: string;
  };
  tracking: {
    metaPixelId: string;
    ga4Id: string;
    gtmId: string;
  };
  form: {
    /** Opciones del desplegable de estilo en el formulario. */
    styles: string[];
  };
  emails: {
    /** Mail automatico que recibe quien deja los datos en el formulario. */
    clientEnabled: boolean;
    clientSubject: string;
    clientHeading: string;
    clientBody: string;
    clientClosing: string;
  };
};
