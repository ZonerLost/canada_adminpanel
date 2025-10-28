import React from "react";
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search…",
}) {
  return (
    <div className="relative">
      <input
        className="input pl-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        ⌕
      </span>
    </div>
  );
}
