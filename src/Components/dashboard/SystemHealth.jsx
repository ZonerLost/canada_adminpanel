import React from "react";

const COLORS = {
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
  ok: "#22C55E",
  warn: "#F59E0B",
  bad: "#EF4444",
};

const Badge = ({ status }) => {
  const map = {
    Operational: COLORS.ok,
    Degraded: COLORS.warn,
    Down: COLORS.bad,
  };
  const bg = map[status] || COLORS.ok;
  return (
    <span
      className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
      style={{ backgroundColor: `${bg}22`, color: bg }}
    >
      {status}
    </span>
  );
};

const Card = ({ title, children }) => (
  <div
    className="rounded-2xl p-4 sm:p-5"
    style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}
  >
    <h3 className="text-sm font-semibold mb-2" style={{ color: COLORS.text }}>
      {title}
    </h3>
    {children}
  </div>
);

const Row = ({ name, status, lastSync, incidents }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <div className="text-sm" style={{ color: COLORS.text }}>
        {name}
      </div>
      <div className="text-xs" style={{ color: COLORS.text2 }}>
        Last sync: {lastSync} • Incidents: {incidents}
      </div>
    </div>
    <Badge status={status} />
  </div>
);

const SystemHealth = ({ health }) => {
  return (
    <Card title="System Health">
      <div className="divide-y" style={{ borderColor: COLORS.ring }}>
        <Row name="PTM Integration" status={health.ptm.status} lastSync={health.ptm.lastSync} incidents={health.ptm.incidents} />
        <Row name="Payments (Stripe)" status={health.payments.status} lastSync={health.payments.lastSync} incidents={health.payments.incidents} />
        <Row name="Webhooks" status={health.webhooks.status} lastSync={health.webhooks.lastSync} incidents={health.webhooks.incidents} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          className="px-3 py-2 rounded-xl text-sm font-medium"
          style={{
            background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
            color: "#0B0B0F",
          }}
          onClick={() => alert("Triggering PTM sync (placeholder)…")}
        >
          Retry PTM Sync
        </button>
        <button
          className="px-3 py-2 rounded-xl text-sm font-medium"
          style={{ border: `1px solid ${COLORS.ring}`, color: COLORS.text }}
          onClick={() => alert("Opening status page (placeholder)…")}
        >
          View Status
        </button>
      </div>
    </Card>
  );
};

export default SystemHealth;
