import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteTutorial,
  listTutorials,
  locales,
  upsertTutorial,
} from "../api/content.service.js";
import Drawer from "../components/Drawer.jsx";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Tutorials() {
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [locale, setLocale] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [locs, setLocs] = useState(["en", "es"]);
  const [form, setForm] = useState({ locale: "en", title: "", steps: [""] });

  useEffect(() => {
    (async () => {
      const r = await locales();
      if (r?.data) setLocs(r.data);
    })();
  }, []);

  const load = useCallback(
    async (p = page) => {
      const res = await listTutorials({ locale, q, page: p, pageSize: 10 });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
    },
    [locale, q, page]
  );
  useEffect(() => {
    load(1);
  }, [q, locale, load]);

  const subtitle = useMemo(
    () => `${total.toLocaleString()} tutorials`,
    [total]
  );

  function startNew() {
    setEdit(null);
    setForm({ locale: locs[0] || "en", title: "", steps: [""] });
    setOpen(true);
  }
  function startEdit(rec) {
    setEdit(rec);
    setForm({
      id: rec.id,
      locale: rec.locale,
      title: rec.title,
      steps: [...(rec.steps || [""])],
    });
    setOpen(true);
  }
  function changeStep(i, v) {
    setForm((f) => ({
      ...f,
      steps: f.steps.map((s, ix) => (ix === i ? v : s)),
    }));
  }
  function addStep() {
    setForm((f) => ({ ...f, steps: [...f.steps, ""] }));
  }
  function removeStep(i) {
    setForm((f) => ({ ...f, steps: f.steps.filter((_, ix) => ix !== i) }));
  }
  async function save(e) {
    e?.preventDefault?.();
    await upsertTutorial(form);
    setOpen(false);
    await load();
  }
  async function onDelete(id) {
    await deleteTutorial(id);
    setConfirm(null);
    await load();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Tutorials</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex gap-2">
          <input
            className="input w-56"
            placeholder="Search title/step…"
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
          <button className="btn" onClick={startNew}>
            New Tutorial
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[920px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Locale</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Steps</th>
                <th className="px-3 py-2">Updated</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <>
                  <SkeletonRow cols={5} />
                  <SkeletonRow cols={5} />
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-muted">
                    No tutorials.
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
                    <td className="px-3 py-2 text-muted">
                      {(r.steps || []).length} step(s)
                    </td>
                    <td className="px-3 py-2">
                      {new Date(r.updated_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
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
        title={edit ? "Edit tutorial" : "New tutorial"}
        wide
      >
        <form onSubmit={save} className="grid gap-3">
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
          <div className="grid gap-2">
            <div className="text-sm text-muted">Steps</div>
            {form.steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input flex-1"
                  value={s}
                  onChange={(e) => changeStep(i, e.target.value)}
                  placeholder={`Step ${i + 1}`}
                />
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => removeStep(i)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-ghost self-start"
              onClick={addStep}
            >
              Add step
            </button>
          </div>
          <div className="flex justify-end gap-2 pt-2">
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
        title="Delete tutorial?"
        message={`This will remove "${confirm?.title}".`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
