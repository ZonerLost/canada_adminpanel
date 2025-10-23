import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));

const LS_CONV = "__cuidado_msgs_conversations__";
const LS_REPORTS = "__cuidado_msgs_reports__";
const LS_POLICIES = "__cuidado_msgs_policies__";

function initMock() {
  if (!localStorage.getItem(LS_CONV)) {
    const now = Date.now();
    const convs = Array.from({ length: 22 }).map((_, i) => ({
      id: (i + 1).toString(),
      subject:
        i % 2
          ? "Inquiry about caregiver availability"
          : "Follow up on schedule",
      a_user: i % 2 ? "María G." : "John E.",
      b_user: i % 2 ? "Family 102" : "Ana C.",
      last_msg: i % 3 === 0 ? "Thanks, noted!" : "Could you share references?",
      unread_for_admin: i % 5 === 0 ? 2 : 0,
      updated_at: now - 1000 * 60 * 15 * i,
    }));
    const messagesPer = {};
    convs.forEach((c) => {
      const base = [
        {
          id: cryptoRand(),
          from: c.a_user,
          text: "Hello! I’m interested.",
          ts: c.updated_at - 1000 * 60 * 40,
        },
        {
          id: cryptoRand(),
          from: c.b_user,
          text: "Great! Can you share availability?",
          ts: c.updated_at - 1000 * 60 * 35,
        },
        {
          id: cryptoRand(),
          from: c.a_user,
          text: "Evenings and weekends.",
          ts: c.updated_at - 1000 * 60 * 30,
        },
      ];
      messagesPer[c.id] = base;
    });
    localStorage.setItem(LS_CONV, JSON.stringify({ list: convs, messagesPer }));
  }
  if (!localStorage.getItem(LS_REPORTS)) {
    const now = Date.now();
    const reports = Array.from({ length: 14 }).map((_, i) => ({
      id: (i + 1).toString(),
      type: i % 3 === 0 ? "harassment" : i % 3 === 1 ? "spam" : "misinfo",
      status: i % 4 === 0 ? "closed" : "open",
      reported_by: i % 2 ? "María G." : "Family 101",
      target_user: i % 2 ? "Family 101" : "María G.",
      conversation_id: ((i % 8) + 1).toString(),
      note: "Inappropriate message reported.",
      created_at: now - 1000 * 60 * 60 * (i + 2),
    }));
    localStorage.setItem(LS_REPORTS, JSON.stringify(reports));
  }
  if (!localStorage.getItem(LS_POLICIES)) {
    const policies = [
      {
        id: "p1",
        key: "harassment",
        title: "Harassment & Abuse",
        text: "Zero tolerance. Repeated offense → suspension.",
      },
      {
        id: "p2",
        key: "spam",
        title: "Spam",
        text: "No unsolicited ads. Auto-flag repeated offenders.",
      },
      {
        id: "p3",
        key: "privacy",
        title: "Privacy",
        text: "No sharing of private info without consent.",
      },
    ];
    localStorage.setItem(LS_POLICIES, JSON.stringify(policies));
  }
}
function cryptoRand() {
  return Math.random().toString(36).slice(2, 10);
}
if (USE_MOCK) initMock();

function paginate(list, { page = 1, pageSize = 10 }) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), page: p, pages, total };
}

/* Conversations */
export async function listConversations({ q = "", page = 1, pageSize = 10 }) {
  if (USE_MOCK) {
    await sleep();
    const store = JSON.parse(localStorage.getItem(LS_CONV));
    let rows = store.list;
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (c) =>
          c.subject.toLowerCase().includes(s) ||
          c.a_user.toLowerCase().includes(s) ||
          c.b_user.toLowerCase().includes(s)
      );
    }
    rows = rows.sort((a, b) => b.updated_at - a.updated_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/messaging/conversations", {
    params: { q, page, pageSize },
  });
  return data;
}

export async function getThread(conversationId) {
  if (USE_MOCK) {
    await sleep(250);
    const store = JSON.parse(localStorage.getItem(LS_CONV));
    const item = store.list.find((c) => c.id === conversationId);
    const msgs = store.messagesPer[conversationId] || [];
    return { ok: true, data: { conversation: item, messages: msgs } };
  }
  const { data } = await api.get(`/messaging/conversations/${conversationId}`);
  return data;
}

export async function postAdminNote(conversationId, text) {
  if (USE_MOCK) {
    await sleep(200);
    const store = JSON.parse(localStorage.getItem(LS_CONV));
    const msg = { id: cryptoRand(), from: "Admin", text, ts: Date.now() };
    store.messagesPer[conversationId] = [
      ...(store.messagesPer[conversationId] || []),
      msg,
    ];
    const conv = store.list.find((c) => c.id === conversationId);
    if (conv) {
      conv.last_msg = text;
      conv.updated_at = msg.ts;
    }
    localStorage.setItem(LS_CONV, JSON.stringify(store));
    return { ok: true, data: msg };
  }
  const { data } = await api.post(
    `/messaging/conversations/${conversationId}/note`,
    { text }
  );
  return data;
}

/* Reports */
export async function listReports({
  status = "",
  q = "",
  page = 1,
  pageSize = 10,
}) {
  if (USE_MOCK) {
    await sleep();
    let rows = JSON.parse(localStorage.getItem(LS_REPORTS));
    if (status) rows = rows.filter((r) => r.status === status);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.type.toLowerCase().includes(s) ||
          r.reported_by.toLowerCase().includes(s) ||
          r.target_user.toLowerCase().includes(s) ||
          r.note.toLowerCase().includes(s)
      );
    }
    rows = rows.sort((a, b) => b.created_at - a.created_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/reports", {
    params: { status, q, page, pageSize },
  });
  return data;
}

export async function getReport(id) {
  if (USE_MOCK) {
    await sleep(200);
    const rows = JSON.parse(localStorage.getItem(LS_REPORTS));
    const rec = rows.find((r) => r.id === id);
    return { ok: true, data: rec };
  }
  const { data } = await api.get(`/reports/${id}`);
  return data;
}

export async function actOnReport(id, action, adminNote = "") {
  if (USE_MOCK) {
    await sleep(300);
    const rows = JSON.parse(localStorage.getItem(LS_REPORTS));
    const idx = rows.findIndex((r) => r.id === id);
    if (idx > -1) {
      if (action === "close") rows[idx].status = "closed";
      if (action === "reopen") rows[idx].status = "open";
      rows[idx].admin_note = adminNote || rows[idx].admin_note || "";
      localStorage.setItem(LS_REPORTS, JSON.stringify(rows));
    }
    return { ok: true, data: rows[idx] };
  }
  const { data } = await api.post(`/reports/${id}/action`, {
    action,
    adminNote,
  });
  return data;
}

export async function suspendUser(targetUser) {
  if (USE_MOCK) {
    await sleep(250);
    return { ok: true };
  }
  const { data } = await api.post(`/users/suspend`, { user: targetUser });
  return data;
}

/* Policies */
export async function listPolicies() {
  if (USE_MOCK) {
    await sleep(200);
    return { ok: true, data: JSON.parse(localStorage.getItem(LS_POLICIES)) };
  }
  const { data } = await api.get(`/policies`);
  return data;
}
export async function createPolicy(payload) {
  if (USE_MOCK) {
    await sleep(250);
    const rows = JSON.parse(localStorage.getItem(LS_POLICIES));
    const rec = { id: cryptoRand(), ...payload };
    rows.unshift(rec);
    localStorage.setItem(LS_POLICIES, JSON.stringify(rows));
    return { ok: true, data: rec };
  }
  const { data } = await api.post(`/policies`, payload);
  return data;
}
export async function updatePolicy(id, patch) {
  if (USE_MOCK) {
    await sleep(250);
    const rows = JSON.parse(localStorage.getItem(LS_POLICIES));
    const i = rows.findIndex((x) => x.id === id);
    rows[i] = { ...rows[i], ...patch };
    localStorage.setItem(LS_POLICIES, JSON.stringify(rows));
    return { ok: true, data: rows[i] };
  }
  const { data } = await api.put(`/policies/${id}`, patch);
  return data;
}
export async function deletePolicy(id) {
  if (USE_MOCK) {
    await sleep(250);
    const rows = JSON.parse(localStorage.getItem(LS_POLICIES)).filter(
      (x) => x.id !== id
    );
    localStorage.setItem(LS_POLICIES, JSON.stringify(rows));
    return { ok: true };
  }
  const { data } = await api.delete(`/policies/${id}`);
  return data;
}
