import axios from "axios";

const API_URL = import.meta?.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta?.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------ MOCK STORE ------------------------------ */
const LS_KEY = "__cuidado_people__";

function initMock() {
  const exists = localStorage.getItem(LS_KEY);
  if (exists) return;
  const now = Date.now();
  const seed = [];
  const roles = ["caregiver", "employer"];
  const locales = ["es", "en"];
  const _statuses = ["pending", "approved", "suspended"];
  for (let i = 1; i <= 32; i++) {
    seed.push({
      id: i.toString(),
      role: roles[i % 2],
      name: i % 2 ? `María Gomez ${i}` : `John Employer ${i}`,
      email: `user${i}@mail.com`,
      phone: `+1-555-01${String(i).padStart(2, "0")}`,
      locale: locales[i % 2],
      tier: i % 4 === 0 ? "gold" : "free",
      status: i % 6 === 0 ? "pending" : i % 5 === 0 ? "suspended" : "approved",
      location: i % 2 ? "Toronto, ON" : "Vancouver, BC",
      last_active: now - 1000 * 60 * 60 * (i % 48),
      created_at: now - 1000 * 60 * 60 * 24 * (i % 30),
      // caregiver fields (optional)
      experience_years: i % 2 ? 1 + (i % 7) : null,
      languages: i % 2 ? ["es", "en"].slice(0, (i % 2) + 1) : [],
      certifications:
        i % 2 ? (i % 3 === 0 ? ["CPR", "First Aid"] : ["First Aid"]) : [],
      // employer fields (optional)
      company: i % 2 ? null : `Family ${i}`,
      openings: i % 2 ? 0 : i % 3 === 0 ? 2 : 1,
      boosted_until:
        i % 2 ? null : i % 4 === 0 ? now + 1000 * 60 * 60 * 24 * 3 : null,
      notes: "",
    });
  }
  localStorage.setItem(LS_KEY, JSON.stringify(seed));
}
if (USE_MOCK) initMock();

function readAll() {
  return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
}
function writeAll(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

function paginate(list, { page = 1, pageSize = 10 }) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), page: p, pages, total };
}

/* ------------------------------ API SHAPE ------------------------------- */
export async function listUsers({ role, status, q, page = 1, pageSize = 10 }) {
  if (USE_MOCK) {
    await sleep();
    let rows = readAll();
    if (role) rows = rows.filter((r) => r.role === role);
    if (status) rows = rows.filter((r) => r.status === status);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name?.toLowerCase().includes(s) ||
          r.email?.toLowerCase().includes(s) ||
          r.phone?.toLowerCase().includes(s) ||
          r.location?.toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.created_at - a.created_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/people", {
    params: { role, status, q, page, pageSize },
  });
  return data;
}

export async function getUserById(id) {
  if (USE_MOCK) {
    await sleep();
    const r = readAll().find((x) => x.id === id);
    if (!r) throw new Error("Not found");
    return { ok: true, data: r };
  }
  const { data } = await api.get(`/people/${id}`);
  return data;
}

export async function createUser(payload) {
  if (USE_MOCK) {
    await sleep(500);
    const rows = readAll();
    const id = (Math.max(0, ...rows.map((r) => +r.id)) + 1).toString();
    const now = Date.now();
    const rec = {
      id,
      status: "pending",
      tier: "free",
      last_active: now,
      created_at: now,
      ...payload,
    };
    rows.unshift(rec);
    writeAll(rows);
    return { ok: true, data: rec };
  }
  const { data } = await api.post("/people", payload);
  return data;
}

export async function updateUser(id, patch) {
  if (USE_MOCK) {
    await sleep(400);
    const rows = readAll();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Not found");
    rows[idx] = { ...rows[idx], ...patch };
    writeAll(rows);
    return { ok: true, data: rows[idx] };
  }
  const { data } = await api.put(`/people/${id}`, patch);
  return data;
}

export async function deleteUser(id) {
  if (USE_MOCK) {
    await sleep(400);
    const rows = readAll().filter((r) => r.id !== id);
    writeAll(rows);
    return { ok: true };
  }
  const { data } = await api.delete(`/people/${id}`);
  return data;
}

export async function approveUser(id) {
  return updateUser(id, { status: "approved" });
}
export async function suspendUser(id) {
  return updateUser(id, { status: "suspended" });
}
export async function restoreUser(id) {
  return updateUser(id, { status: "approved" });
}
