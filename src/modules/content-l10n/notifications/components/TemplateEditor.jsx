import React, { useEffect, useState } from "react";
import Drawer from "../../components/Drawer.jsx";

export default function TemplateEditor({
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
      title={record ? "Edit Template" : "New Template"}
      wide
    >
      <form onSubmit={save} className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <div className="text-sm text-muted">Key</div>
          <input
            className="input mt-1 font-mono"
            value={form.key}
            onChange={(e) => change("key", e.target.value)}
            required
            disabled={!!record}
          />
        </label>
        <label className="block">
          <div className="text-sm text-muted">Channel</div>
          <select
            className="input mt-1"
            value={form.channel}
            onChange={(e) => change("channel", e.target.value)}
          >
            <option value="email">Email</option>
            <option value="push">Push</option>
            <option value="sms">SMS</option>
            <option value="inapp">In-app</option>
          </select>
        </label>
        <label className="block sm:col-span-2">
          <div className="text-sm text-muted">Subject / Title</div>
          <input
            className="input mt-1"
            value={form.subject}
            onChange={(e) => change("subject", e.target.value)}
          />
        </label>
        <label className="block sm:col-span-2">
          <div className="text-sm text-muted">Body</div>
          <textarea
            className="input mt-1"
            rows={10}
            value={form.body}
            onChange={(e) => change("body", e.target.value)}
          />
          <div className="text-xs text-muted mt-1">
            Variables like <code className="font-mono">{"{{name}}"}</code>{" "}
            supported in mock.
          </div>
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
  if (rec) return { ...rec };
  return { key: "", channel: "email", subject: "", body: "" };
}
function sanitize(f) {
  return { ...f };
}
