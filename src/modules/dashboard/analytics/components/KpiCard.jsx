import React from "react";
import TrendSpark from "./TrendSpark.jsx";
import { formatValue } from "../api/analytics.service.js";

export default function KpiCard({
  title,
  value,
  fmt = "number",
  deltaPct = 0,
  series = [],
  currency = "USD",
}) {
  const up = deltaPct >= 0;
  const deltaTxt = `${up ? "+" : ""}${deltaPct.toFixed(1)}%`;

  return (
    <div className="card overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-lg dashboard-kpi">
      <div className="p-4 flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted">
            {title}
          </div>
          <div className="text-2xl font-semibold mt-1">
            {formatValue(value, fmt, currency)}
          </div>
        </div>
        <div
          className={`text-xs px-2 py-1 rounded-full ${
            up
              ? "bg-emerald-500/15 text-emerald-600"
              : "bg-rose-500/15 text-rose-600"
          }`}
        >
          {deltaTxt}
        </div>
      </div>
      <div className="px-4 pb-4">
        <div
          className="h-16 text-[var(--primary)]"
          style={{
            ["--spark"]:
              "linear-gradient(90deg,var(--primary),rgba(99,102,241,0.9))",
          }}
        >
          <TrendSpark data={series} height={64} />
        </div>
      </div>
    </div>
  );
}
