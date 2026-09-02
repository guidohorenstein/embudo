import Link from "next/link";
import { sql } from "@/lib/db";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const TZ = "Asia/Jerusalem";
const LOCALE = "en-GB";
const RANGES = [7, 30, 90];

type Daily = { day: string; views: number; leads: number };
type Source = { source: string; visits: number; leads: number };

function fmt(n: number) {
  return new Intl.NumberFormat(LOCALE).format(n);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const { days: daysParam } = await searchParams;
  const days = RANGES.includes(Number(daysParam)) ? Number(daysParam) : 30;
  const since = `${days} days`;

  const [totals] = await sql<
    { views: number; visitors: number; cta: number; form_starts: number; leads: number }[]
  >`
    select
      (select count(*)                 from events where name = 'view'       and created_at > now() - ${since}::interval)::int as views,
      (select count(distinct visitor_id) from events where name = 'view'     and created_at > now() - ${since}::interval)::int as visitors,
      (select count(*)                 from events where name = 'cta_click'  and created_at > now() - ${since}::interval)::int as cta,
      (select count(*)                 from events where name = 'form_start' and created_at > now() - ${since}::interval)::int as form_starts,
      (select count(*)                 from leads                            where created_at > now() - ${since}::interval)::int as leads
  `;

  const daily = await sql<Daily[]>`
    with span as (
      select generate_series(
        (now() at time zone ${TZ})::date - (${days - 1}::int),
        (now() at time zone ${TZ})::date,
        interval '1 day'
      )::date as day
    ),
    v as (
      select (created_at at time zone ${TZ})::date as day, count(*)::int as views
      from events where name = 'view' and created_at > now() - ${since}::interval group by 1
    ),
    l as (
      select (created_at at time zone ${TZ})::date as day, count(*)::int as leads
      from leads where created_at > now() - ${since}::interval group by 1
    )
    select to_char(span.day, 'DD/MM') as day,
           coalesce(v.views, 0) as views,
           coalesce(l.leads, 0) as leads
    from span
    left join v on v.day = span.day
    left join l on l.day = span.day
    order by span.day
  `;

  const sources = await sql<Source[]>`
    with v as (
      select coalesce(nullif(utm_source, ''), case when referrer is null then 'Direct' else 'Referral' end) as source,
             count(distinct visitor_id)::int as visits
      from events where name = 'view' and created_at > now() - ${since}::interval group by 1
    ),
    l as (
      select coalesce(nullif(utm_source, ''), case when referrer is null then 'Direct' else 'Referral' end) as source,
             count(*)::int as leads
      from leads where created_at > now() - ${since}::interval group by 1
    )
    select coalesce(v.source, l.source) as source,
           coalesce(v.visits, 0) as visits,
           coalesce(l.leads, 0) as leads
    from v full outer join l on l.source = v.source
    order by leads desc, visits desc
    limit 8
  `;

  const byStatus = await sql<{ status: LeadStatus; count: number }[]>`
    select status, count(*)::int as count
    from leads where created_at > now() - ${since}::interval
    group by status
  `;

  const recent = await sql<{ id: number; name: string; phone: string; status: LeadStatus; created_at: string }[]>`
    select id, name, phone, status, created_at from leads order by created_at desc limit 6
  `;

  const conversion = totals.visitors ? (totals.leads / totals.visitors) * 100 : 0;
  const maxDaily = Math.max(1, ...daily.map((d) => d.views), ...daily.map((d) => d.leads));
  const statusMap = new Map(byStatus.map((row) => [row.status, row.count]));

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p>Funnel performance over the last {days} days</p>
        </div>
        <div className="filters">
          {RANGES.map((range) => (
            <Link
              key={range}
              href={`/admin?days=${range}`}
              className={range === days ? "btn-a btn-sm" : "btn-a btn-ghost btn-sm"}
            >
              {range} days
            </Link>
          ))}
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <div className="kpi">{fmt(totals.visitors)}</div>
          <div className="kpi-label">Unique visitors</div>
          <div className="kpi-hint">{fmt(totals.views)} page views</div>
        </div>
        <div className="card">
          <div className="kpi">{fmt(totals.cta)}</div>
          <div className="kpi-label">CTA clicks</div>
          <div className="kpi-hint">{fmt(totals.form_starts)} started the form</div>
        </div>
        <div className="card">
          <div className="kpi">{fmt(totals.leads)}</div>
          <div className="kpi-label">Leads received</div>
          <div className="kpi-hint">{fmt(statusMap.get("new") ?? 0)} still untouched</div>
        </div>
        <div className="card">
          <div className="kpi">{conversion.toFixed(1)}%</div>
          <div className="kpi-label">Conversion rate</div>
          <div className="kpi-hint">Leads out of unique visitors</div>
        </div>
      </div>

      <div className="panel">
        <h2>Visitors and leads per day</h2>
        <p className="hint">Grey: page views · Red: leads</p>
        <div className="bars">
          {daily.map((row) => (
            <div className="col" key={row.day} title={`${row.day}: ${row.views} views, ${row.leads} leads`}>
              <div className="bar-v" style={{ height: `${(row.views / maxDaily) * 100}%` }} />
              <div className="bar-l" style={{ height: `${(row.leads / maxDaily) * 100}%` }} />
            </div>
          ))}
        </div>
        <div className="bars-axis">
          {daily.map((row, index) => (
            <span key={row.day}>{daily.length <= 14 || index % 5 === 0 ? row.day : ""}</span>
          ))}
        </div>
        <div className="legend">
          <span>
            <i style={{ background: "#c9c4bb" }} />
            Page views
          </span>
          <span>
            <i style={{ background: "var(--a-red)" }} />
            Leads
          </span>
        </div>
      </div>

      <div className="grid2">
        <div className="panel">
          <h2>Traffic sources</h2>
          <p className="hint">Based on the utm_source parameter in the campaign link</p>
          {sources.length ? (
            <div className="table-scroll"><table className="data">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Visitors</th>
                  <th>Leads</th>
                  <th>Conv.</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((row) => (
                  <tr key={row.source}>
                    <td>{row.source}</td>
                    <td>{fmt(row.visits)}</td>
                    <td>{fmt(row.leads)}</td>
                    <td>{row.visits ? `${((row.leads / row.visits) * 100).toFixed(1)}%` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          ) : (
            <p className="empty">No data yet</p>
          )}
        </div>

        <div className="panel">
          <h2>Leads by status</h2>
          <p className="hint">Within the selected range</p>
          <div className="table-scroll"><table className="data">
            <tbody>
              {LEAD_STATUSES.map((status) => (
                <tr key={status.value}>
                  <td>
                    <span className="badge" style={{ background: status.color }}>
                      {status.label}
                    </span>
                  </td>
                  <td>{fmt(statusMap.get(status.value) ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>

      <div className="panel">
        <h2>Latest leads</h2>
        <p className="hint">
          <Link href="/admin/leads">See all leads →</Link>
        </p>
        {recent.length ? (
          <div className="table-scroll"><table className="data">
            <tbody>
              {recent.map((lead) => {
                const status = LEAD_STATUSES.find((item) => item.value === lead.status);
                return (
                  <tr key={lead.id}>
                    <td>
                      <Link className="row-link" href={`/admin/leads/${lead.id}`}>
                        {lead.name}
                      </Link>
                    </td>
                    <td>{lead.phone}</td>
                    <td>
                      <span className="badge" style={{ background: status?.color }}>
                        {status?.label}
                      </span>
                    </td>
                    <td>{new Date(lead.created_at).toLocaleString(LOCALE, { timeZone: TZ })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table></div>
        ) : (
          <p className="empty">No leads yet</p>
        )}
      </div>
    </>
  );
}
