import React, { useEffect, useState } from "react";
import Drawer from "./Drawer.jsx";

export default function SubscriptionDrawer({
  open,
  record = null,
  plans = [],
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(makeInitial(record));
  useEffect(() => setForm(makeInitial(record)), [open, record]);

  function change(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e) {
    e?.preventDefault?.();
    onSave?.(form);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={record ? "Edit Subscription" : "New Subscription"}
      wide
    >
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
        <label className="block sm:col-span-2">
          <div className="text-sm text-muted">User</div>
          <div className="mt-1">
            {form.user_name} — {form.user_email}
          </div>
        </label>

        <label className="block">
          <div className="text-sm text-muted">Plan</div>
          <select
            className="input mt-1"
            value={form.plan_id}
            onChange={(e) => change("plan_id", e.target.value)}
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="text-sm text-muted">Status</div>
          <select
            className="input mt-1"
            value={form.status}
            onChange={(e) => change("status", e.target.value)}
          >
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past due</option>
            <option value="canceled">Canceled</option>
          </select>
        </label>

        <label className="block">
          <div className="text-sm text-muted">Started</div>
          <input
            className="input mt-1"
            type="date"
            value={formatDate(form.started_at)}
            onChange={(e) => change("started_at", parseDate(e.target.value))}
          />
        </label>

        <label className="block">
          <div className="text-sm text-muted">Period end</div>
          <input
            className="input mt-1"
            type="date"
            value={formatDate(form.current_period_end)}
            onChange={(e) =>
              change("current_period_end", parseDate(e.target.value))
            }
          />
        </label>

        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </Drawer>
  );
}

function makeInitial(r) {
  if (!r)
    return {
      user_name: "",
      user_email: "",
      plan_id: "",
      status: "active",
      started_at: Date.now(),
      current_period_end: Date.now(),
    };
  return { ...r };
}
function formatDate(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toISOString().slice(0, 10);
}
function parseDate(val) {
  if (!val) return null;
  return new Date(val).getTime();
}
