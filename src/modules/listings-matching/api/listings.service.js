import axios from "axios";

const API_URL = import.meta.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));

const LS_LISTINGS = "__cuidado_listings__";
const LS_MATCHES = "__cuidado_matches__";
const LS_RULES = "__cuidado_match_rules__";

function initMock() {
  if (!localStorage.getItem(LS_LISTINGS)) {
    const now = Date.now();
    const seed = Array.from({ length: 18 }).map((_, i) => ({
      id: (i + 1).toString(),
      title:
        i % 3 === 0
          ? "Live-in caregiver"
          : i % 3 === 1
          ? "Part-time nanny"
          : "Elder care aide",
      employer_name: i % 2 === 0 ? `Family ${100 + i}` : `Employer ${200 + i}`,
      location: i % 2 === 0 ? "Toronto, ON" : "Vancouver, BC",
      description: "Looking for a caring, experienced person.",
      openings: (i % 3) + 1,
      status: i % 4 === 0 ? "draft" : i % 5 === 0 ? "closed" : "live",
      boosted_until:
        i % 4 === 0
          ? null
          : i % 3 === 0
          ? now + 1000 * 60 * 60 * 24 * (1 + (i % 5))
          : null,
      created_at: now - 1000 * 60 * 60 * 24 * (i + 1),
      updated_at: now - 1000 * 60 * 60 * (i + 2),
      visibility: "public",
    }));
    localStorage.setItem(LS_LISTINGS, JSON.stringify(seed));
  }

  if (!localStorage.getItem(LS_MATCHES)) {
    const now = Date.now();
    const seed = Array.from({ length: 24 }).map((_, i) => ({
      id: (i + 1).toString(),
      caregiver_name: i % 2 === 0 ? `María ${i}` : `Ana ${i}`,
      employer_name: i % 3 === 0 ? `Family ${50 + i}` : `Employer ${70 + i}`,
      listing_id: ((i % 10) + 1).toString(),
      score: 62 + (i % 35),
      created_at: now - 1000 * 60 * 45 * i,
    }));
    localStorage.setItem(LS_MATCHES, JSON.stringify(seed));
  }

  if (!localStorage.getItem(LS_RULES)) {
    const rules = {
      distance_km: 25,
      min_score: 70,
      shared_languages_weight: 0.4,
      certifications_weight: 0.3,
      experience_weight: 0.3,
    };
    localStorage.setItem(LS_RULES, JSON.stringify(rules));
  }
}
if (USE_MOCK) initMock();

function read(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}
function write(key, v) {
  localStorage.setItem(key, JSON.stringify(v));
}

function paginate(list, { page = 1, pageSize = 10 }) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(Math.max(1, page), pages);
  const start = (p - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), page: p, pages, total };
}

/* Listings */
export async function listListings({
  status = "",
  q = "",
  page = 1,
  pageSize = 10,
}) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_LISTINGS);
    if (status) rows = rows.filter((r) => r.status === status);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.employer_name.toLowerCase().includes(s) ||
          r.location.toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.created_at - a.created_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/listings", {
    params: { status, q, page, pageSize },
  });
  return data;
}

export async function createListing(payload) {
  if (USE_MOCK) {
    await sleep(500);
    const rows = read(LS_LISTINGS);
    const id = (Math.max(0, ...rows.map((r) => +r.id)) + 1).toString();
    const now = Date.now();
    const rec = {
      id,
      status: "draft",
      visibility: "public",
      boosted_until: null,
      created_at: now,
      updated_at: now,
      ...payload,
    };
    rows.unshift(rec);
    write(LS_LISTINGS, rows);
    return { ok: true, data: rec };
  }
  const { data } = await api.post("/listings", payload);
  return data;
}

export async function updateListing(id, patch) {
  if (USE_MOCK) {
    await sleep(420);
    const rows = read(LS_LISTINGS);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error("Not found");
    rows[idx] = { ...rows[idx], ...patch, updated_at: Date.now() };
    write(LS_LISTINGS, rows);
    return { ok: true, data: rows[idx] };
  }
  const { data } = await api.put(`/listings/${id}`, patch);
  return data;
}

export async function deleteListing(id) {
  if (USE_MOCK) {
    await sleep(420);
    write(
      LS_LISTINGS,
      read(LS_LISTINGS).filter((r) => r.id !== id)
    );
    return { ok: true };
  }
  const { data } = await api.delete(`/listings/${id}`);
  return data;
}

export async function publishListing(id) {
  return updateListing(id, { status: "live" });
}
export async function unpublishListing(id) {
  return updateListing(id, { status: "draft" });
}
export async function closeListing(id) {
  return updateListing(id, { status: "closed" });
}
export async function boostListing(id, days = 3) {
  const until = Date.now() + 1000 * 60 * 60 * 24 * Number(days || 3);
  return updateListing(id, { boosted_until: until });
}
export async function clearBoost(id) {
  return updateListing(id, { boosted_until: null });
}

/* Matches */
export async function listMatches({ q = "", page = 1, pageSize = 10 }) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_MATCHES);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.caregiver_name.toLowerCase().includes(s) ||
          r.employer_name.toLowerCase().includes(s) ||
          r.listing_id.toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.created_at - a.created_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/matches", { params: { q, page, pageSize } });
  return data;
}

export async function unlinkMatch(id) {
  if (USE_MOCK) {
    await sleep(300);
    write(
      LS_MATCHES,
      read(LS_MATCHES).filter((m) => m.id !== id)
    );
    return { ok: true };
  }
  const { data } = await api.delete(`/matches/${id}`);
  return data;
}

/* Rules */
export async function getRules() {
  if (USE_MOCK) {
    await sleep(200);
    return { ok: true, data: JSON.parse(localStorage.getItem(LS_RULES)) };
  }
  const { data } = await api.get("/matching/rules");
  return data;
}
export async function updateRules(patch) {
  if (USE_MOCK) {
    await sleep(300);
    const prev = JSON.parse(localStorage.getItem(LS_RULES));
    const next = { ...prev, ...patch };
    localStorage.setItem(LS_RULES, JSON.stringify(next));
    return { ok: true, data: next };
  }
  const { data } = await api.put("/matching/rules", patch);
  return data;
}
