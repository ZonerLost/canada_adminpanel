import React, { useEffect, useState } from "react";

const STORAGE_KEY = "__theme";
const prefersDark = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(next) {
  const root = document.documentElement;
  const theme = next === "system" ? (prefersDark() ? "dark" : "light") : next;
  root.setAttribute("data-theme", theme);
}

export default function ThemeSwitch({ compact = false }) {
  const [mode, setMode] = useState(
    localStorage.getItem(STORAGE_KEY) || "system"
  );

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const fn = () => applyTheme("system");
      mq.addEventListener?.("change", fn);
      return () => mq.removeEventListener?.("change", fn);
    }
  }, [mode]);

  if (compact) {
    const isDark = (mode === "system" && prefersDark()) || mode === "dark";
    return (
      <button
        className="btn-ghost rounded-full px-3"
        title="Toggle theme"
        onClick={() =>
          setMode(isDark ? "light" : mode === "light" ? "dark" : "system")
        }
      >
        <span className="font-mono text-xs">
          {mode === "system" ? "SYS" : mode.toUpperCase()}
        </span>
      </button>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-1 bg-[var(--surface)] border rounded-xl p-1"
      style={{ borderColor: "var(--border)" }}
    >
      {["light", "system", "dark"].map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`px-2 py-1 rounded-lg text-sm ${
            mode === m
              ? "bg-[var(--primary)] text-white"
              : "text-muted hover:text-text"
          }`}
        >
          {m === "light" ? "Light" : m === "dark" ? "Dark" : "System"}
        </button>
      ))}
    </div>
  );
}
