import React, { useEffect, useState } from "react";
import {
  createPlan,
  deletePlan,
  listPlans,
  updatePlan,
} from "../api/billing.service.js";
import PriceEditor from "../components/PriceEditor.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Pricing() {
  const [rows, setRows] = useState(null);
  const [edit, setEdit] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [_busy, setBusy] = useState(false);

  async function load() {
    const res = await listPlans();
    setRows(res.data);
  }
  useEffect(() => {
    load();
  }, []);

  async function onCreate(payload) {
    setBusy(true);
    const res = await createPlan(payload);
    setRows((r) => [res.data, ...(r || [])]);
    setEdit(null);
    setBusy(false);
  }
  async function onEditSave(payload) {
    setBusy(true);
    const res = await updatePlan(edit.id, payload);
    setRows((r) => r.map((x) => (x.id === res.data.id ? res.data : x)));
    setEdit(null);
    setBusy(false);
  }
  async function onDelete(id) {
    setBusy(true);
    await deletePlan(id);
    setRows((r) => r.filter((x) => x.id !== id));
    setConfirm(null);
    setBusy(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pricing Plans</h1>
          <div className="text-sm text-muted">Manage subscription plans.</div>
        </div>
        <button className="btn" onClick={() => setEdit("new")}>
          New Plan
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-muted">
            <tr>
              <th className="px-3 py-2">Key</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Interval</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Features</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!rows ? (
              <>
                <tr>
                  <td className="px-3 py-2">
                    <div className="skel h-4 w-28" />
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td className="px-3 py-2">
                    <div className="skel h-4 w-40" />
                  </td>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              </>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-muted">
                  No plans.
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
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2">
                    {(r.amount / 100).toLocaleString(undefined, {
                      style: "currency",
                      currency: r.currency,
                    })}
                  </td>
                  <td className="px-3 py-2 capitalize">{r.interval}</td>
                  <td className="px-3 py-2 capitalize">{r.status}</td>
                  <td className="px-3 py-2">
                    {(r.features || []).join(", ") || "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1 justify-end">
                      <button className="btn-ghost" onClick={() => setEdit(r)}>
                        Edit
                      </button>
                      <button
                        className="btn-ghost"
                        onClick={() => setConfirm({ id: r.id, name: r.name })}
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

      {edit && (
        <PriceEditor
          open={!!edit}
          record={edit === "new" ? null : edit}
          onClose={() => setEdit(null)}
          onSubmit={(payload) =>
            edit === "new" ? onCreate(payload) : onEditSave(payload)
          }
        />
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Delete plan?"
        message={`This will remove "${confirm?.name}".`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
