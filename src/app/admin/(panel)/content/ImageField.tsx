"use client";

import { useRef, useState } from "react";
import { uploadImageAction } from "../../actions";
import CropModal from "./CropModal";

export default function ImageField({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  compact?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cropping, setCropping] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    setError("");
    const data = new FormData();
    data.set("file", file);
    const result = await uploadImageAction(data);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return false;
    }
    if (result.url) onChange(result.url);
    return true;
  }

  return (
    <div className={compact ? "img-field compact" : "img-field"}>
      {compact ? null : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="preview" src={value || "data:,"} alt="" />
      )}

      <div className="controls">
        {compact ? null : (
          <label className="f" style={{ marginBottom: 8 }}>
            <span>{label}</span>
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="/api/media/... or an external URL"
            />
          </label>
        )}

        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />

        <div className="img-actions">
          <button
            className="btn-a btn-ghost btn-sm"
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
          >
            {busy ? "Uploading..." : value ? "Replace" : "Upload image"}
          </button>
          {value ? (
            <button
              className="btn-a btn-ghost btn-sm"
              type="button"
              disabled={busy}
              onClick={() => setCropping(true)}
            >
              Crop
            </button>
          ) : null}
        </div>

        {error ? <p className="failed">{error}</p> : null}
      </div>

      {cropping ? (
        <CropModal
          src={value}
          onCancel={() => setCropping(false)}
          onCropped={async (file) => {
            const ok = await upload(file);
            if (ok) setCropping(false);
          }}
        />
      ) : null}
    </div>
  );
}
