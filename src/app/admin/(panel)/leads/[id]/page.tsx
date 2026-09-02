import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { LEAD_STATUSES, type Lead } from "@/lib/types";
import { deleteLeadAction, resendLeadEmailAction, updateLeadAction } from "../../../actions";
import ConfirmSubmit from "./ConfirmSubmit";

export const dynamic = "force-dynamic";

const TZ = "Asia/Jerusalem";
const LOCALE = "en-GB";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <th style={{ width: 150 }}>{label}</th>
      <td>{children}</td>
    </tr>
  );
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead] = await sql<Lead[]>`select * from leads where id = ${Number(id)}`;
  if (!lead) notFound();

  const headerList = await headers();
  const origin = `${headerList.get("x-forwarded-proto") ?? "https"}://${headerList.get("host")}`;
  const meta = LEAD_STATUSES.find((item) => item.value === lead.status);
  const waNumber = lead.phone.replace(/\D/g, "").replace(/^0/, "972");

  return (
    <>
      <div className="admin-head">
        <div>
          <h1 dir="auto">{lead.name}</h1>
          <p>
            Received on {new Date(lead.created_at).toLocaleString(LOCALE, { timeZone: TZ })} ·{" "}
            <span className="badge" style={{ background: meta?.color }}>
              {meta?.label}
            </span>
          </p>
        </div>
        <Link className="btn-a btn-ghost btn-sm" href="/admin/leads">
          ← Back to leads
        </Link>
      </div>

      {lead.mail_status === "failed" ? (
        <div className="mail-warn">
          The notification email failed: {lead.mail_error || "unknown error"}. The lead is safely stored
          in the panel.
        </div>
      ) : null}

      <div className="grid2">
        <div className="panel">
          <h2>Lead details</h2>
          <div className="table-scroll" style={{ marginTop: 12 }}><table className="data">
            <tbody>
              <Row label="Phone">
                <a href={`tel:${lead.phone}`}>{lead.phone}</a> ·{" "}
                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener">
                  WhatsApp
                </a>
              </Row>
              <Row label="Email">{lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}</Row>
              <Row label="Style">
                <span dir="auto">{lead.style || "—"}</span>
              </Row>
              <Row label="Placement">
                <span dir="auto">{lead.placement || "—"}</span>
              </Row>
              <Row label="Their idea">
                <span dir="auto" style={{ whiteSpace: "pre-wrap", display: "block" }}>
                  {lead.idea || "—"}
                </span>
              </Row>
            </tbody>
          </table></div>
        </div>

        <div className="panel">
          <h2>Attribution</h2>
          <div className="table-scroll" style={{ marginTop: 12 }}><table className="data">
            <tbody>
              <Row label="utm_source">{lead.utm_source || "—"}</Row>
              <Row label="utm_medium">{lead.utm_medium || "—"}</Row>
              <Row label="utm_campaign">{lead.utm_campaign || "—"}</Row>
              <Row label="Referrer">
                <span style={{ wordBreak: "break-all" }}>{lead.referrer || "—"}</span>
              </Row>
              <Row label="Client auto-reply">
                {lead.client_mail_status === "sent"
                  ? "Sent"
                  : lead.client_mail_status === "failed"
                    ? `Failed: ${lead.client_mail_error ?? "unknown error"}`
                    : "Not sent (no email address, or disabled in Settings)"}
              </Row>
              <Row label="Email status">
                {lead.mail_status === "sent" ? "Sent" : lead.mail_status === "failed" ? "Failed" : "Pending"}
              </Row>
            </tbody>
          </table></div>

          <form action={resendLeadEmailAction} style={{ marginTop: 14 }}>
            <input type="hidden" name="id" value={lead.id} />
            <input type="hidden" name="origin" value={origin} />
            <button className="btn-a btn-ghost btn-sm" type="submit">
              Resend notification email
            </button>
          </form>
        </div>
      </div>

      <div className="panel">
        <h2>Manage this lead</h2>
        <p className="hint">Update the status and keep internal notes</p>
        <form action={updateLeadAction}>
          <input type="hidden" name="id" value={lead.id} />
          <label className="f" style={{ maxWidth: 260 }}>
            <span>Status</span>
            {/* key: fuerza el remonte para que el select refleje el estado recien guardado */}
            <select key={lead.status} name="status" defaultValue={lead.status}>
              {LEAD_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="f">
            <span>Internal notes</span>
            <textarea
              name="notes"
              defaultValue={lead.notes}
              dir="auto"
              placeholder="Call summary, quoted price, appointment date..."
            />
          </label>
          <button className="btn-a" type="submit">
            Save
          </button>
        </form>
      </div>

      <form action={deleteLeadAction}>
        <input type="hidden" name="id" value={lead.id} />
        <ConfirmSubmit
          className="btn-a btn-ghost btn-sm"
          message="Delete this lead permanently? This cannot be undone."
        >
          Delete lead
        </ConfirmSubmit>
      </form>
    </>
  );
}
