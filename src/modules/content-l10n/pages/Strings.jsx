import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteString,
  listStrings,
  locales,
  upsertString,
} from "../api/content.service.js";
import Drawer from "../components/Drawer.jsx";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Strings() {
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [ns, setNs] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [locs, setLocs] = useState(["en", "es"]);
  const [form, setForm] = useState({
    ns: "common",
    key: "",
    values: { en: "", es: "" },
  });

  useEffect(() => {
    (async () => {
      const r = await locales();
      if (r?.data) setLocs(r.data);
    })();
  }, []);

  const load = useCallback(
    async (p = page) => {
      const res = await listStrings({ ns, q, page: p, pageSize: 10 });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
    },
    [ns, q, page]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const subtitle = useMemo(() => `${total.toLocaleString()} keys`, [total]);

  function startNew() {
    setEdit(null);
    setForm({
      ns: "common",
      key: "",
      values: Object.fromEntries(locs.map((l) => [l, ""])),
    });
    setOpen(true);
  }
  function startEdit(rec) {
    setEdit(rec);
    setForm({
      id: rec.id,
      ns: rec.ns,
      key: rec.key,
      values: {
        ...Object.fromEntries(locs.map((l) => [l, ""])),
        ...(rec.values || {}),
      },
    });
    setOpen(true);
  }
  function changeValue(locale, v) {
    setForm((f) => ({ ...f, values: { ...f.values, [locale]: v } }));
  }
  async function save(e) {
    e?.preventDefault?.();
    await upsertString(form);
    setOpen(false);
    await load();
  }
  async function onDelete(id) {
    await deleteString(id);
    setConfirm(null);
    await load();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Localization Strings</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <input
            className="input w-full md:w-64"
            placeholder="Search key/text…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input w-full md:w-auto"
            value={ns}
            onChange={(e) => setNs(e.target.value)}
          >
            <option value="">All namespaces</option>
            <option value="common">common</option>
            <option value="auth">auth</option>
            <option value="app">app</option>
          </select>
          <button className="btn w-full md:w-auto" onClick={startNew}>
            New
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-full">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Namespace</th>
                <th className="px-3 py-2">Key</th>
                {locs.map((l, i) => (
                  <th
                    key={l}
                    className={`px-3 py-2 ${
                      i > 1 ? "hidden sm:table-cell" : ""
                    }`}
                  >
                    {l.toUpperCase()}
                  </th>
                ))}
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <>
                  <SkeletonRow cols={3 + locs.length} />
                  <SkeletonRow cols={3 + locs.length} />
                  <SkeletonRow cols={3 + locs.length} />
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={3 + locs.length}
                    className="px-3 py-10 text-center text-muted"
                  >
                    No keys.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2">{r.ns}</td>
                    <td className="px-3 py-2 font-mono">{r.key}</td>
                    {locs.map((l, i) => (
                      <td
                        key={l}
                        className={`px-3 py-2 ${
                          i > 1 ? "hidden sm:table-cell" : ""
                        }`}
                      >
                        {r.values?.[l] || <span className="text-muted">—</span>}
                      </td>
                    ))}
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
                          onClick={() => setConfirm({ id: r.id, key: r.key })}
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
        title={edit ? "Edit" : "New"}
        wide
      >
        <form onSubmit={save} className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <div className="text-sm text-muted">Namespace</div>
            <select
              className="input mt-1"
              value={form.ns}
              onChange={(e) => setForm((f) => ({ ...f, ns: e.target.value }))}
            >
              <option value="common">common</option>
              <option value="auth">auth</option>
              <option value="app">app</option>
            </select>
          </label>
          <label className="block">
            <div className="text-sm text-muted">Key</div>
            <input
              className="input mt-1 font-mono"
              value={form.key}
              onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
              required
              disabled={!!edit}
            />
          </label>
          {locs.map((l) => (
            <label key={l} className="block sm:col-span-2">
              <div className="text-sm text-muted">{l.toUpperCase()} Value</div>
              <input
                className="input mt-1"
                value={form.values?.[l] || ""}
                onChange={(e) => changeValue(l, e.target.value)}
              />
            </label>
          ))}
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
        title="Delete key?"
        message={`This will remove "${confirm?.key}".`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
