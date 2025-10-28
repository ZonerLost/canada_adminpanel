import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));

const LS_PLANS = "__cuidado_plans__";
const LS_SUBS = "__cuidado_subscriptions__";
const LS_BOOST = "__cuidado_boosts__";
const LS_TXNS = "__cuidado_txns__";

function initMock() {
  if (!localStorage.getItem(LS_PLANS)) {
    const plans = [
      {
        id: "plan_basic_m",
        key: "basic",
        name: "Basic",
        amount: 990,
        currency: "USD",
        interval: "month",
        status: "active",
        features: ["Standard access"],
      },
      {
        id: "plan_plus_m",
        key: "plus",
        name: "Plus",
        amount: 1990,
        currency: "USD",
        interval: "month",
        status: "active",
        features: ["Priority placement", "Messaging perks"],
      },
      {
        id: "plan_pro_m",
        key: "pro",
        name: "Pro",
        amount: 3490,
        currency: "USD",
        interval: "month",
        status: "active",
        features: ["Top placement", "Analytics"],
      },
    ];
    localStorage.setItem(LS_PLANS, JSON.stringify(plans));
  }
  if (!localStorage.getItem(LS_SUBS)) {
    const now = Date.now();
    const subs = Array.from({ length: 16 }).map((_, i) => ({
      id: "sub_" + (1000 + i),
      user_email: i % 2 === 0 ? `maria${i}@mail.com` : `family${i}@mail.com`,
      user_name: i % 2 === 0 ? `María ${i}` : `Family ${100 + i}`,
      plan_id:
        i % 3 === 0
          ? "plan_plus_m"
          : i % 3 === 1
          ? "plan_basic_m"
          : "plan_pro_m",
      status:
        i % 7 === 0
          ? "canceled"
          : i % 5 === 0
          ? "past_due"
          : i % 6 === 0
          ? "trialing"
          : "active",
      started_at: now - 1000 * 60 * 60 * 24 * (20 + i),
      current_period_end: now + 1000 * 60 * 60 * 24 * (10 - (i % 9)),
      last_charge_amount: i % 3 === 0 ? 1990 : i % 3 === 1 ? 990 : 3490,
      currency: "USD",
      renews: true,
    }));
    localStorage.setItem(LS_SUBS, JSON.stringify(subs));
  }
  if (!localStorage.getItem(LS_BOOST)) {
    const now = Date.now();
    const boosts = Array.from({ length: 10 }).map((_, i) => ({
      id: "boost_" + (i + 1),
      listing_id: (i + 1).toString(),
      listing_title: i % 2 ? "Part-time nanny" : "Elder care aide",
      employer: i % 2 ? `Employer ${80 + i}` : `Family ${60 + i}`,
      started_at: now - 1000 * 60 * 60 * 12 * (i + 1),
      ends_at: now + 1000 * 60 * 60 * 24 * ((i % 5) + 1),
      days_purchased: (i % 5) + 1,
      status: "active",
      amount: 299 * ((i % 5) + 1),
      currency: "USD",
    }));
    localStorage.setItem(LS_BOOST, JSON.stringify(boosts));
  }
  if (!localStorage.getItem(LS_TXNS)) {
    localStorage.setItem(LS_TXNS, JSON.stringify([]));
  }
}
if (USE_MOCK) initMock();

function read(k) {
  return JSON.parse(localStorage.getItem(k) || "[]");
}
function write(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}
function money(cents, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format((cents || 0) / 100);
}
function paginate(list, { page = 1, pageSize = 10 }) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), page: p, pages, total };
}

/* Plans */
export async function listPlans() {
  if (USE_MOCK) {
    await sleep(200);
    return { ok: true, data: read(LS_PLANS) };
  }
  const { data } = await api.get("/billing/plans");
  return data;
}
export async function createPlan(payload) {
  if (USE_MOCK) {
    await sleep(300);
    const rows = read(LS_PLANS);
    const rec = {
      ...payload,
      id: "plan_" + Math.random().toString(36).slice(2, 8),
    };
    rows.unshift(rec);
    write(LS_PLANS, rows);
    return { ok: true, data: rec };
  }
  const { data } = await api.post("/billing/plans", payload);
  return data;
}
export async function updatePlan(id, patch) {
  if (USE_MOCK) {
    await sleep(300);
    const rows = read(LS_PLANS);
    const i = rows.findIndex((x) => x.id === id);
    rows[i] = { ...rows[i], ...patch };
    write(LS_PLANS, rows);
    return { ok: true, data: rows[i] };
  }
  const { data } = await api.put(`/billing/plans/${id}`, patch);
  return data;
}
export async function deletePlan(id) {
  if (USE_MOCK) {
    await sleep(250);
    write(
      LS_PLANS,
      read(LS_PLANS).filter((x) => x.id !== id)
    );
    return { ok: true };
  }
  const { data } = await api.delete(`/billing/plans/${id}`);
  return data;
}

/* Subscriptions */
export async function listSubscriptions({
  status = "",
  q = "",
  page = 1,
  pageSize = 10,
}) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_SUBS);
    if (status) rows = rows.filter((r) => r.status === status);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.user_email.toLowerCase().includes(s) ||
          r.user_name.toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.started_at - a.started_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/billing/subscriptions", {
    params: { status, q, page, pageSize },
  });
  return data;
}
export async function changePlan(subId, toPlanId) {
  if (USE_MOCK) {
    await sleep(300);
    const subs = read(LS_SUBS);
    const i = subs.findIndex((x) => x.id === subId);
    if (i > -1) {
      subs[i].plan_id = toPlanId;
      write(LS_SUBS, subs);
    }
    return { ok: true, data: subs[i] };
  }
  const { data } = await api.post(
    `/billing/subscriptions/${subId}/change-plan`,
    { plan_id: toPlanId }
  );
  return data;
}
export async function updateSubscription(subId, patch) {
  if (USE_MOCK) {
    await sleep(300);
    const subs = read(LS_SUBS);
    const i = subs.findIndex((x) => x.id === subId);
    if (i > -1) {
      subs[i] = { ...subs[i], ...patch };
      write(LS_SUBS, subs);
    }
    return { ok: true, data: subs[i] };
  }
  const { data } = await api.put(`/billing/subscriptions/${subId}`, patch);
  return data;
}
export async function cancelSubscription(subId) {
  if (USE_MOCK) {
    await sleep(250);
    const subs = read(LS_SUBS);
    const i = subs.findIndex((x) => x.id === subId);
    if (i > -1) {
      subs[i].status = "canceled";
      subs[i].renews = false;
      write(LS_SUBS, subs);
    }
    return { ok: true, data: subs[i] };
  }
  const { data } = await api.post(`/billing/subscriptions/${subId}/cancel`);
  return data;
}
export async function compSubscription(subId, months = 1) {
  if (USE_MOCK) {
    await sleep(250);
    const subs = read(LS_SUBS);
    const i = subs.findIndex((x) => x.id === subId);
    if (i > -1) {
      subs[i].current_period_end += 1000 * 60 * 60 * 24 * 30 * months;
      write(LS_SUBS, subs);
    }
    return { ok: true, data: subs[i] };
  }
  const { data } = await api.post(`/billing/subscriptions/${subId}/comp`, {
    months,
  });
  return data;
}
export async function refundSubscription(subId, amount, reason = "") {
  if (USE_MOCK) {
    await sleep(300);
    const subs = read(LS_SUBS);
    const s = subs.find((x) => x.id === subId);
    const txns = read(LS_TXNS);
    txns.unshift({
      id: "txn_" + Math.random().toString(36).slice(2, 9),
      type: "refund",
      subId,
      amount,
      currency: s?.currency || "USD",
      reason,
      ts: Date.now(),
    });
    write(LS_TXNS, txns);
    return { ok: true };
  }
  const { data } = await api.post(`/billing/subscriptions/${subId}/refund`, {
    amount,
    reason,
  });
  return data;
}

/* Boosts */
export async function listBoosts({ q = "", page = 1, pageSize = 10 }) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_BOOST);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.listing_title.toLowerCase().includes(s) ||
          r.employer.toLowerCase().includes(s) ||
          r.listing_id.toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.started_at - a.started_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/billing/boosts", {
    params: { q, page, pageSize },
  });
  return data;
}
export async function extendBoost(id, days = 3) {
  if (USE_MOCK) {
    await sleep(250);
    const rows = read(LS_BOOST);
    const i = rows.findIndex((x) => x.id === id);
    if (i > -1) {
      rows[i].ends_at += 1000 * 60 * 60 * 24 * Number(days || 1);
      rows[i].days_purchased += Number(days || 1);
      write(LS_BOOST, rows);
    }
    return { ok: true, data: rows[i] };
  }
  const { data } = await api.post(`/billing/boosts/${id}/extend`, { days });
  return data;
}
export async function clearBoost(id) {
  if (USE_MOCK) {
    await sleep(200);
    const rows = read(LS_BOOST);
    const i = rows.findIndex((x) => x.id === id);
    if (i > -1) {
      rows[i].status = "ended";
      rows[i].ends_at = Date.now();
      write(LS_BOOST, rows);
    }
    return { ok: true, data: rows[i] };
  }
  const { data } = await api.post(`/billing/boosts/${id}/end`);
  return data;
}

export function formatMoney(cents, c = "USD") {
  return money(cents, c);
}
