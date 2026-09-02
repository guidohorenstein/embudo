import type { Metadata } from "next";
import LegalDocPage, { isLegalSlug } from "@/components/LegalDocPage";
import { getContent } from "@/lib/content";
import { getLegalDoc, LEGAL_SLUGS } from "@/lib/legal";

export const revalidate = 300;

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isLegalSlug(slug)) return {};

  const content = await getContent();
  const doc = getLegalDoc(slug, content, "en");
  return { title: `${doc.title} | ${content.brand.fullName}`, description: doc.intro.slice(0, 160) };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegalDocPage slug={slug} lang="en" />;
}
