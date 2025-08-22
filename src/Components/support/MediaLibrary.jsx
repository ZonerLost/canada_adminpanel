import React, { useMemo, useState } from "react";
import { MdAdd, MdDownload, MdFilterAlt, MdSearch } from "react-icons/md";
import { COLORS } from "../../Pages/SupportMediaSettingsPage";

const TYPES = ["All", "image", "video", "audio", "pdf", "other"];

const MediaLibrary = ({ data = [], onCreate, onEdit, onSelect, onExport }) => {
  const [type, setType] = useState("All");
  const [tag, setTag] = useState("All");
  const [search, setSearch] = useState("");

  const tags = useMemo(
    () => ["All", ...Array.from(new Set(data.flatMap((a) => a.tags || [])))],
    [data]
  );

  const filtered = useMemo(() => {
    return data.filter((a) => {
      if (type !== "All" && a.type !== type) return false;
      if (tag !== "All" && !(a.tags || []).includes(tag)) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, type, tag, search]);

  return (
    <div className="rounded-2xl" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
      {/* Toolbar */}
      <div
        className="px-3 sm:px-4 py-3 flex flex-col gap-3 lg:flex-row lg:items-center rounded-t-2xl"
        style={{ backgroundColor: COLORS.bg2, borderBottom: `1px solid ${COLORS.ring}` }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {TYPES.map((t) => {
            const active = type === t;
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium"
                style={{
                  background: active ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})` : "transparent",
                  color: active ? "#0B0B0F" : COLORS.text2,
                  border: active ? "none" : `1px solid ${COLORS.ring}`,
                }}
              >
                {t}
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
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="h-9 rounded-lg px-2 text-sm"
            style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
          >
            {tags.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <div className="relative">
            <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.text2 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets…"
              className="h-9 w-64 xl:w-80 rounded-lg pl-9 pr-3 text-sm outline-none"
              style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
            />
          </div>

          <button
            className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
            style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
            onClick={() => onExport?.(filtered)}
          >
            <MdDownload /> Export
          </button>
          <button
            className="h-9 px-3 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
            style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color: "#0B0B0F" }}
            onClick={onCreate}
          >
            <MdAdd /> Upload
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-3 sm:p-4 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="rounded-xl overflow-hidden group"
            style={{ backgroundColor: "#0F1118", border: `1px solid ${COLORS.ring}`, color: COLORS.text }}
          >
            <div className="h-40 bg-black/30">
              {/* Simple preview (image placeholder even for non-images) */}
              <img src={a.preview} alt={a.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <div className="font-semibold truncate">{a.name}</div>
              <div className="text-xs mt-1" style={{ color: COLORS.text2 }}>
                {a.type.toUpperCase()} • v{a.version} • {a.size}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {(a.tags || []).slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[11px]"
                      style={{ backgroundColor: COLORS.bg2, border: `1px solid ${COLORS.ring}`, color: COLORS.text2 }}
                    >
                      {t}
                    </span>
                  ))}
                  {(a.tags || []).length > 3 && (
                    <span className="text-[11px]" style={{ color: COLORS.text2 }}>+{a.tags.length - 3}</span>
                  )}
                </div>
                <div className="inline-flex items-center gap-2">
                  <button
                    className="px-2 py-1 rounded-md text-xs font-semibold"
                    style={{ backgroundColor: "#12131A", border: `1px solid ${COLORS.ring}` }}
                    onClick={() => onSelect?.(a)}
                  >
                    Details
                  </button>
                  <button
                    className="px-2 py-1 rounded-md text-xs font-semibold"
                    style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color: "#0B0B0F" }}
                    onClick={() => onEdit?.(a)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!filtered.length && (
          <div className="col-span-full text-center py-10 text-sm" style={{ color: COLORS.text2 }}>
            No assets found.
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
