import React, { useMemo, useState } from "react";
import {
  MdAdd,
  MdFilterAlt,
  MdSort,
  MdSearch,
  MdDownload,
  MdPlayCircleFilled,
  MdArticle,
  MdAudiotrack,
  MdFilePresent,
  MdVisibility,
  MdEdit,
} from "react-icons/md";

const COLORS = {
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

const typeIcon = (t, size = 16) => {
  if (t === "video") return <MdPlayCircleFilled size={size} />;
  if (t === "article") return <MdArticle size={size} />;
  if (t === "audio") return <MdAudiotrack size={size} />;
  return <MdFilePresent size={size} />;
};

const Chip = ({ children }) => (
  <span
    className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
    style={{
      backgroundColor: "rgba(255,255,255,0.06)",
      color: COLORS.text2,
      border: `1px solid ${COLORS.ring}`,
    }}
  >
    {children}
  </span>
);

const StatusPill = ({ status }) => {
  const map = { Published: "#22C55E", Draft: "#A3A7B7", Scheduled: "#F59E0B" };
  const c = map[status] || "#A3A7B7";
  return (
    <span
      className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
      style={{ backgroundColor: `${c}22`, color: c }}
    >
      {status}
    </span>
  );
};

const Checkbox = ({ checked, onChange }) => (
  <input
    type="checkbox"
    className="h-4 w-4 rounded border-transparent"
    checked={!!checked}
    onChange={(e) => onChange?.(e.target.checked)}
  />
);

const ContentTable = ({
  data = [],
  onEdit,
  onDetails,
  onExport,
  onBulkDelete,
  onBulkPublish,
  onBulkUnpublish,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [tier, setTier] = useState("All");
  const [status, setStatus] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [checked, setChecked] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    let rows = data;
    if (category !== "All") rows = rows.filter((r) => r.category === category);
    if (type !== "All") rows = rows.filter((r) => r.type === type);
    if (tier !== "All")
      rows = rows.filter((r) => (r.tier || []).includes(tier));
    if (status !== "All") rows = rows.filter((r) => r.status === status);
    if (s) {
      rows = rows.filter(
        (r) =>
          r.title.toLowerCase().includes(s) ||
          r.category.toLowerCase().includes(s) ||
          r.type.toLowerCase().includes(s) ||
          (r.tags || []).some((t) => t.toLowerCase().includes(s)) ||
          (r.collection || "").toLowerCase().includes(s)
      );
    }
    return rows;
  }, [data, search, category, type, tier, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((page - 1) * perPage, page * perPage);
  const allSelected =
    pageRows.length > 0 &&
    pageRows.every((_, i) => checked.has((page - 1) * perPage + i));
  const selectedIds = Array.from(checked)
    .map((idx) => data[idx])
    .filter(Boolean)
    .map((r) => r.id);

  const toggleAll = () => {
    if (allSelected) {
      const next = new Set(checked);
      pageRows.forEach((_, i) => next.delete((page - 1) * perPage + i));
      setChecked(next);
    } else {
      const next = new Set(checked);
      pageRows.forEach((_, i) => next.add((page - 1) * perPage + i));
      setChecked(next);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: COLORS.card,
        border: `1px solid ${COLORS.ring}`,
      }}
    >
      {/* Toolbar – responsive & aligned */}
      <div className="px-3 sm:px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Segments (Categories) – horizontal scroll on mobile */}
          <div className="-mx-1 overflow-x-auto">
            <div className="px-1 flex items-center gap-2 min-w-max">
              {[
                "All",
                "Real Estate",
                "Acting & Entertainment",
                "Finance",
                "Marketing",
              ].map((seg) => {
                const active = category === seg;
                return (
                  <button
                    key={seg}
                    onClick={() => {
                      setCategory(seg);
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

          {/* Right cluster: Search + Filters + Actions */}
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
                placeholder="Search title, tags, collection…"
                className="h-9 w-full rounded-lg pl-9 pr-3 text-sm outline-none"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
              />
            </div>

            {/* Mobile: Filters toggle */}
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

            {/* ≥ sm: Inline filters */}
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="hidden md:flex items-center gap-1 text-xs"
                style={{ color: COLORS.text2 }}
              >
                <MdFilterAlt /> Filters
              </div>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-lg px-2 text-sm"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
              >
                {["All", "video", "article", "audio", "download"].map((t) => (
                  <option key={t} value={t}>
                    Type: {t}
                  </option>
                ))}
              </select>
              <select
                value={tier}
                onChange={(e) => {
                  setTier(e.target.value);
                  setPage(1);
                }}
                className="h-9 rounded-lg px-2 text-sm"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
              >
                {["All", "Free", "Paid", "VIP"].map((t) => (
                  <option key={t} value={t}>
                    Tier: {t}
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
                {["All", "Published", "Draft", "Scheduled"].map((s) => (
                  <option key={s} value={s}>
                    Status: {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions (wrap when narrow) */}
            <div className="flex items-center gap-2 flex-wrap sm:justify-end">
              <button
                className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
                onClick={() => {
                  if (!selectedIds.length)
                    return alert("Select at least one item.");
                  onBulkPublish?.(selectedIds);
                }}
              >
                Publish
              </button>
              <button
                className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
                onClick={() => {
                  if (!selectedIds.length)
                    return alert("Select at least one item.");
                  onBulkUnpublish?.(selectedIds);
                }}
              >
                Unpublish
              </button>
              <button
                className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                style={{
                  backgroundColor: "#12131A",
                  color: COLORS.text,
                  border: `1px solid ${COLORS.ring}`,
                }}
                onClick={() => {
                  if (!selectedIds.length)
                    return alert("Select at least one item.");
                  if (confirm("Delete selected content?"))
                    onBulkDelete?.(selectedIds);
                }}
              >
                Delete
              </button>
              <button
                className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
                  color: "#0B0B0F",
                }}
                onClick={() =>
                  onExport?.(
                    selectedIds.length
                      ? data.filter((d) => selectedIds.includes(d.id))
                      : filtered
                  )
                }
                title="Export CSV"
              >
                <MdDownload /> Export
              </button>
            </div>
          </div>

          {/* Mobile collapsible filters */}
          <div
            className={`${
              filtersOpen ? "grid" : "hidden"
            } grid-cols-1 gap-2 sm:hidden mt-2`}
          >
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg px-2 text-sm"
              style={{
                backgroundColor: "#12131A",
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
            >
              {["All", "video", "article", "audio", "download"].map((t) => (
                <option key={t} value={t}>
                  Type: {t}
                </option>
              ))}
            </select>
            <select
              value={tier}
              onChange={(e) => {
                setTier(e.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg px-2 text-sm"
              style={{
                backgroundColor: "#12131A",
                color: COLORS.text,
                border: `1px solid ${COLORS.ring}`,
              }}
            >
              {["All", "Free", "Paid", "VIP"].map((t) => (
                <option key={t} value={t}>
                  Tier: {t}
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
              {["All", "Published", "Draft", "Scheduled"].map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table (desktop) – improved */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[1200px] w-full text-sm">
          <thead>
            <tr
              className="sticky top-0 z-10"
              style={{
                backgroundColor: "#0F1118", // darker than card for contrast
                color: COLORS.text2,
                borderBottom: `1px solid ${COLORS.ring}`,
              }}
            >
              <th className="px-4 py-3.5 w-10">
                <Checkbox checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="py-3.5 text-left">Title</th>
              <th className="py-3.5 text-left">Category</th>
              <th className="py-3.5 text-left">Type</th>
              <th className="py-3.5 text-left">Tier</th>
              <th className="py-3.5 text-left">Status</th>
              <th className="py-3.5 text-left">Created</th>
              <th className="py-3.5 text-left">Stats</th>
              <th className="py-3.5 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pageRows.map((row, idxOnPage) => {
              const idx = (page - 1) * perPage + idxOnPage;
              const active = checked.has(idx);
              const zebra = idx % 2 === 1;

              return (
                <tr
                  key={row.id}
                  className={`group relative transition-colors ${
                    zebra ? "bg-[#131522]" : ""
                  } hover:bg-[#1A1C26]`}
                  style={{
                    color: COLORS.text,
                    borderBottom: `1px solid ${COLORS.ring}`,
                  }}
                >
                  {/* left accent when selected */}
                  {active && (
                    <td className="p-0 absolute left-0 top-0 h-full w-1 align-middle">
                      <span
                        className="block h-full w-1"
                        style={{
                          background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.purple})`,
                        }}
                      />
                    </td>
                  )}

                  <td className="px-4 py-3.5 align-middle">
                    <Checkbox
                      checked={active}
                      onChange={(v) => {
                        const next = new Set(checked);
                        v ? next.add(idx) : next.delete(idx);
                        setChecked(next);
                      }}
                    />
                  </td>

                  {/* Title + cover + tags */}
                  <td className="py-3.5 pr-4 align-middle">
                    <div className="flex items-center gap-3 min-w-[360px]">
                      <div
                        className="relative h-14 w-24 rounded-lg overflow-hidden shrink-0"
                        style={{
                          boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                          border: `1px solid ${COLORS.ring}`,
                        }}
                      >
                        <img
                          src={row.cover}
                          alt={row.title}
                          className="h-full w-full object-cover"
                        />
                        <div
                          className="absolute right-1 bottom-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold flex items-center gap-1"
                          style={{
                            backgroundColor: "rgba(0,0,0,0.55)",
                            color: "#fff",
                          }}
                        >
                          {typeIcon(row.type, 12)}
                          <span className="uppercase">{row.type}</span>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate max-w-[420px]">
                            {row.title}
                          </span>
                        </div>

                        <div className="mt-0.5 flex items-center gap-2 text-xs">
                          <span
                            className="truncate max-w-[280px]"
                            style={{ color: COLORS.text2 }}
                          >
                            {row.collection || "—"}
                          </span>
                          {row.tags?.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                              style={{
                                backgroundColor: "rgba(255,255,255,0.06)",
                                color: COLORS.text2,
                                border: `1px solid ${COLORS.ring}`,
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td
                    className="py-3.5 pr-4 align-middle"
                    style={{ color: COLORS.text2 }}
                  >
                    {row.category}
                  </td>

                  <td
                    className="py-3.5 pr-4 align-middle"
                    style={{ color: COLORS.text2 }}
                  >
                    {row.type}
                  </td>

                  <td className="py-3.5 pr-4 align-middle">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {(row.tier || []).map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.06)",
                            color: COLORS.text2,
                            border: `1px solid ${COLORS.ring}`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 pr-4 align-middle">
                    <StatusPill status={row.status} />
                  </td>

                  <td
                    className="py-3.5 pr-4 align-middle"
                    style={{ color: COLORS.text2 }}
                  >
                    {row.createdAt}
                    {row.scheduledAt ? (
                      <span className="ml-1 text-[11px] opacity-80">
                        • sched: {row.scheduledAt}
                      </span>
                    ) : null}
                  </td>

                  <td
                    className="py-3.5 pr-4 align-middle"
                    style={{ color: COLORS.text2 }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: `1px solid ${COLORS.ring}`,
                        }}
                      >
                        {row.type === "audio"
                          ? `Listens ${row.listens}`
                          : `Views ${row.views}`}
                      </span>
                      {row.watchTime ? (
                        <span
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.06)",
                            border: `1px solid ${COLORS.ring}`,
                          }}
                        >
                          Avg WT {row.watchTime}m
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="py-3.5 pr-4 align-middle">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        style={{
                          backgroundColor: "#12131A",
                          border: `1px solid ${COLORS.ring}`,
                          color: COLORS.text,
                        }}
                        onClick={() => onDetails?.(row)}
                      >
                        <span className="opacity-80">Details</span>
                      </button>
                      <button
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1 transition-shadow"
                        style={{
                          background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
                          color: "#0B0B0F",
                          boxShadow: "0 6px 18px rgba(110,86,207,0.25)",
                        }}
                        onClick={() => onEdit?.(row)}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="py-10 text-center"
                  style={{ color: COLORS.text2 }}
                >
                  No content found for the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden p-3 grid gap-3 sm:grid-cols-2">
        {pageRows.map((row, idxOnPage) => {
          const idx = (page - 1) * perPage + idxOnPage;
          const active = checked.has(idx);
          return (
            <div
              key={row.id}
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: COLORS.card,
                border: `1px solid ${COLORS.ring}`,
              }}
            >
              <img
                src={row.cover}
                alt={row.title}
                className="h-32 w-full object-cover"
              />
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {typeIcon(row.type, 18)}
                    <div className="font-medium" style={{ color: COLORS.text }}>
                      {row.title}
                    </div>
                  </div>
                  <Checkbox
                    checked={active}
                    onChange={(v) => {
                      const next = new Set(checked);
                      v ? next.add(idx) : next.delete(idx);
                      setChecked(next);
                    }}
                  />
                </div>
                <div className="text-xs" style={{ color: COLORS.text2 }}>
                  {row.category} • {row.status}
                </div>
                <div className="flex flex-wrap gap-1">
                  {(row.tier || []).map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    className="px-2 py-1 rounded-md text-xs font-semibold"
                    style={{
                      backgroundColor: "#12131A",
                      border: `1px solid ${COLORS.ring}`,
                      color: COLORS.text,
                    }}
                    onClick={() => onDetails?.(row)}
                  >
                    Details
                  </button>
                  <button
                    className="px-2 py-1 rounded-md text-xs font-semibold"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
                      color: "#0B0B0F",
                    }}
                    onClick={() => onEdit?.(row)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {pageRows.length === 0 && (
          <div
            className="text-center py-8 text-sm"
            style={{ color: COLORS.text2 }}
          >
            No content found.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between gap-2 p-3"
        style={{ color: COLORS.text2 }}
      >
        <div className="text-xs">
          Showing {(page - 1) * perPage + 1}-
          {Math.min(page * perPage, filtered.length)} of {filtered.length}
        </div>
        <div className="flex items-center gap-1">
          <button
            className="h-8 px-3 rounded-md text-sm"
            style={{
              backgroundColor: "#12131A",
              border: `1px solid ${COLORS.ring}`,
              color: COLORS.text,
            }}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <button
            className="h-8 px-3 rounded-md text-sm"
            style={{
              background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
              color: "#0B0B0F",
            }}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentTable;
