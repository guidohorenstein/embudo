"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cleanupMediaAction, type MediaUsage } from "../../actions";

function mb(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function StoragePanel({ usage }: { usage: MediaUsage }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<string>("");

  const clean = () => {
    if (!window.confirm(`Delete ${usage.orphans} unused images? This cannot be undone.`)) return;
    startTransition(async () => {
      const { deleted, freedBytes } = await cleanupMediaAction();
      setResult(deleted ? `Deleted ${deleted} images · freed ${mb(freedBytes)}` : "Nothing to clean");
      router.refresh();
    });
  };

  return (
    <div className="panel">
      <h2>Image storage</h2>
      <p className="hint">
        Uploaded images live in the database and are resized and re-encoded to WebP on upload.
        Replacing or cropping an image leaves the previous file behind — clean those up here.
      </p>

      <div className="cards" style={{ marginBottom: 12 }}>
        <div className="card">
          <div className="kpi">{usage.count}</div>
          <div className="kpi-label">Images stored</div>
          <div className="kpi-hint">{mb(usage.bytes)} in total</div>
        </div>
        <div className="card">
          <div className="kpi">{usage.orphans}</div>
          <div className="kpi-label">No longer used</div>
          <div className="kpi-hint">{mb(usage.orphanBytes)} that can be freed</div>
        </div>
      </div>

      <button
        className="btn-a btn-ghost btn-sm"
        type="button"
        onClick={clean}
        disabled={pending || usage.orphans === 0}
      >
        {pending ? "Cleaning..." : "Delete unused images"}
      </button>
      {result ? <span className="saved" style={{ marginLeft: 12 }}>{result}</span> : null}
    </div>
  );
}
