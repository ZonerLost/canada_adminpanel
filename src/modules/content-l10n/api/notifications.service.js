import axios from "axios";

const API_URL = import.meta.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));

const LS_TEMPLATES = "__cuidado_notify_templates__";
const LS_CAMPAIGNS = "__cuidado_notify_campaigns__";
const LS_LOGS = "__cuidado_notify_logs__";

function initMock() {
  if (!localStorage.getItem(LS_TEMPLATES)) {
    const seed = [
      {
        id: "nt1",
        key: "welcome_email",
        channel: "email",
        subject: "Welcome to CuidadoLatino",
        body: "Hola {{name}}, thanks for joining!",
        updated_at: Date.now() - 1000 * 60 * 60,
      },
      {
        id: "nt2",
        key: "weekly_digest",
        channel: "push",
        subject: "Your Weekly Digest",
        body: "Here’s what’s new…",
        updated_at: Date.now() - 1000 * 60 * 30,
      },
    ];
    localStorage.setItem(LS_TEMPLATES, JSON.stringify(seed));
  }
  if (!localStorage.getItem(LS_CAMPAIGNS)) {
    const seed = [
      {
        id: "c1",
        name: "Welcome Series",
        template_id: "nt1",
        audience: "new_users_7d",
        scheduled_at: null,
        status: "draft",
        created_at: Date.now() - 1000 * 60 * 60 * 12,
      },
      {
        id: "c2",
        name: "Weekly Digest",
        template_id: "nt2",
        audience: "all_users",
        scheduled_at: Date.now() + 1000 * 60 * 60 * 24,
        status: "scheduled",
        created_at: Date.now() - 1000 * 60 * 60 * 10,
      },
    ];
    localStorage.setItem(LS_CAMPAIGNS, JSON.stringify(seed));
  }
  if (!localStorage.getItem(LS_LOGS)) {
    const now = Date.now();
    const logs = Array.from({ length: 20 }).map((_, i) => ({
      id: "lg_" + (i + 1),
      ts: now - 1000 * 60 * 20 * i,
      template_key: i % 2 ? "weekly_digest" : "welcome_email",
      channel: i % 3 === 0 ? "email" : i % 3 === 1 ? "push" : "inapp",
      to: i % 2 ? `maria${i}@mail.com` : `user${i}@mail.com`,
      status: i % 6 === 0 ? "failed" : "sent",
    }));
    localStorage.setItem(LS_LOGS, JSON.stringify(logs));
  }
}
if (USE_MOCK) initMock();

function read(k) {
  return JSON.parse(localStorage.getItem(k) || "[]");
}
function write(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}
function paginate(list, { page = 1, pageSize = 10 }) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), page: p, pages, total };
}

/* Templates */
export async function listTemplates({
  q = "",
  channel = "",
  page = 1,
  pageSize = 10,
}) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_TEMPLATES);
    if (channel) rows = rows.filter((r) => r.channel === channel);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.key.toLowerCase().includes(s) ||
          (r.subject || "").toLowerCase().includes(s) ||
          (r.body || "").toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.updated_at - a.updated_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/notify/templates", {
    params: { q, channel, page, pageSize },
  });
  return data;
}
export async function upsertTemplate(payload) {
  // {id?, key, channel, subject, body}
  if (USE_MOCK) {
    await sleep(300);
    const rows = read(LS_TEMPLATES);
    const idx = payload.id ? rows.findIndex((r) => r.id === payload.id) : -1;
    if (idx > -1) {
      rows[idx] = { ...rows[idx], ...payload, updated_at: Date.now() };
    } else {
      rows.unshift({
        id: "nt_" + Math.random().toString(36).slice(2, 8),
        ...payload,
        updated_at: Date.now(),
      });
    }
    write(LS_TEMPLATES, rows);
    return { ok: true };
  }
  const { data } = await api.post("/notify/templates", payload);
  return data;
}
export async function deleteTemplate(id) {
  if (USE_MOCK) {
    await sleep(250);
    write(
      LS_TEMPLATES,
      read(LS_TEMPLATES).filter((r) => r.id !== id)
    );
    return { ok: true };
  }
  const { data } = await api.delete(`/notify/templates/${id}`);
  return data;
}

/* Campaigns */
export async function listCampaigns({
  status = "",
  q = "",
  page = 1,
  pageSize = 10,
}) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_CAMPAIGNS);
    if (status) rows = rows.filter((r) => r.status === status);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.audience.toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.created_at - a.created_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/notify/campaigns", {
    params: { status, q, page, pageSize },
  });
  return data;
}
export async function upsertCampaign(payload) {
  // {id?, name, template_id, audience, scheduled_at, status}
  if (USE_MOCK) {
    await sleep(300);
    const rows = read(LS_CAMPAIGNS);
    const idx = payload.id ? rows.findIndex((r) => r.id === payload.id) : -1;
    if (idx > -1) {
      rows[idx] = { ...rows[idx], ...payload };
    } else {
      rows.unshift({
        id: "c_" + Math.random().toString(36).slice(2, 8),
        ...payload,
        created_at: Date.now(),
      });
    }
    write(LS_CAMPAIGNS, rows);
    return { ok: true };
  }
  const { data } = await api.post("/notify/campaigns", payload);
  return data;
}
export async function cancelCampaign(id) {
  if (USE_MOCK) {
    await sleep(250);
    const rows = read(LS_CAMPAIGNS);
    const i = rows.findIndex((r) => r.id === id);
    if (i > -1) {
      rows[i].status = "canceled";
      write(LS_CAMPAIGNS, rows);
    }
    return { ok: true };
  }
  const { data } = await api.post(`/notify/campaigns/${id}/cancel`);
  return data;
}
export async function sendNow(id) {
  if (USE_MOCK) {
    await sleep(300);
    const rows = read(LS_CAMPAIGNS);
    const i = rows.findIndex((r) => r.id === id);
    if (i > -1) {
      rows[i].status = "sent";
      rows[i].scheduled_at = Date.now();
      write(LS_CAMPAIGNS, rows);
    }
    const logs = read(LS_LOGS);
    logs.unshift({
      id: "lg_" + Math.random().toString(36).slice(2, 9),
      ts: Date.now(),
      template_key: "campaign:" + rows[i]?.template_id,
      channel: "email",
      to: "bulk_audience",
      status: "sent",
    });
    write(LS_LOGS, logs);
    return { ok: true };
  }
  const { data } = await api.post(`/notify/campaigns/${id}/send-now`);
  return data;
}

/* Logs */
export async function listLogs({
  channel = "",
  status = "",
  q = "",
  page = 1,
  pageSize = 10,
}) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_LOGS);
    if (channel) rows = rows.filter((r) => r.channel === channel);
    if (status) rows = rows.filter((r) => r.status === status);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.template_key.toLowerCase().includes(s) ||
          r.to.toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.ts - a.ts);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/notify/logs", {
    params: { channel, status, q, page, pageSize },
  });
  return data;
}
