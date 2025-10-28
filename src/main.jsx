import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
import "./index.css";

const STORAGE_KEY = "__theme";

function currentSystemIsDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

function resolveTheme(mode) {
  if (mode === "dark" || mode === "light") return mode;
  return currentSystemIsDark() ? "dark" : "light"; // system
}

function applyTheme(mode) {
  const theme = resolveTheme(mode);
  document.documentElement.setAttribute("data-theme", theme);
}

function bootTheme() {
  const saved = localStorage.getItem(STORAGE_KEY) || "system";
  applyTheme(saved);

  if (saved === "system") {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener?.("change", onChange);
    window.__themeCleanup = () => mq.removeEventListener?.("change", onChange);
  }
}

bootTheme();

const rootEl = document.getElementById("root");
createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

window.addEventListener("unload", () => {
  if (typeof window.__themeCleanup === "function") window.__themeCleanup();
});
