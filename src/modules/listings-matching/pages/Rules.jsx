import React, { useEffect, useState } from "react";
import { getRules, updateRules } from "../api/listings.service.js";

export default function Rules() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await getRules();
      setForm(res.data);
    })();
  }, []);

  if (!form)
    return (
      <div className="card p-6">
        <div className="skel h-6 w-40 mb-3" />
        <div className="skel h-4 w-full" />
      </div>
    );

  async function save() {
    setSaving(true);
    await updateRules(form);
    setSaving(false);
    setMsg("Saved");
    setTimeout(() => setMsg(""), 1500);
  }

  function change(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Matching Rules</h1>
          <div className="text-sm text-muted">
            Adjust thresholds and weights used by the matcher.
          </div>
        </div>
        <button className="btn" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="card p-4 grid sm:grid-cols-2 gap-3">
        <Field
          label="Distance radius (km)"
          type="number"
          min="1"
          value={form.distance_km}
          onChange={(v) => change("distance_km", +v)}
        />
        <Field
          label="Minimum compatibility score"
          type="number"
          min="0"
          max="100"
          value={form.min_score}
          onChange={(v) => change("min_score", +v)}
        />
        <Field
          label="Weight: shared languages"
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={form.shared_languages_weight}
          onChange={(v) => change("shared_languages_weight", +v)}
        />
        <Field
          label="Weight: certifications"
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={form.certifications_weight}
          onChange={(v) => change("certifications_weight", +v)}
        />
        <Field
          label="Weight: experience"
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={form.experience_weight}
          onChange={(v) => change("experience_weight", +v)}
        />
      </div>

      {!!msg && <div className="text-sm text-muted">{msg}</div>}
    </div>
  );
}

function Field({ label, type = "text", ...rest }) {
  return (
    <label className="block">
      <div className="text-sm text-muted">{label}</div>
      <input
        className="input mt-1"
        type={type}
        {...rest}
        onChange={(e) => rest.onChange(e.target.value)}
      />
    </label>
  );
}
