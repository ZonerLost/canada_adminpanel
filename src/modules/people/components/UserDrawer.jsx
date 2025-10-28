import React, { useEffect, useState } from "react";
import Drawer from "./Drawer.jsx";
import {
  approveUser,
  suspendUser,
  restoreUser,
} from "../api/people.service.js";

export default function UserDrawer({
  open,
  mode = "create",
  role,
  record = null,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(makeInitial(mode, role, record));
  const isEdit = mode === "edit";

  useEffect(() => {
    setForm(makeInitial(mode, role, record));
  }, [open, mode, role, record]);

  function change(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function submit(e) {
    e?.preventDefault?.();
    onSubmit?.(sanitize(form));
  }

  async function doApprove() {
    if (!isEdit || !form?.id) return;
    if (!confirm("Approve this user?")) return;
    const res = await approveUser(form.id);
    if (res?.ok) {
      onSubmit?.(res.data);
      onClose?.();
    }
  }

  async function doSuspend() {
    if (!isEdit || !form?.id) return;
    if (!confirm("Suspend this user?")) return;
    const res = await suspendUser(form.id);
    if (res?.ok) {
      onSubmit?.(res.data);
      onClose?.();
    }
  }

  async function doRestore() {
    if (!isEdit || !form?.id) return;
    if (!confirm("Restore / reactivate this user?")) return;
    const res = await restoreUser(form.id);
    if (res?.ok) {
      onSubmit?.(res.data);
      onClose?.();
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit User" : "New User"}
      wide
    >
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <div className="text-sm text-muted">Role</div>
          <select
            className="input mt-1"
            value={form.role}
            onChange={(e) => change("role", e.target.value)}
            required
          >
            <option value="caregiver">Caregiver</option>
            <option value="employer">Employer</option>
          </select>
        </label>
        <label className="block">
          <div className="text-sm text-muted">Tier</div>
          <select
            className="input mt-1"
            value={form.tier}
            onChange={(e) => change("tier", e.target.value)}
          >
            <option value="free">Free</option>
            <option value="gold">Gold</option>
          </select>
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
          <div className="text-sm text-muted">Email</div>
          <input
            className="input mt-1"
            type="email"
            value={form.email}
            onChange={(e) => change("email", e.target.value)}
            required
          />
        </label>

        <label className="block">
          <div className="text-sm text-muted">Phone</div>
          <input
            className="input mt-1"
            value={form.phone}
            onChange={(e) => change("phone", e.target.value)}
          />
        </label>
        <label className="block">
          <div className="text-sm text-muted">Locale</div>
          <select
            className="input mt-1"
            value={form.locale}
            onChange={(e) => change("locale", e.target.value)}
          >
            <option value="es">ES – Español</option>
            <option value="en">EN – English</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <div className="text-sm text-muted">Location</div>
          <input
            className="input mt-1"
            value={form.location}
            onChange={(e) => change("location", e.target.value)}
          />
        </label>

        {form.role === "caregiver" ? (
          <>
            <label className="block">
              <div className="text-sm text-muted">Experience (years)</div>
              <input
                className="input mt-1"
                type="number"
                min="0"
                value={form.experience_years}
                onChange={(e) => change("experience_years", +e.target.value)}
              />
            </label>
            <label className="block">
              <div className="text-sm text-muted">
                Languages (comma separated)
              </div>
              <input
                className="input mt-1"
                value={form.languages}
                onChange={(e) => change("languages", e.target.value)}
                placeholder="es, en"
              />
            </label>
            <label className="block sm:col-span-2">
              <div className="text-sm text-muted">
                Certifications (comma separated)
              </div>
              <input
                className="input mt-1"
                value={form.certifications}
                onChange={(e) => change("certifications", e.target.value)}
                placeholder="CPR, First Aid"
              />
            </label>
          </>
        ) : (
          <>
            <label className="block">
              <div className="text-sm text-muted">Company</div>
              <input
                className="input mt-1"
                value={form.company}
                onChange={(e) => change("company", e.target.value)}
              />
            </label>
            <label className="block">
              <div className="text-sm text-muted">Openings</div>
              <input
                className="input mt-1"
                type="number"
                min="0"
                value={form.openings}
                onChange={(e) => change("openings", +e.target.value)}
              />
            </label>
          </>
        )}

        <label className="block sm:col-span-2">
          <div className="text-sm text-muted">Notes</div>
          <textarea
            className="input mt-1"
            rows={3}
            value={form.notes}
            onChange={(e) => change("notes", e.target.value)}
          />
        </label>

        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          {isEdit && (
            <>
              {form?.status === "suspended" ? (
                <button
                  type="button"
                  className="btn-ghost text-sky-500"
                  onClick={doRestore}
                >
                  Restore
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-ghost text-amber-500"
                    onClick={doSuspend}
                  >
                    Suspend
                  </button>
                  <button
                    type="button"
                    className="btn-ghost text-emerald-500"
                    onClick={doApprove}
                  >
                    Approve
                  </button>
                </>
              )}
            </>
          )}
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" type="submit">
            {isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

function makeInitial(mode, role, record) {
  if (mode === "edit" && record) {
    return {
      ...record,
      languages: (record.languages || []).join(", "),
      certifications: (record.certifications || []).join(", "),
    };
  }
  return {
    role: role || "caregiver",
    tier: "free",
    name: "",
    email: "",
    phone: "",
    locale: "es",
    location: "",
    experience_years: 0,
    languages: "",
    certifications: "",
    company: "",
    openings: 1,
    notes: "",
  };
}
function sanitize(f) {
  const out = { ...f };
  if (out.role === "caregiver") {
    out.languages = splitCsv(out.languages);
    out.certifications = splitCsv(out.certifications);
    out.company = null;
    out.openings = 0;
  } else {
    out.languages = [];
    out.certifications = [];
    out.experience_years = null;
  }
  return out;
}
function splitCsv(s) {
  return (s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}
