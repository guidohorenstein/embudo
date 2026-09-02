import "server-only";
import sharp from "sharp";

export const MAX_IMAGE_DIMENSION = 2000;

/**
 * Las imagenes se guardan en Postgres y se sirven por /api/media, asi que el peso
 * del blob es tiempo de carga directo. Un original de camara o un GIF sacado de un
 * video pueden pesar varios MB y tardan segundos en salir de la base, por eso todo
 * lo que se sube se reescala y se reencoda a WebP antes de guardarse.
 *
 * De un GIF animado se toma el primer cuadro: en una galeria estatica no aporta la
 * animacion y en cambio impide que el optimizador de imagenes de Next lo procese.
 */
export async function compressImage(
  input: Buffer,
  originalMime: string,
): Promise<{ bytes: Buffer; mime: string }> {
  try {
    const image = sharp(input, { failOn: "none" });
    const metadata = await image.metadata();

    const tooWide = (metadata.width ?? 0) > MAX_IMAGE_DIMENSION;
    const tooTall = (metadata.height ?? 0) > MAX_IMAGE_DIMENSION;

    const pipeline = image.rotate(); // respeta la orientacion EXIF del telefono
    if (tooWide || tooTall) {
      pipeline.resize({
        width: MAX_IMAGE_DIMENSION,
        height: MAX_IMAGE_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const bytes = await pipeline.webp({ quality: 82, effort: 4 }).toBuffer();

    // Si el original ya era mas liviano que el resultado, se conserva tal cual.
    if (bytes.length >= input.length && !tooWide && !tooTall && originalMime !== "image/gif") {
      return { bytes: input, mime: originalMime };
    }

    return { bytes, mime: "image/webp" };
  } catch (error) {
    console.error("No se pudo comprimir la imagen, se guarda el original:", error);
    return { bytes: input, mime: originalMime };
  }
}
