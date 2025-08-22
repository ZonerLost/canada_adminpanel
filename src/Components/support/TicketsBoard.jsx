import React, { useMemo, useState } from "react";
import { MdFilterAlt, MdSearch, MdDownload, MdDoneAll } from "react-icons/md";
import { COLORS } from "../../Pages/SupportMediaSettingsPage";

const STATUSES = ["All", "New", "Open", "Pending", "Resolved", "Closed"];
const PRIORITY = ["All", "Low", "Medium", "High"];

const StatusPill = ({ s }) => {
  const map = {
    New: COLORS.info,
    Open: COLORS.purple,
    Pending: COLORS.warn,
    Resolved: COLORS.success,
    Closed: COLORS.text2,
  };
  const bg = map[s] || COLORS.text2;
  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${bg}22`, color: bg }}>
      {s}
    </span>
  );
};

const TicketsBoard = ({ data = [], onSelect, onExport, onResolve }) => {
  const [status, setStatus] = useState("All");
  const [prio, setPrio] = useState("All");
  const [assignee, setAssignee] = useState("All");
  const [search, setSearch] = useState("");

  const assignees = useMemo(() => ["All", ...Array.from(new Set(data.map((d) => d.assignee).filter(Boolean)))], [data]);

  const filtered = useMemo(() => {
    return data.filter((t) => {
      if (status !== "All" && t.status !== status) return false;
      if (prio !== "All" && t.priority !== prio) return false;
      if (assignee !== "All" && t.assignee !== assignee) return false;
      if (search && ![t.subject, t.user?.email, t.user?.name].join("|").toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [data, status, prio, assignee, search]);

  return (
    <div className="rounded-2xl" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
      {/* toolbar */}
      <div
        className="px-3 sm:px-4 py-3 flex flex-col gap-3 lg:flex-row lg:items-center rounded-t-2xl"
        style={{ backgroundColor: COLORS.bg2, borderBottom: `1px solid ${COLORS.ring}` }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {STATUSES.map((s) => {
            const active = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  background: active ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})` : "transparent",
                  color: active ? "#0B0B0F" : COLORS.text2,
                  border: active ? "none" : `1px solid ${COLORS.ring}`,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 text-xs" style={{ color: COLORS.text2 }}>
            <MdFilterAlt /> Filters
          </div>
          <select
            value={prio}
            onChange={(e) => setPrio(e.target.value)}
            className="h-9 rounded-lg px-2 text-sm"
            style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
          >
            {PRIORITY.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="h-9 rounded-lg px-2 text-sm"
            style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
          >
            {assignees.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <div className="relative">
            <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.text2 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subject, user…"
              className="h-9 w-64 xl:w-80 rounded-lg pl-9 pr-3 text-sm outline-none"
              style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
            />
          </div>

          <button
            className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
            style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color: "#0B0B0F" }}
            onClick={() => onExport?.(filtered)}
          >
            <MdDownload /> Export
          </button>
        </div>
      </div>

      {/* list (mobile) */}
      <div className="md:hidden p-3 space-y-3">
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect?.(t)}
            className="w-full text-left rounded-xl p-3"
            style={{ backgroundColor: "#0F1118", border: `1px solid ${COLORS.ring}`, color: COLORS.text }}
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold">{t.subject}</div>
              <StatusPill s={t.status} />
            </div>
            <div className="text-xs mt-1" style={{ color: COLORS.text2 }}>
              {t.user?.name} • {t.user?.email}
            </div>
            <div className="text-xs mt-1" style={{ color: COLORS.text2 }}>
              Priority: {t.priority} • Assignee: {t.assignee || "—"}
            </div>
          </button>
        ))}
        {!filtered.length && (
          <div className="text-sm text-center py-8" style={{ color: COLORS.text2 }}>
            No tickets match current filters.
          </div>
        )}
      </div>

      {/* table (desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[980px] w-full text-sm" style={{ color: COLORS.text }}>
          <thead>
            <tr style={{ color: COLORS.text2, borderBottom: `1px solid ${COLORS.ring}` }}>
              <th className="py-3 px-3 text-left">Subject</th>
              <th className="py-3 text-left">User</th>
              <th className="py-3 text-left">Status</th>
              <th className="py-3 text-left">Priority</th>
              <th className="py-3 text-left">Assignee</th>
              <th className="py-3 text-left">SLA Due</th>
              <th className="py-3 text-left">Updated</th>
              <th className="py-3 text-right pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const zebra = i % 2 === 1;
              return (
                <tr key={t.id} className={zebra ? "bg-[#141622]" : ""} style={{ borderBottom: `1px solid ${COLORS.ring}` }}>
                  <td className="py-3 px-3 font-medium">{t.subject}</td>
                  <td className="py-3">{t.user?.name} • {t.user?.email}</td>
                  <td className="py-3"><StatusPill s={t.status} /></td>
                  <td className="py-3">{t.priority}</td>
                  <td className="py-3">{t.assignee || "—"}</td>
                  <td className="py-3">{t.slaDue || "—"}</td>
                  <td className="py-3">{t.updatedAt}</td>
                  <td className="py-3 pr-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
                        style={{ backgroundColor: "#12131A", border: `1px solid ${COLORS.ring}` }}
                        onClick={() => onSelect?.(t)}
                      >
                        View
                      </button>
                      {t.status !== "Resolved" && (
                        <button
                          className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1"
                          style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color: "#0B0B0F" }}
                          onClick={() => onResolve?.(t.id)}
                        >
                          <MdDoneAll size={16} /> Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filtered.length && (
              <tr>
                <td colSpan={8} className="py-8 text-center" style={{ color: COLORS.text2 }}>
                  No tickets match current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsBoard;
