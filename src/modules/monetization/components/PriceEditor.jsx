import React, { useEffect, useState } from "react";
import Drawer from "./Drawer.jsx";

export default function PriceEditor({
  open,
  record = null,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(makeInitial(record));
  useEffect(() => {
    setForm(makeInitial(record));
  }, [open, record]);

  function change(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function save(e) {
    e?.preventDefault?.();
    onSubmit?.(sanitize(form));
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={record ? "Edit Plan" : "New Plan"}
      wide
    >
      <form onSubmit={save} className="grid sm:grid-cols-2 gap-3">
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
          <div className="text-sm text-muted">Name</div>
          <input
            className="input mt-1"
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            required
          />
        </label>
        <label className="block">
          <div className="text-sm text-muted">Amount (cents)</div>
          <input
            className="input mt-1"
            type="number"
            min="0"
            value={form.amount}
            onChange={(e) => change("amount", Number(e.target.value || 0))}
            required
          />
        </label>
        <label className="block">
          <div className="text-sm text-muted">Currency</div>
          <select
            className="input mt-1"
            value={form.currency}
            onChange={(e) => change("currency", e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="CAD">CAD</option>
          </select>
        </label>
        <label className="block">
          <div className="text-sm text-muted">Interval</div>
          <select
            className="input mt-1"
            value={form.interval}
            onChange={(e) => change("interval", e.target.value)}
          >
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
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
            <option value="hidden">Hidden</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <div className="text-sm text-muted">Features (comma separated)</div>
          <input
            className="input mt-1"
            value={form.features}
            onChange={(e) => change("features", e.target.value)}
          />
        </label>
        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" type="submit">
            {record ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

function makeInitial(rec) {
  if (rec) return { ...rec, features: (rec.features || []).join(", ") };
  return {
    key: "",
    name: "",
    amount: 0,
    currency: "USD",
    interval: "month",
    status: "active",
    features: "",
  };
}
function sanitize(f) {
  return {
    ...f,
    features: (f.features || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}
