import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PATHS } from "../routes/paths";

const NAV = [
  { label: "Dashboard", path: PATHS?.DASHBOARD || "/" },
  { label: "People", path: "/people" },
  { label: "Listings", path: "/listings" },
  { label: "Messaging", path: "/messaging" },
  { label: "Billing", path: "/billing" },
  { label: "Content", path: "/content" },
  { label: "FAQ", path: PATHS?.FAQ || "/faq" },
  { label: "Settings", path: PATHS?.SETTINGS || "/settings" },
];

export default function LeftSidebar({
  open,
  onClose,
  logoSrc = "/assets/Logo.png",
}) {
  const { pathname } = useLocation();
  const isActive = (p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[var(--surface)] border-r transform transition-transform duration-200 ease-in-out
          ${
            open ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 flex flex-col`}
        style={{ borderColor: "var(--border)" }}
      >
        <div className="h-16 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={logoSrc}
              alt="Logo"
              className="h-8 w-8 rounded-md object-contain"
            />
            <span className="font-semibold">Admin</span>
          </div>
          <button
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="px-5">
          <div className="h-px" style={{ background: "var(--border)" }} />
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-2">
            {NAV.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="group relative flex items-center gap-3 px-3 py-2 rounded-xl transition"
                    style={{
                      background: active
                        ? "linear-gradient(135deg,var(--primary),#6ea8fe)"
                        : "transparent",
                      color: active ? "#fff" : "var(--text)",
                    }}
                  >
                    <span
                      className={`text-sm font-medium ${
                        active ? "text-white" : "text-inherit"
                      }`}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <span className="absolute right-3 h-2 w-2 rounded-full bg-white/90" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto">
          <div className="px-5">
            <div className="h-px" style={{ background: "var(--border)" }} />
          </div>
          <div className="px-3 py-4">
            <Link
              to="/auth/login"
              onClick={() => {
                localStorage.removeItem("__token");
                onClose?.();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:bg-black/5 transition"
            >
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
