"use client";

import { useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const PRESETS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "Square 1:1", value: 1 },
  { label: "Portrait 4:5", value: 4 / 5 },
  { label: "Landscape 3:2", value: 3 / 2 },
  { label: "Wide 16:9", value: 16 / 9 },
];

const MAX_OUTPUT = 2000;

function initialCrop(width: number, height: number, aspect?: number): Crop {
  if (!aspect) return { unit: "%", x: 5, y: 5, width: 90, height: 90 };
  return centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height), width, height);
}

export default function CropModal({
  src,
  onCancel,
  onCropped,
}: {
  src: string;
  onCancel: () => void;
  onCropped: (file: File) => Promise<void>;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completed, setCompleted] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // El recorte se fija en dos lugares a la vez: el porcentual que dibuja la UI y el
  // de pixeles que se usa al exportar. onComplete solo dispara cuando el usuario
  // arrastra, asi que sin esto un preset elegido y aplicado directo se ignoraba.
  function applyCrop(next: Crop, width: number, height: number) {
    setCrop(next);
    setCompleted(convertToPixelCrop(next, width, height));
  }

  function onImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = event.currentTarget;
    applyCrop(initialCrop(width, height, aspect), width, height);
  }

  function changeAspect(next: number | undefined) {
    setAspect(next);
    const image = imgRef.current;
    if (image) applyCrop(initialCrop(image.width, image.height, next), image.width, image.height);
  }

  async function apply() {
    const image = imgRef.current;
    if (!image || !completed?.width || !completed?.height) {
      setError("Draw a crop area first");
      return;
    }

    setBusy(true);
    setError("");

    try {
      // El <img> se muestra escalado: hay que pasar del tamano en pantalla
      // al tamano real del archivo para no perder resolucion al recortar.
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      let outWidth = Math.round(completed.width * scaleX);
      let outHeight = Math.round(completed.height * scaleY);
      const shrink = Math.min(1, MAX_OUTPUT / Math.max(outWidth, outHeight));
      outWidth = Math.round(outWidth * shrink);
      outHeight = Math.round(outHeight * shrink);

      const canvas = document.createElement("canvas");
      canvas.width = outWidth;
      canvas.height = outHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not available in this browser");

      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        image,
        completed.x * scaleX,
        completed.y * scaleY,
        completed.width * scaleX,
        completed.height * scaleY,
        0,
        0,
        outWidth,
        outHeight,
      );

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9),
      );
      if (!blob) throw new Error("Could not render the cropped image");

      await onCropped(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Cropping failed";
      // Una imagen externa sin cabeceras CORS "mancha" el canvas y no se puede exportar.
      setError(
        message.toLowerCase().includes("tainted") || message.toLowerCase().includes("security")
          ? "This image is hosted elsewhere and blocks cropping. Upload the file instead, then crop it."
          : message,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="crop-backdrop" role="dialog" aria-modal="true" aria-label="Crop image">
      <div className="crop-modal">
        <div className="crop-head">
          <strong>Crop image</strong>
          <div className="crop-presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={
                  preset.value === aspect ? "btn-a btn-sm" : "btn-a btn-ghost btn-sm"
                }
                onClick={() => changeAspect(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="crop-body">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(pixelCrop) => setCompleted(pixelCrop)}
            aspect={aspect}
            keepSelection
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={src}
              alt=""
              crossOrigin="anonymous"
              onLoad={onImageLoad}
              style={{ maxHeight: "58vh", maxWidth: "100%" }}
            />
          </ReactCrop>
        </div>

        {error ? <p className="failed" style={{ margin: "10px 0 0" }}>{error}</p> : null}

        <div className="crop-foot">
          <button className="btn-a" type="button" onClick={apply} disabled={busy}>
            {busy ? "Saving..." : "Apply crop"}
          </button>
          <button className="btn-a btn-ghost" type="button" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
