import Link from "next/link";
import { sql } from "@/lib/db";
import { LEAD_STATUSES, type Lead } from "@/lib/types";
import LeadsTable, { type LeadRow } from "./LeadsTable";

export const dynamic = "force-dynamic";

const TZ = "Asia/Jerusalem";
const LOCALE = "en-GB";
const PAGE_SIZE = 25;

/** Etiqueta corta y descripcion larga del origen de la visita que generó el lead. */
function describeSource(lead: Lead) {
  if (lead.utm_source) {
    const parts = [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean);
    return { source: lead.utm_source, sourceDetail: `Campaign link · ${parts.join(" / ")}` };
  }
  if (lead.referrer) {
    let host = lead.referrer;
    try {
      host = new URL(lead.referrer).hostname.replace(/^www\./, "");
    } catch {
      /* referrer guardado sin formato de URL */
    }
    return { source: host, sourceDetail: `Arrived from a link on ${host}` };
  }
  return {
    source: "Direct",
    sourceDetail: "Typed the address, used a bookmark, or came from an app that hides the referrer",
  };
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = LEAD_STATUSES.some((item) => item.value === params.status) ? params.status : "";
  const q = (params.q ?? "").trim();
  const page = Math.max(1, Number(params.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const statusFilter = status ? sql`and status = ${status}` : sql``;
  const searchFilter = q
    ? sql`and (name ilike ${"%" + q + "%"} or phone ilike ${"%" + q + "%"}
              or coalesce(email, '') ilike ${"%" + q + "%"} or coalesce(idea, '') ilike ${"%" + q + "%"})`
    : sql``;

  const [leads, [{ count }]] = await Promise.all([
    sql<Lead[]>`
      select * from leads where 1 = 1 ${statusFilter} ${searchFilter}
      order by created_at desc limit ${PAGE_SIZE} offset ${offset}
    `,
    sql<{ count: number }[]>`
      select count(*)::int as count from leads where 1 = 1 ${statusFilter} ${searchFilter}
    `,
  ]);

  const rows: LeadRow[] = leads.map((lead) => ({
    id: Number(lead.id),
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    style: lead.style,
    placement: lead.placement,
    idea: lead.idea,
    notes: lead.notes ?? "",
    status: lead.status,
    ...describeSource(lead),
    utm_medium: lead.utm_medium,
    utm_campaign: lead.utm_campaign,
    mailFailed: lead.mail_status === "failed",
    createdLabel: new Date(lead.created_at).toLocaleString(LOCALE, { timeZone: TZ }),
  }));

  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const queryFor = (next: Record<string, string>) => {
    const search = new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), ...next });
    return `/admin/leads?${search.toString()}`;
  };

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Leads</h1>
          <p>{count} leads match the current filter · click a row to expand it</p>
        </div>
      </div>

      <form className="filters" method="get">
        <label className="f">
          <span>Search</span>
          <input name="q" defaultValue={q} placeholder="Name, phone, email or text" dir="auto" />
        </label>
        <label className="f">
          <span>Status</span>
          <select name="status" defaultValue={status}>
            <option value="">All</option>
            {LEAD_STATUSES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button className="btn-a" type="submit">
          Filter
        </button>
        {status || q ? (
          <Link className="btn-a btn-ghost" href="/admin/leads">
            Clear
          </Link>
        ) : null}
      </form>

      {rows.length ? (
        <LeadsTable leads={rows} />
      ) : (
        <div className="panel">
          <p className="empty">No leads found</p>
        </div>
      )}

      {pages > 1 ? (
        <div className="filters" style={{ marginTop: 18 }}>
          {page > 1 ? (
            <Link className="btn-a btn-ghost btn-sm" href={queryFor({ page: String(page - 1) })}>
              Previous
            </Link>
          ) : null}
          <span className="chip">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link className="btn-a btn-ghost btn-sm" href={queryFor({ page: String(page + 1) })}>
              Next
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
