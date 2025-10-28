import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteTemplate,
  listTemplates,
  upsertTemplate,
} from "../api/notifications.service.js";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import TemplateEditor from "./components/TemplateEditor.jsx";

export default function Templates() {
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [channel, setChannel] = useState("");
  const [edit, setEdit] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(
    async (p = page) => {
      const res = await listTemplates({ q, channel, page: p, pageSize: 10 });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
    },
    [q, channel, page]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const subtitle = useMemo(
    () => `${total.toLocaleString()} templates`,
    [total]
  );

  function startNew() {
    setEdit(null);
    setOpen(true);
  }
  function startEdit(r) {
    setEdit(r);
    setOpen(true);
  }
  async function save(payload) {
    await upsertTemplate(edit ? { ...payload, id: edit.id } : payload);
    setOpen(false);
    await load();
  }
  async function onDelete(id) {
    await deleteTemplate(id);
    setConfirm(null);
    await load();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notification Templates</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="input w-full sm:w-64 max-w-xs"
            placeholder="Search key/subject/body…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input shrink-0"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option value="">All channels</option>
            <option value="email">Email</option>
            <option value="push">Push</option>
            <option value="sms">SMS</option>
            <option value="inapp">In-app</option>
          </select>
          <button className="btn shrink-0" onClick={startNew}>
            New Template
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-full">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Key</th>
                <th className="px-3 py-2 hidden sm:table-cell">Channel</th>
                <th className="px-3 py-2">Subject/Title</th>
                <th className="px-3 py-2 hidden sm:table-cell">Updated</th>
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
                    No templates.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2 font-mono">{r.key}</td>
                    <td className="px-3 py-2 hidden sm:table-cell capitalize">
                      {r.channel}
                    </td>
                    <td className="px-3 py-2">{r.subject || "—"}</td>
                    <td className="px-3 py-2 hidden sm:table-cell">
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

      <TemplateEditor
        open={open}
        record={edit}
        onClose={() => setOpen(false)}
        onSubmit={save}
      />

      <ConfirmDialog
        open={!!confirm}
        title="Delete template?"
        message={`This will remove "${confirm?.key}".`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
