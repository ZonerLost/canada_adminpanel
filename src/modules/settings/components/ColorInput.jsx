import React from "react";

export default function ColorInput({ label, value, onChange }) {
  // Ensure we always pass a valid hex color to the color input
  const safe = value || "#000000";

  function handleChange(v) {
    if (!v) return onChange?.("");
    // normalize to lowercase hex
    onChange?.(String(v).trim());
  }

  return (
    <label className="flex items-center gap-3">
      <span className="text-sm text-muted min-w-[8rem]">{label}</span>
      <input
        aria-label={`${label} color`}
        type="color"
        className="h-9 w-12 rounded border"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        value={safe}
        onChange={(e) => handleChange(e.target.value)}
      />
      <input
        aria-label={`${label} hex`}
        className="input"
        value={safe}
        onChange={(e) => handleChange(e.target.value)}
      />
    </label>
  );
}
