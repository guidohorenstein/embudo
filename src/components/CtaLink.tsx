"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { track } from "@/lib/client-tracking";

/** Enlace que registra un click de CTA en la analitica del embudo. */
export default function CtaLink({
  children,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a
      {...props}
      onClick={(event) => {
        track("cta_click");
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
