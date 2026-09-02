import type { ReactNode } from "react";
import { logoutAction } from "../actions";
import AdminNav from "./AdminNav";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">
          <strong>NOIR INK</strong>
          <span>ADMIN PANEL</span>
        </div>
        <AdminNav />
        <a className="view-site" href="/" target="_blank" rel="noopener">
          View site →
        </a>
        <form action={logoutAction}>
          <button className="logout" type="submit">
            Log out
          </button>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
