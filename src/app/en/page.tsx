import type { Metadata } from "next";
import Landing from "@/components/Landing";
import { getContent } from "@/lib/content";
import { t } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const base = siteUrl();

  return {
    title: t(content.seo.title, "en"),
    description: t(content.seo.description, "en"),
    alternates: {
      canonical: `${base}/en`,
      languages: { he: `${base}/`, en: `${base}/en`, "x-default": `${base}/` },
    },
    openGraph: {
      title: t(content.seo.title, "en"),
      description: t(content.seo.description, "en"),
      images: content.hero.image ? [content.hero.image] : undefined,
      locale: "en_US",
      type: "website",
    },
  };
}

export default function EnglishPage() {
  return <Landing lang="en" />;
}
