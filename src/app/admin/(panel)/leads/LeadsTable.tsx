"use client";

import { Fragment, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteLeadsAction, updateLeadStatusAction } from "../../actions";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

export type LeadRow = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  style: string | null;
  placement: string | null;
  idea: string | null;
  notes: string;
  status: LeadStatus;
  source: string;
  sourceDetail: string;
  utm_medium: string | null;
  utm_campaign: string | null;
  mailFailed: boolean;
  createdLabel: string;
};

function waLink(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "972")}`;
}

export default function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pending, startTransition] = useTransition();

  const allSelected = leads.length > 0 && selected.size === leads.length;

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(leads.map((lead) => lead.id)));

  const changeStatus = (id: number, status: LeadStatus) =>
    startTransition(async () => {
      await updateLeadStatusAction(id, status);
      router.refresh();
    });

  const removeSelected = () => {
    const ids = [...selected];
    const message =
      ids.length === 1
        ? "Delete this lead permanently? This cannot be undone."
        : `Delete ${ids.length} leads permanently? This cannot be undone.`;
    if (!window.confirm(message)) return;

    startTransition(async () => {
      await deleteLeadsAction(ids);
      setSelected(new Set());
      setExpanded(null);
      router.refresh();
    });
  };

  return (
    <>
      {selected.size > 0 ? (
        <div className="bulk-bar">
          <span>
            {selected.size} {selected.size === 1 ? "lead" : "leads"} selected
          </span>
          <button className="btn-a btn-sm" type="button" onClick={removeSelected} disabled={pending}>
            {pending ? "Deleting..." : "Delete selected"}
          </button>
          <button
            className="btn-a btn-ghost btn-sm"
            type="button"
            onClick={() => setSelected(new Set())}
            disabled={pending}
          >
            Clear selection
          </button>
        </div>
      ) : null}

      <div className="table-scroll">
      <table className="data leads-table">
        <thead>
          <tr>
            <th style={{ width: 36 }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                aria-label="Select all leads on this page"
              />
            </th>
            <th style={{ width: 30 }} />
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Source</th>
            <th>Status</th>
            <th>Received</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const open = expanded === lead.id;
            return (
              <Fragment key={lead.id}>
                <tr className={selected.has(lead.id) ? "row-selected" : undefined}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={() => toggle(lead.id)}
                      aria-label={`Select ${lead.name}`}
                    />
                  </td>
                  <td>
                    <button
                      className="expander"
                      type="button"
                      onClick={() => setExpanded(open ? null : lead.id)}
                      aria-expanded={open}
                      aria-label={open ? "Collapse details" : "Expand details"}
                    >
                      {open ? "▾" : "▸"}
                    </button>
                  </td>
                  <td>
                    <button
                      className="row-link linkish"
                      type="button"
                      dir="auto"
                      onClick={() => setExpanded(open ? null : lead.id)}
                    >
                      {lead.name}
                    </button>
                    {lead.mailFailed ? <span className="chip"> email failed</span> : null}
                  </td>
                  <td>
                    <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                  </td>
                  <td>
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className="chip" title={lead.sourceDetail}>
                      {lead.source}
                    </span>
                  </td>
                  <td>
                    <select
                      className="status-select"
                      value={lead.status}
                      disabled={pending}
                      onChange={(event) => changeStatus(lead.id, event.target.value as LeadStatus)}
                      style={{
                        borderColor: LEAD_STATUSES.find((s) => s.value === lead.status)?.color,
                      }}
                    >
                      {LEAD_STATUSES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="nowrap">{lead.createdLabel}</td>
                </tr>

                {open ? (
                  <tr className="details-row">
                    <td colSpan={8}>
                      <div className="details">
                        <div>
                          <h4>Request</h4>
                          <dl>
                            <dt>Email</dt>
                            <dd>
                              {lead.email ? <a href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}
                            </dd>
                            <dt>Phone</dt>
                            <dd>
                              <a href={`tel:${lead.phone}`}>{lead.phone}</a> ·{" "}
                              <a href={waLink(lead.phone)} target="_blank" rel="noopener">
                                WhatsApp
                              </a>
                            </dd>
                            <dt>Style</dt>
                            <dd dir="auto">{lead.style || "—"}</dd>
                            <dt>Placement</dt>
                            <dd dir="auto">{lead.placement || "—"}</dd>
                          </dl>
                        </div>

                        <div>
                          <h4>Their idea</h4>
                          <p dir="auto" className="idea">
                            {lead.idea || "—"}
                          </p>
                          {lead.notes ? (
                            <>
                              <h4>Internal notes</h4>
                              <p dir="auto" className="idea">
                                {lead.notes}
                              </p>
                            </>
                          ) : null}
                        </div>

                        <div>
                          <h4>Attribution</h4>
                          <dl>
                            <dt>Source</dt>
                            <dd>{lead.sourceDetail}</dd>
                            <dt>utm_medium</dt>
                            <dd>{lead.utm_medium || "—"}</dd>
                            <dt>utm_campaign</dt>
                            <dd>{lead.utm_campaign || "—"}</dd>
                          </dl>
                          <Link className="btn-a btn-ghost btn-sm" href={`/admin/leads/${lead.id}`}>
                            Open full record →
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
}
