const USE_MOCK = (import.meta?.env?.VITE_USE_MOCK ?? "1") === "1";
const delay = (ms = 420) => new Promise((r) => setTimeout(r, ms));

function genSeries(days = 30, base = 1000, noise = 0.12) {
  const now = new Date();
  const arr = [];
  let v = base;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    v = Math.max(0, v * (1 + (Math.random() - 0.5) * noise));
    arr.push({ t: d.getTime(), y: Math.round(v) });
  }
  return arr;
}

function sumSeries(series) {
  return series.reduce((s, p) => s + p.y, 0);
}

export async function getDashboardData({ range = "30d" } = {}) {
  if (USE_MOCK) {
    await delay();
    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;

    const signups = genSeries(days, 120, 0.25);
    const revenue = genSeries(days, 2200, 0.15);
    const active = genSeries(days, 800, 0.18);
    const conversions = genSeries(days, 60, 0.3);

    const kpis = [
      {
        key: "revenue",
        label: "Revenue",
        value: sumSeries(revenue),
        deltaPct:
          ((revenue.at(-1).y - revenue.at(-2).y) /
            Math.max(1, revenue.at(-2).y)) *
          100,
        series: revenue,
        fmt: "currency",
      },
      {
        key: "signups",
        label: "New Signups",
        value: sumSeries(signups),
        deltaPct:
          ((signups.at(-1).y - signups.at(-2).y) /
            Math.max(1, signups.at(-2).y)) *
          100,
        series: signups,
        fmt: "number",
      },
      {
        key: "active",
        label: "Active Users",
        value: sumSeries(active),
        deltaPct:
          ((active.at(-1).y - active.at(-2).y) / Math.max(1, active.at(-2).y)) *
          100,
        series: active,
        fmt: "number",
      },
      {
        key: "cr",
        label: "Conversion",
        value: sumSeries(conversions),
        deltaPct:
          ((conversions.at(-1).y - conversions.at(-2).y) /
            Math.max(1, conversions.at(-2).y)) *
          100,
        series: conversions,
        fmt: "number",
      },
    ];

    const topLocales = [
      { locale: "en-CA", users: Math.round(3200 + Math.random() * 400) },
      { locale: "es-MX", users: Math.round(1800 + Math.random() * 250) },
      { locale: "es-CO", users: Math.round(1200 + Math.random() * 200) },
      { locale: "en-US", users: Math.round(900 + Math.random() * 150) },
      { locale: "es-AR", users: Math.round(700 + Math.random() * 120) },
    ];

    const recent = Array.from({ length: 8 }).map((_, i) => ({
      id: "evt_" + (1000 + i),
      when: Date.now() - i * 1000 * 60 * (10 + i),
      type: i % 3 === 0 ? "signup" : i % 3 === 1 ? "upgrade" : "report",
      actor: i % 2 ? "María G." : "Family #24" + i,
      detail:
        i % 3 === 0
          ? "Created account"
          : i % 3 === 1
          ? "Upgraded to Plus"
          : "Flagged message reviewed",
    }));

    return { ok: true, data: { kpis, topLocales, recent } };
  }

  // Example real fetches (adjust to your backend):
  const base = import.meta.env.VITE_API_URL;
  const qs = new URLSearchParams({ range }).toString();
  const [kpisRes, localesRes, recentRes] = await Promise.all([
    fetch(`${base}/analytics/kpis?${qs}`).then((r) => r.json()),
    fetch(`${base}/analytics/top-locales?${qs}`).then((r) => r.json()),
    fetch(`${base}/analytics/recent?${qs}`).then((r) => r.json()),
  ]);
  return {
    ok: true,
    data: {
      kpis: kpisRes.data,
      topLocales: localesRes.data,
      recent: recentRes.data,
    },
  };
}

export function formatValue(v, fmt = "number", currency = "USD") {
  if (fmt === "currency") {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(v / 100);
  }
  return new Intl.NumberFormat().format(v);
}
