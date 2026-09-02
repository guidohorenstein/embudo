import type { NextConfig } from "next";

const config: NextConfig = {
  // Vercel rechaza cualquier request body de mas de 4.5MB antes de que llegue al
  // codigo, asi que no tiene sentido aceptar mas que eso en las subidas.
  experimental: { serverActions: { bodySizeLimit: "4.5mb" } },
  images: {
    // El panel permite pegar la URL de cualquier imagen, asi que el optimizador
    // tiene que aceptar cualquier host https. Solo un admin autenticado puede
    // guardar esas URLs, por eso el patron abierto es aceptable aca.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default config;
