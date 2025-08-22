import React, { useMemo, useState } from "react";
import {
  MdAdd,
  MdFilterAlt,
  MdSearch,
  MdEdit,
  MdVisibility,
  MdDownload,
  MdMail,
  MdSmartphone,
  MdWeb,
} from "react-icons/md";

const COLORS = {
  text: "#E6E8F0",
  text2: "#A3A7B7",
  card: "#161821",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

const ChannelIcon = ({ type, size = 16 }) => {
  if (type === "email") return <MdMail size={size} />;
  if (type === "push") return <MdSmartphone size={size} />;
  return <MdWeb size={size} />; // inapp
};

const Checkbox = ({ checked, onChange }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className="accent-[#6E56CF]"
    />
  </label>
);

const BroadcastBoard = ({
  data = [],
  onCreate,
  onEdit,
  onSelect,
  onExport,
}) => {
  const [segment, setSegment] = useState("All"); // All / Free / Paid / VIP / Brokers / Inactive
  const [channel, setChannel] = useState("All"); // All / push / inapp / email
  const [status, setStatus] = useState("All"); // Draft / Scheduled / Sent / Sending / Cancelled
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const segments = ["All", "Free", "Paid", "VIP", "Brokers", "Inactive"];

  const filtered = useMemo(() => {
    return data.filter((c) => {
      const segOk = segment === "All" || (c.segments || []).includes(segment);
      const chOk = channel === "All" || c.channel === channel;
      const stOk = status === "All" || c.status === status;
      const q = search.trim().toLowerCase();
      const qOk =
        !q ||
        [c.name, c.subject, c.title, c.id].some((x) =>
          (x || "").toLowerCase().includes(q)
        );
      return segOk && chOk && stOk && qOk;
    });
  }, [data, segment, channel, status, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = useMemo(() => {
    const s = (page - 1) * perPage;
    return filtered.slice(s, s + perPage);
  }, [filtered, page]);

  const toggleAll = (v) =>
    setChecked(v ? new Set(pageRows.map((r) => r.id)) : new Set());
  const allSelected =
    pageRows.length > 0 && pageRows.every((r) => checked.has(r.id));

  return (
    <div
      className="rounded-2xl"
      style={{
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.ring}`,
      }}
    >
      {/* Toolbar */}
      <div className="px-3 sm:px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Segments */}
          <div className="-mx-1 overflow-x-auto">
            <div className="px-1 flex items-center gap-2 min-w-max">
              {segments.map((seg) => {
                const active = segment === seg;
                return (
                  <button
                    key={seg}
                    onClick={() => {
                      setSegment(seg);
                      setPage(1);
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap"
                    style={{
                      background: active
                        ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`
                        : "transparent",
                      color: active ? "#0B0B0F" : COLORS.text2,
                      border: active ? "none" : `1px solid ${COLORS.ring}`,
                    }}
                  >
                    {seg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right controls */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {/* Search */}
            <div className="relative w-full sm:w-64 xl:w-80 order-1 sm:order-none">
              <MdSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: COLORS.text2 }}
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search campaigns…"
                className="h-9 w-full rounded-lg pl-9 pr-3 text-sm outline-none"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
              />
            </div>

            {/* Mobile Filters toggle */}
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="sm:hidden h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
              style={{
                backgroundColor: "#12131A",
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
            >
              <MdFilterAlt /> Filters
            </button>

            {/* ≥ sm Filters */}
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="hidden md:flex items-center gap-1 text-xs"
                style={{ color: COLORS.text2 }}
              >
                <MdFilterAlt /> Filters
              </div>
              <select
                value={channel}
                onChange={(e) => {
                  setChannel(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-lg px-2 text-sm"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
              >
                {["All", "push", "inapp", "email"].map((c) => (
                  <option key={c} value={c}>
                    Channel: {c}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-lg px-2 text-sm"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
              >
                {[
                  "All",
                  "Draft",
                  "Scheduled",
                  "Sending",
                  "Sent",
                  "Cancelled",
                ].map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>
              <button
                className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
                onClick={() =>
                  onExport?.(
                    Array.from(checked).length
                      ? data.filter((d) => checked.has(d.id))
                      : filtered
                  )
                }
                title="Export CSV"
              >
                <MdDownload /> Export
              </button>
              <button
                className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
                  color: "#0B0B0F",
                }}
                onClick={onCreate}
              >
                <MdAdd /> New Broadcast
              </button>
            </div>
          </div>

          {/* Mobile filters */}
          <div
            className={`${
              filtersOpen ? "grid" : "hidden"
            } grid-cols-1 gap-2 sm:hidden`}
          >
            <select
              value={channel}
              onChange={(e) => {
                setChannel(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg px-2 text-sm"
              style={{
                backgroundColor: "#12131A",
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
            >
              {["All", "push", "inapp", "email"].map((c) => (
                <option key={c} value={c}>
                  Channel: {c}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg px-2 text-sm"
              style={{
                backgroundColor: "#12131A",
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
            >
              {[
                "All",
                "Draft",
                "Scheduled",
                "Sending",
                "Sent",
                "Cancelled",
              ].map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
            <button
              className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
              style={{
                backgroundColor: "#12131A",
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
              onClick={() =>
                onExport?.(
                  Array.from(checked).length
                    ? data.filter((d) => checked.has(d.id))
                    : filtered
                )
              }
            >
              <MdDownload /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden grid grid-cols-1 gap-3 px-3 pb-3">
        {pageRows.map((c) => (
          <div
            key={c.id}
            className="rounded-xl p-3"
            style={{
              backgroundColor: "#0F1118",
              border: `1px solid ${COLORS.ring}`,
              color: COLORS.text,
            }}
          >
            <div className="flex items-center gap-2">
              <ChannelIcon type={c.channel} />
              <div className="font-semibold truncate">{c.name}</div>
              <span
                className="ml-auto px-2 py-0.5 rounded-md text-[11px] font-semibold"
                style={{
                  backgroundColor: "rgba(163,167,183,0.15)",
                  color: COLORS.text2,
                }}
              >
                {c.status}
              </span>
            </div>
            <div className="mt-1 text-xs" style={{ color: COLORS.text2 }}>
              {c.segments.join(", ")} • {c.scheduleAt || "—"}
            </div>
            <div className="mt-2 text-xs" style={{ color: COLORS.text2 }}>
              Sent {c.metrics?.sent || 0} • Open {c.metrics?.opens || 0} • Click{" "}
              {c.metrics?.clicks || 0}
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1"
                style={{
                  backgroundColor: "#12131A",
                  border: `1px solid ${COLORS.ring}`,
                  color: COLORS.text,
                }}
                onClick={() => onSelect?.(c)}
              >
                <MdVisibility size={16} /> Details
              </button>
              <button
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
                  color: "#0B0B0F",
                }}
                onClick={() => onEdit?.(c)}
              >
                <MdEdit size={16} /> Edit
              </button>
            </div>
          </div>
        ))}
        {!pageRows.length && (
          <div
            className="px-1 pb-4 text-center text-sm"
            style={{ color: COLORS.text2 }}
          >
            No campaigns match the current filters.
          </div>
        )}
      </div>

      {/* Table (desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead>
            <tr
              className="sticky top-0 z-10"
              style={{
                backgroundColor: "#0F1118",
                color: COLORS.text2,
                borderBottom: `1px solid ${COLORS.ring}`,
              }}
            >
              <th className="px-4 py-3.5 w-10">
                <Checkbox checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="py-3.5 text-left">Campaign</th>
              <th className="py-3.5 text-left">Channel</th>
              <th className="py-3.5 text-left">Segments</th>
              <th className="py-3.5 text-left">Status</th>
              <th className="py-3.5 text-left">Scheduled</th>
              <th className="py-3.5 text-left">Metrics</th>
              <th className="py-3.5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((c, i) => (
              <tr
                key={c.id}
                className={`transition-colors ${
                  i % 2 ? "bg-[#131522]" : ""
                } hover:bg-[#1A1C26]`}
                style={{
                  color: COLORS.text,
                  borderBottom: `1px solid ${COLORS.ring}`,
                }}
              >
                <td className="px-4 py-3.5 align-middle">
                  <Checkbox
                    checked={checked.has(c.id)}
                    onChange={(v) => {
                      const next = new Set(checked);
                      v ? next.add(c.id) : next.delete(c.id);
                      setChecked(next);
                    }}
                  />
                </td>
                <td className="py-3.5 pr-4">
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs" style={{ color: COLORS.text2 }}>
                    {c.subject || c.title || "—"}
                  </div>
                </td>
                <td className="py-3.5 pr-4 flex items-center gap-2">
                  <ChannelIcon type={c.channel} />
                  <span style={{ color: COLORS.text2 }}>{c.channel}</span>
                </td>
                <td className="py-3.5 pr-4" style={{ color: COLORS.text2 }}>
                  {c.segments.join(", ")}
                </td>
                <td className="py-3.5 pr-4" style={{ color: COLORS.text2 }}>
                  {c.status}
                </td>
                <td className="py-3.5 pr-4" style={{ color: COLORS.text2 }}>
                  {c.scheduleAt || "—"}
                </td>
                <td className="py-3.5 pr-4" style={{ color: COLORS.text2 }}>
                  Sent {c.metrics?.sent || 0} • Open {c.metrics?.opens || 0} •
                  Click {c.metrics?.clicks || 0}
                </td>
                <td className="py-3.5 pr-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1"
                      style={{
                        backgroundColor: "#12131A",
                        border: `1px solid ${COLORS.ring}`,
                        color: COLORS.text,
                      }}
                      onClick={() => onSelect?.(c)}
                    >
                      <MdVisibility size={16} /> Details
                    </button>
                    <button
                      className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1"
                      style={{
                        background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
                        color: "#0B0B0F",
                      }}
                      onClick={() => onEdit?.(c)}
                    >
                      <MdEdit size={16} /> Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!pageRows.length && (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center"
                  style={{ color: COLORS.text2 }}
                >
                  No campaigns match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 p-3">
        <button
          className="h-8 px-3 rounded-lg text-sm"
          style={{
            backgroundColor: "#12131A",
            border: `1px solid ${COLORS.ring}`,
            color: COLORS.text2,
          }}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="text-xs" style={{ color: COLORS.text2 }}>
          Page{" "}
          <span className="font-semibold" style={{ color: COLORS.text }}>
            {page}
          </span>{" "}
          / {totalPages}
        </div>
        <button
          className="h-8 px-3 rounded-lg text-sm"
          style={{
            backgroundColor: "#12131A",
            border: `1px solid ${COLORS.ring}`,
            color: COLORS.text2,
          }}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BroadcastBoard;
