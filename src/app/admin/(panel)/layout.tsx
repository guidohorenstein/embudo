import type { ReactNode } from "react";
import { getContent } from "@/lib/content";
import { logoutAction } from "../actions";
import AdminNav from "./AdminNav";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const { brand } = await getContent();

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">
          <strong>{brand.name}</strong>
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
