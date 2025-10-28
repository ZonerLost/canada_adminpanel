import React, { useEffect, useState } from "react";
import Drawer from "../../components/Drawer.jsx";

export default function CampaignBuilder({
  open,
  record = null,
  templates = [],
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
      title={record ? "Edit Campaign" : "New Campaign"}
      wide
    >
      <form onSubmit={save} className="grid sm:grid-cols-2 gap-3">
        <label className="block sm:col-span-2">
          <div className="text-sm text-muted">Name</div>
          <input
            className="input mt-1"
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            required
          />
        </label>
        <label className="block">
          <div className="text-sm text-muted">Template</div>
          <select
            className="input mt-1"
            value={form.template_id}
            onChange={(e) => change("template_id", e.target.value)}
          >
            <option value="">Select template…</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.key} • {t.channel}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <div className="text-sm text-muted">Audience</div>
          <input
            className="input mt-1"
            value={form.audience}
            onChange={(e) => change("audience", e.target.value)}
            placeholder="Segment key (e.g. all_users)"
            required
          />
        </label>
        <label className="block">
          <div className="text-sm text-muted">Schedule</div>
          <input
            className="input mt-1"
            type="datetime-local"
            value={form.scheduled_at}
            onChange={(e) => change("scheduled_at", e.target.value)}
          />
        </label>
        <label className="block">
          <div className="text-sm text-muted">Status</div>
          <select
            className="input mt-1"
            value={form.status}
            onChange={(e) => change("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="canceled">Canceled</option>
          </select>
        </label>
        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" type="submit">
            {record ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

function makeInitial(rec) {
  if (rec) return { ...rec, scheduled_at: toLocalDT(rec.scheduled_at) };
  return {
    name: "",
    template_id: "",
    audience: "all_users",
    scheduled_at: "",
    status: "draft",
  };
}
function sanitize(f) {
  return { ...f, scheduled_at: fromLocalDT(f.scheduled_at) };
}
function toLocalDT(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}
function fromLocalDT(s) {
  return s ? new Date(s).getTime() : null;
}
