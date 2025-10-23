import React from "react";

export default function ColorInput({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-3">
      <span className="text-sm text-muted min-w-32">{label}</span>
      <input
        type="color"
        className="h-9 w-12 rounded border"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <input
        className="input"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </label>
  );
}
