"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/content", label: "Website" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="admin-nav">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className={active ? "active" : undefined}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
