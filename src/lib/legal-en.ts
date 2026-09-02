import type { LegalDoc, LegalSlug } from "@/lib/legal";

/** Version inglesa de los mismos documentos. Ver la advertencia en legal.ts. */

export type LegalData = { studio: string; email: string; phone: string; address: string };

const UPDATED = "September 2026";

export function englishDoc(slug: LegalSlug, { studio, email, phone, address }: LegalData): LegalDoc {
  switch (slug) {
    case "privacy":
      return {
        slug,
        title: "Privacy policy",
        updated: UPDATED,
        intro: `${studio} respects your privacy. This page explains what information the site collects, what it is used for, and how to reach us about it.`,
        sections: [
          {
            heading: "What we collect",
            paragraphs: [
              "Information you give us in the contact form: name, phone, email address if you fill it in, and whatever you write about your tattoo idea.",
              "Technical information collected automatically: IP address, browser type, time of visit and the page you arrived from. This is used only for performance measurement and security.",
            ],
          },
          {
            heading: "What it is used for",
            paragraphs: [
              "To get back to you about your enquiry, arrange a consultation and answer questions.",
              "To understand which advertising channels bring enquiries, in aggregate and never at the level of an identified person.",
              "We do not sell, rent or pass your details to third parties for marketing.",
            ],
          },
          {
            heading: "Storage and security",
            paragraphs: [
              "Enquiries are stored on secured servers and are accessible only to studio staff. We keep the information as long as it is needed to stay in touch with you, or as required by law.",
              "We use infrastructure and email providers to run the site. They process the information only on our behalf and under our instructions.",
            ],
          },
          {
            heading: "Your rights",
            paragraphs: [
              "You may ask to see the information we hold about you, correct it, or request its deletion.",
              `For any request, write to ${email} or call ${phone}.`,
            ],
          },
          {
            heading: "Cookies",
            paragraphs: [
              "The site uses browser storage to remember your accessibility preferences and to count visits in aggregate. You can clear it at any time from your browser settings.",
            ],
          },
        ],
      };

    case "terms":
      return {
        slug,
        title: "Terms of use",
        updated: UPDATED,
        intro: `Using the ${studio} website means you accept the terms below. If you do not agree with them, please do not use the site.`,
        sections: [
          {
            heading: "Site content",
            paragraphs: [
              "Content and images are shown for information only and are not a binding offer. Price, availability and duration are agreed in a personal conversation and depend on the project.",
              "The images show work done at the studio. Results vary from person to person depending on skin, placement and the healing process.",
            ],
          },
          {
            heading: "Intellectual property",
            paragraphs: [
              `All rights in the designs, images and content shown on this site belong to ${studio}. They may not be copied, reproduced or used commercially without written permission.`,
            ],
          },
          {
            heading: "Appointments and cancellations",
            paragraphs: [
              "Appointments are arranged in advance. If you need to cancel, please tell us as early as possible so we can offer the slot to someone else.",
              "The full deposit and cancellation policy is given when the appointment is booked.",
            ],
          },
          {
            heading: "Health and liability",
            paragraphs: [
              "Nothing on this site is medical advice. If you have a medical condition, are pregnant, take medication or have known allergies, consult a doctor before getting a tattoo or piercing.",
              "Services are provided to adults only, as required by law.",
            ],
          },
          {
            heading: "Changes",
            paragraphs: [
              "We may update these terms from time to time. The current version is published on this page with its update date.",
            ],
          },
        ],
      };

    case "accessibility":
      return {
        slug,
        title: "Accessibility statement",
        updated: UPDATED,
        intro: `${studio} is committed to making this site usable by everyone, including people with disabilities, and works to improve it continuously.`,
        sections: [
          {
            heading: "What has been done",
            paragraphs: [
              "The site was built aiming to meet WCAG 2.1 level AA, in line with Israeli standard 5568.",
              "The site can be navigated by keyboard alone, and the focus indicator is visible on every interactive element.",
              "Content images have alternative text, and headings follow a proper hierarchy for screen readers.",
              "The site works on phone, tablet and desktop, and supports browser text zoom.",
            ],
          },
          {
            heading: "Accessibility menu",
            paragraphs: [
              "An accessibility menu in the corner of the screen offers: text size up to 150 percent, high contrast mode, link highlighting, a readable font, stopping animations and a larger cursor.",
              "Preferences are saved in the browser and stay active as you move between pages.",
            ],
          },
          {
            heading: "Known limitations",
            paragraphs: [
              "Some elements or content may not yet be fully accessible. We keep fixing and improving.",
              "Content embedded from third parties, such as social networks, is outside our control and its accessibility is determined by those providers.",
            ],
          },
          {
            heading: "Studio accessibility",
            paragraphs: [
              `Studio address: ${address}. To check the physical accessibility of the space before visiting, please get in touch.`,
            ],
          },
          {
            heading: "Accessibility enquiries",
            paragraphs: [
              "Ran into a problem using the site? We would like to know so we can fix it.",
              `Accessibility contact: ${studio}. Email: ${email}. Phone: ${phone}.`,
              "We will handle your message as quickly as we can.",
            ],
          },
        ],
      };

    case "aftercare":
      return {
        slug,
        title: "Aftercare",
        updated: UPDATED,
        intro:
          "Healing is part of the work. How you treat it in the first days directly affects how the tattoo or piercing will look later.",
        sections: [
          {
            heading: "Tattoo · the first day",
            paragraphs: [
              "Leave the wrap on for as long as we told you at the studio.",
              "After removing it, wash gently with lukewarm water and unscented soap, then pat dry with a clean towel. Do not rub.",
              "Apply a very thin layer of the ointment you were given. Too thick a layer stops the skin from breathing.",
            ],
          },
          {
            heading: "Tattoo · the next two weeks",
            paragraphs: [
              "Wash and apply ointment two to three times a day, in a thin layer.",
              "Do not scratch and do not peel it, even when it itches. The flaking comes off on its own.",
              "Avoid pools, the sea, hot tubs and baths. A short shower is fine.",
              "Avoid direct sun. Once healed, use high factor sun protection to keep the colour for years.",
              "Avoid hard physical activity for the first two days, especially around the tattooed area.",
            ],
          },
          {
            heading: "Piercing",
            paragraphs: [
              "Clean the area twice a day with sterile saline solution. Do not use alcohol or hydrogen peroxide.",
              "Do not twist or play with the jewellery, and only touch it with clean hands.",
              "Do not change the jewellery before the healing period we gave you is over.",
              "Mild redness and clear discharge in the first days are part of the process.",
            ],
          },
          {
            heading: "When to contact us",
            paragraphs: [
              "Swelling that increases after the third day, fever, strong pain, or thick discharge with an odour.",
              "When in doubt, ask. You can send a photo on WhatsApp and we will tell you whether it looks normal.",
              `Phone: ${phone} · Email: ${email}`,
            ],
          },
        ],
      };
  }
}

export const LEGAL_NAV_EN: { slug: LegalSlug; label: string }[] = [
  { slug: "privacy", label: "Privacy policy" },
  { slug: "accessibility", label: "Accessibility statement" },
  { slug: "terms", label: "Terms of use" },
  { slug: "aftercare", label: "Aftercare" },
];
