import React, { useEffect, useState } from "react";
import {
  createPolicy,
  deletePolicy,
  listPolicies,
  updatePolicy,
} from "../api/messaging.service.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Policies() {
  const [rows, setRows] = useState(null);
  const [edit, setEdit] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ key: "", title: "", text: "" });

  useEffect(() => {
    (async () => {
      const res = await listPolicies();
      setRows(res.data);
    })();
  }, []);

  function startNew() {
    setEdit("new");
    setForm({ key: "", title: "", text: "" });
  }
  function startEdit(r) {
    setEdit(r.id);
    setForm({ key: r.key, title: r.title, text: r.text });
  }
  function change(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setBusy(true);
    if (edit === "new") {
      const res = await createPolicy(form);
      setRows((r) => [res.data, ...(r || [])]);
    } else {
      const res = await updatePolicy(edit, form);
      setRows((r) => r.map((x) => (x.id === res.data.id ? res.data : x)));
    }
    setEdit(null);
    setBusy(false);
  }

  async function onDelete(id) {
    setBusy(true);
    await deletePolicy(id);
    setRows((r) => r.filter((x) => x.id !== id));
    setConfirm(null);
    setBusy(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Policies</h1>
          <div className="text-sm text-muted">
            Moderation rules visible to users.
          </div>
        </div>
        <button className="btn" onClick={startNew}>
          New Policy
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Key</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <>
                  <tr>
                    <td className="px-3 py-2">
                      <div className="skel h-4 w-40" />
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">
                      <div className="skel h-4 w-60" />
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-3 py-10 text-center text-muted">
                    No policies.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2">{r.key}</td>
                    <td className="px-3 py-2">{r.title}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1 justify-end">
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

        <div className="card p-4">
          {!edit ? (
            <div className="text-sm text-muted">
              Select a policy to edit, or create a new one.
            </div>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <label className="block">
                <div className="text-sm text-muted">Key</div>
                <input
                  className="input mt-1"
                  value={form.key}
                  onChange={(e) => change("key", e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <div className="text-sm text-muted">Title</div>
                <input
                  className="input mt-1"
                  value={form.title}
                  onChange={(e) => change("title", e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <div className="text-sm text-muted">Text</div>
                <textarea
                  className="input mt-1"
                  rows={6}
                  value={form.text}
                  onChange={(e) => change("text", e.target.value)}
                  required
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setEdit(null)}
                >
                  Cancel
                </button>
                <button className="btn" disabled={busy}>
                  {busy ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!confirm}
        title="Delete policy?"
        message={`This will remove "${confirm?.title}".`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
