import type { ReactNode } from "react";
import "./admin.css";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  // El sitio publico es hebreo/RTL, pero el panel va en ingles y LTR:
  // dir y lang en el contenedor pisan lo que declara el <html> raiz.
  return (
    <div className="admin" dir="ltr" lang="en">
      {children}
    </div>
  );
}
