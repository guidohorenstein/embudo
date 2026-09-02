import type { MetadataRoute } from "next";
import { LEGAL_SLUGS } from "@/lib/legal";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  const paginas = ["", "en"];
  const legales = LEGAL_SLUGS.flatMap((slug) => [`legal/${slug}`, `en/legal/${slug}`]);

  return [...paginas, ...legales].map((ruta) => ({
    url: ruta ? `${base}/${ruta}` : `${base}/`,
    lastModified: now,
    changeFrequency: ruta.includes("legal") ? "yearly" : "monthly",
    priority: ruta === "" ? 1 : ruta === "en" ? 0.9 : 0.3,
  }));
}
