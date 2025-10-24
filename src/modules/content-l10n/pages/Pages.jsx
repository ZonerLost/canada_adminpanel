import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  deletePage,
  listPages,
  locales,
  upsertPage,
} from "../api/content.service.js";
import Drawer from "../components/Drawer.jsx";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Pages() {
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [locale, setLocale] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [locs, setLocs] = useState(["en", "es"]);
  const [form, setForm] = useState({
    locale: "en",
    slug: "",
    title: "",
    status: "draft",
    content: "",
  });

  useEffect(() => {
    (async () => {
      const r = await locales();
      if (r?.data) setLocs(r.data);
    })();
  }, []);

  const load = useCallback(
    async (p = page) => {
      const res = await listPages({ locale, status, q, page: p, pageSize: 10 });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
    },
    [locale, status, q, page]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const subtitle = useMemo(() => `${total.toLocaleString()} pages`, [total]);

  function startNew() {
    setEdit(null);
    setForm({
      locale: locs[0] || "en",
      slug: "",
      title: "",
      status: "draft",
      content: "",
    });
    setOpen(true);
  }
  function startEdit(rec) {
    setEdit(rec);
    setForm({ ...rec });
    setOpen(true);
  }
  async function save(e) {
    e?.preventDefault?.();
    await upsertPage(form);
    setOpen(false);
    await load();
  }
  async function onDelete(id) {
    await deletePage(id);
    setConfirm(null);
    await load();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">CMS Pages</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex gap-2">
          <input
            className="input w-56"
            placeholder="Search title/slug…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
          >
            <option value="">All locales</option>
            {locs.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <button className="btn" onClick={startNew}>
            New Page
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-full">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Locale</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2 hidden sm:table-cell">Slug</th>
                <th className="px-3 py-2 hidden sm:table-cell">Status</th>
                <th className="px-3 py-2 hidden md:table-cell">Updated</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <>
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-muted">
                    No pages.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2">{r.locale.toUpperCase()}</td>
                    <td className="px-3 py-2">{r.title}</td>
                    <td className="px-3 py-2 hidden sm:table-cell font-mono">
                      /{r.slug}
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell capitalize">
                      {r.status}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {new Date(r.updated_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1 flex-wrap">
                        <button
                          className="btn-ghost"
                          onClick={() => startEdit(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-ghost"
                          onClick={() =>
                            setConfirm({ id: r.id, title: r.title })
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className="px-3 py-2 border-t text-xs text-muted flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            Page {page} of {pages}
          </div>
          <div className="flex gap-2">
            <button
              className="btn-ghost text-sm"
              disabled={page <= 1}
              onClick={() => load(page - 1)}
            >
              Prev
            </button>
            <button
              className="btn-ghost text-sm"
              disabled={page >= pages}
              onClick={() => load(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={edit ? "Edit page" : "New page"}
        wide
      >
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <div className="text-sm text-muted">Locale</div>
            <select
              className="input mt-1"
              value={form.locale}
              onChange={(e) =>
                setForm((f) => ({ ...f, locale: e.target.value }))
              }
            >
              {locs.map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <div className="text-sm text-muted">Slug</div>
            <div className="flex items-center gap-2">
              <span className="text-muted text-sm">/</span>
              <input
                className="input mt-1 flex-1"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    slug: e.target.value.replace(/^\//, ""),
                  }))
                }
                required
              />
            </div>
          </label>
          <label className="block sm:col-span-2">
            <div className="text-sm text-muted">Title</div>
            <input
              className="input mt-1"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </label>
          <label className="block sm:col-span-2">
            <div className="text-sm text-muted">Content</div>
            <textarea
              className="input mt-1"
              rows={8}
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
            />
          </label>
          <label className="block">
            <div className="text-sm text-muted">Status</div>
            <select
              className="input mt-1"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="btn" type="submit">
              {edit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        open={!!confirm}
        title="Delete page?"
        message={`This will remove "${confirm?.title}".`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
