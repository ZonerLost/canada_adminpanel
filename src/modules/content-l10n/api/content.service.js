import axios from "axios";

const API_URL = import.meta.env?.VITE_API_URL ?? "";
const USE_MOCK =
  (import.meta.env?.VITE_USE_MOCK ?? (API_URL ? "0" : "1")) === "1";
const api = API_URL ? axios.create({ baseURL: API_URL }) : null;
const sleep = (ms = 420) => new Promise((r) => setTimeout(r, ms));

const LS_STRINGS = "__cuidado_i18n_strings__";
const LS_PAGES = "__cuidado_cms_pages__";
const LS_TUTORIALS = "__cuidado_cms_tutorials__";

function initMock() {
  if (!localStorage.getItem(LS_STRINGS)) {
    const seed = [
      {
        id: "s1",
        ns: "common",
        key: "save",
        values: { en: "Save", es: "Guardar" },
        updated_at: Date.now() - 1000 * 60 * 60,
      },
      {
        id: "s2",
        ns: "common",
        key: "cancel",
        values: { en: "Cancel", es: "Cancelar" },
        updated_at: Date.now() - 1000 * 60 * 50,
      },
      {
        id: "s3",
        ns: "auth",
        key: "sign_in",
        values: { en: "Sign In", es: "Iniciar sesión" },
        updated_at: Date.now() - 1000 * 60 * 40,
      },
      {
        id: "s4",
        ns: "auth",
        key: "email",
        values: { en: "Email", es: "Correo" },
        updated_at: Date.now() - 1000 * 60 * 30,
      },
    ];
    localStorage.setItem(LS_STRINGS, JSON.stringify(seed));
  }
  if (!localStorage.getItem(LS_PAGES)) {
    const seed = [
      {
        id: "p1",
        locale: "en",
        slug: "about",
        title: "About CuidadoLatino",
        status: "published",
        content: "About us page content…",
        updated_at: Date.now() - 1000 * 60 * 60 * 6,
      },
      {
        id: "p2",
        locale: "es",
        slug: "sobre",
        title: "Sobre CuidadoLatino",
        status: "published",
        content: "Contenido de la página sobre…",
        updated_at: Date.now() - 1000 * 60 * 60 * 5,
      },
      {
        id: "p3",
        locale: "en",
        slug: "terms",
        title: "Terms of Service",
        status: "draft",
        content: "Draft terms…",
        updated_at: Date.now() - 1000 * 60 * 60 * 2,
      },
    ];
    localStorage.setItem(LS_PAGES, JSON.stringify(seed));
  }
  if (!localStorage.getItem(LS_TUTORIALS)) {
    const seed = [
      {
        id: "t1",
        locale: "en",
        title: "Getting Started",
        steps: ["Create account", "Complete profile", "Start browsing"],
        updated_at: Date.now() - 1000 * 60 * 60 * 8,
      },
      {
        id: "t2",
        locale: "es",
        title: "Primeros Pasos",
        steps: ["Crear cuenta", "Completar perfil", "Comenzar a explorar"],
        updated_at: Date.now() - 1000 * 60 * 60 * 7,
      },
    ];
    localStorage.setItem(LS_TUTORIALS, JSON.stringify(seed));
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

/* STRINGS (i18n) */
export async function listStrings({
  ns = "",
  q = "",
  page = 1,
  pageSize = 10,
}) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_STRINGS);
    if (ns) rows = rows.filter((r) => r.ns === ns);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.key.toLowerCase().includes(s) ||
          r.ns.toLowerCase().includes(s) ||
          Object.values(r.values || {}).some((v) =>
            (v || "").toLowerCase().includes(s)
          )
      );
    }
    rows.sort((a, b) => b.updated_at - a.updated_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/i18n/strings", {
    params: { ns, q, page, pageSize },
  });
  return data;
}
export async function upsertString(payload) {
  // {id?, ns, key, values}
  if (USE_MOCK) {
    await sleep(300);
    const rows = read(LS_STRINGS);
    const idx = payload.id ? rows.findIndex((r) => r.id === payload.id) : -1;
    if (idx > -1) {
      rows[idx] = { ...rows[idx], ...payload, updated_at: Date.now() };
    } else {
      rows.unshift({
        id: "s_" + Math.random().toString(36).slice(2, 8),
        ...payload,
        updated_at: Date.now(),
      });
    }
    write(LS_STRINGS, rows);
    return { ok: true };
  }
  const { data } = await api.post("/i18n/strings", payload);
  return data;
}
export async function deleteString(id) {
  if (USE_MOCK) {
    await sleep(250);
    write(
      LS_STRINGS,
      read(LS_STRINGS).filter((r) => r.id !== id)
    );
    return { ok: true };
  }
  const { data } = await api.delete(`/i18n/strings/${id}`);
  return data;
}
export async function locales() {
  if (USE_MOCK) return { ok: true, data: ["en", "es"] };
  const { data } = await api.get("/i18n/locales");
  return data;
}

/* PAGES (CMS) */
export async function listPages({
  locale = "",
  status = "",
  q = "",
  page = 1,
  pageSize = 10,
}) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_PAGES);
    if (locale) rows = rows.filter((r) => r.locale === locale);
    if (status) rows = rows.filter((r) => r.status === status);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.slug.toLowerCase().includes(s) ||
          (r.content || "").toLowerCase().includes(s)
      );
    }
    rows.sort((a, b) => b.updated_at - a.updated_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/cms/pages", {
    params: { locale, status, q, page, pageSize },
  });
  return data;
}
export async function upsertPage(payload) {
  // {id?, locale, slug, title, status, content}
  if (USE_MOCK) {
    await sleep(300);
    const rows = read(LS_PAGES);
    const idx = payload.id ? rows.findIndex((r) => r.id === payload.id) : -1;
    if (idx > -1) {
      rows[idx] = { ...rows[idx], ...payload, updated_at: Date.now() };
    } else {
      rows.unshift({
        id: "p_" + Math.random().toString(36).slice(2, 8),
        ...payload,
        updated_at: Date.now(),
      });
    }
    write(LS_PAGES, rows);
    return { ok: true };
  }
  const { data } = await api.post("/cms/pages", payload);
  return data;
}
export async function deletePage(id) {
  if (USE_MOCK) {
    await sleep(250);
    write(
      LS_PAGES,
      read(LS_PAGES).filter((r) => r.id !== id)
    );
    return { ok: true };
  }
  const { data } = await api.delete(`/cms/pages/${id}`);
  return data;
}

/* TUTORIALS */
export async function listTutorials({
  locale = "",
  q = "",
  page = 1,
  pageSize = 10,
}) {
  if (USE_MOCK) {
    await sleep();
    let rows = read(LS_TUTORIALS);
    if (locale) rows = rows.filter((r) => r.locale === locale);
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          (r.steps || []).some((x) => (x || "").toLowerCase().includes(s))
      );
    }
    rows.sort((a, b) => b.updated_at - a.updated_at);
    return { ok: true, ...paginate(rows, { page, pageSize }) };
  }
  const { data } = await api.get("/cms/tutorials", {
    params: { locale, q, page, pageSize },
  });
  return data;
}
export async function upsertTutorial(payload) {
  // {id?, locale, title, steps[]}
  if (USE_MOCK) {
    await sleep(300);
    const rows = read(LS_TUTORIALS);
    const idx = payload.id ? rows.findIndex((r) => r.id === payload.id) : -1;
    if (idx > -1) {
      rows[idx] = { ...rows[idx], ...payload, updated_at: Date.now() };
    } else {
      rows.unshift({
        id: "t_" + Math.random().toString(36).slice(2, 8),
        ...payload,
        updated_at: Date.now(),
      });
    }
    write(LS_TUTORIALS, rows);
    return { ok: true };
  }
  const { data } = await api.post("/cms/tutorials", payload);
  return data;
}
export async function deleteTutorial(id) {
  if (USE_MOCK) {
    await sleep(250);
    write(
      LS_TUTORIALS,
      read(LS_TUTORIALS).filter((r) => r.id !== id)
    );
    return { ok: true };
  }
  const { data } = await api.delete(`/cms/tutorials/${id}`);
  return data;
}
