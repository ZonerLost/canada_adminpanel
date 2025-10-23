import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeSwitch from "../shared/components/ThemeSwitch.jsx";

export default function Header({
  avatarSrc = "https://i.pravatar.cc/120",
  notifications = 0,
  notificationItems = null,
  onMenuClick,
  onSearch,
}) {
  const [q, setQ] = useState("");
  const [openNotif, setOpenNotif] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const wrapRef = useRef(null);
  const nav = useNavigate();
  const loc = useLocation();

  const items = useMemo(() => {
    if (Array.isArray(notificationItems)) return notificationItems;
    const count = Number(notifications) || 0;
    if (count <= 0) return [];
    return Array.from({ length: Math.min(count, 8) }).map((_, i) => ({
      id: `n-${i}`,
      title: `You have a new update #${i + 1}`,
      time: i === 0 ? "Just now" : `${i * 5}m ago`,
    }));
  }, [notificationItems, notifications]);

  useEffect(() => {
    function onDoc(e) {
      if (!openNotif) return;
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpenNotif(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpenNotif(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openNotif]);

  function submit(e) {
    e.preventDefault();
    onSearch?.(q.trim());
  }

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur"
      style={{
        background: "var(--surface)",
        borderBottom: `1px solid var(--border)`,
      }}
    >
      <div
        className="h-16 mx-auto flex items-center gap-3 px-3 sm:px-5"
        style={{ maxWidth: "2400px" }}
      >
        <button
          className="lg:hidden -ml-1 p-2 rounded-md"
          onClick={onMenuClick}
          aria-label="Open menu"
          style={{ background: "transparent" }}
        >
          ☰
        </button>
        {/* mobile search button */}
        <button
          className="md:hidden ml-2 p-2 rounded-md"
          aria-label="Search"
          onClick={() => setMobileSearch(true)}
        >
          🔍
        </button>
        <form onSubmit={submit} className="hidden md:flex items-center flex-1">
          <div
            className="flex items-center w-full max-w-6xl"
            style={{
              borderRadius: "999px",
              border: "1px solid var(--border)",
              boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
              background: "var(--surface)",
            }}
          >
            <div className="px-3 text-muted">⌕</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search anything…"
              className="w-full bg-transparent placeholder:text-muted text-sm py-2.5 pr-3 outline-none"
              style={{ color: "var(--text)" }}
            />
            <div className="px-2">
              <button type="submit" className="btn px-4">
                Search
              </button>
            </div>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <ThemeSwitch compact />
          <div className="h-6 w-px bg-gray-200 mx-1" />
          <div className="relative" ref={wrapRef}>
            <button
              type="button"
              onClick={() => setOpenNotif((v) => !v)}
              className="relative p-2.5 rounded-full"
              aria-label="Notifications"
              aria-haspopup="menu"
              aria-expanded={openNotif}
            >
              🔔
              {items.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-white text-[10px] px-1">
                  {items.length > 9 ? "9+" : items.length}
                </span>
              )}
            </button>

            {openNotif && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-80 bg-[var(--surface)] border rounded-xl overflow-hidden"
                style={{
                  borderColor: "var(--border)",
                  boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                }}
              >
                <div
                  className="px-4 py-3 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="text-sm font-semibold">Notifications</div>
                  <div className="text-xs text-muted">
                    {items.length > 0
                      ? `You have ${items.length} new notifications`
                      : "You're all caught up"}
                  </div>
                </div>
                <ul className="max-h-80 overflow-auto">
                  {items.length === 0 && (
                    <li className="px-4 py-6 text-sm text-muted">
                      No new notifications
                    </li>
                  )}
                  {items.map((n) => (
                    <li
                      key={n.id}
                      className="px-4 py-3 header-hoverable transition"
                    >
                      <div className="text-sm">{n.title}</div>
                      {n.time && (
                        <div className="text-xs text-muted">{n.time}</div>
                      )}
                    </li>
                  ))}
                </ul>
                <div
                  className="px-4 py-2 border-t header-muted-bg text-right"
                  style={{ borderColor: "var(--border)" }}
                >
                  <button
                    className="text-xs font-medium text-muted hover:text-text"
                    onClick={() => setOpenNotif(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() =>
              nav(loc.pathname.startsWith("/settings") ? "/" : "/settings")
            }
            className="p-2.5 rounded-full"
            aria-label="Settings"
          >
            ⚙
          </button>

          <button
            className="shrink-0 rounded-full overflow-hidden h-9 w-9 border"
            style={{ borderColor: "var(--border)" }}
          >
            <img
              src={avatarSrc}
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>
      {/* mobile search overlay */}
      {mobileSearch && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start p-4 md:hidden">
          <div
            className="w-full bg-[var(--surface)] p-3 rounded-lg"
            style={{ border: "1px solid var(--border)" }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSearch?.(q.trim());
                setMobileSearch(false);
              }}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search anything…"
                className="w-full bg-transparent placeholder:text-muted text-sm py-2.5 pr-3 outline-none"
                style={{ color: "var(--text)" }}
              />
              <button className="btn px-4" type="submit">
                Search
              </button>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setMobileSearch(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
