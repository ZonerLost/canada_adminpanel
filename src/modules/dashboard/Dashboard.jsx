import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getDashboardData } from "./analytics/api/analytics.service.js";
import KpiCard from "./analytics/components/KpiCard.jsx";
import "../../styles/dashboard.css";

export default function Dashboard() {
  const [range, setRange] = useState("30d");
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await getDashboardData({ range });
    if (res?.ok) setData(res.data);
    setBusy(false);
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const kpis = data?.kpis || [];
  const topLocales = data?.topLocales || [];
  const recent = data?.recent || [];

  const subtitle = useMemo(() => {
    const d =
      range === "7d" ? "7 days" : range === "90d" ? "90 days" : "30 days";
    return `Overview · last ${d}`;
  }, [range]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none -z-10 bg-dashboard-hero opacity-20" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input"
            value={range}
            onChange={(e) => setRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="btn-ghost" onClick={load} disabled={busy}>
            {busy ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(busy && !data ? Array.from({ length: 4 }) : kpis).map((k, i) =>
          busy && !data ? (
            <div key={i} className="card p-4">
              <div className="skel h-3 w-24 mb-2" />
              <div className="skel h-7 w-28 mb-4" />
              <div className="skel h-16 w-full" />
            </div>
          ) : (
            <KpiCard
              key={k.key}
              title={k.label}
              value={k.value}
              deltaPct={k.deltaPct}
              series={k.series}
              fmt={k.fmt}
              currency="USD"
            />
          )
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-semibold">Top Locales</div>
            <div className="text-xs text-muted">Users by locale</div>
          </div>
          <div className="p-4">
            {!data && busy ? (
              <div className="space-y-2">
                <div className="skel h-4 w-3/4" />
                <div className="skel h-4 w-2/3" />
                <div className="skel h-4 w-1/2" />
                <div className="skel h-4 w-2/5" />
              </div>
            ) : topLocales.length === 0 ? (
              <div className="text-sm text-muted py-8 text-center">
                No data.
              </div>
            ) : (
              <ul className="space-y-3">
                {topLocales.map((l) => (
                  <li
                    key={l.locale}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[var(--primary)]" />
                      <div>{l.locale}</div>
                    </div>
                    <div className="text-muted">{l.users.toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div
            className="p-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-semibold">Recent Activity</div>
            <div className="text-xs text-muted">Latest events</div>
          </div>
          <div className="p-2">
            {!data && busy ? (
              <div className="p-2 space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skel h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="text-sm text-muted py-8 text-center">Quiet…</div>
            ) : (
              <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
                {recent.map((r) => (
                  <li
                    key={r.id}
                    className="px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-sm">{r.detail}</div>
                      <div className="text-xs text-muted">
                        {r.actor} • {new Date(r.when).toLocaleString()}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        r.type === "signup"
                          ? "bg-sky-500/15 text-sky-600"
                          : r.type === "upgrade"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}
                    >
                      {r.type}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
