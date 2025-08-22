import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { MdSmartphone, MdEdit, MdDownload } from "react-icons/md";

const COLORS = {
  bg2: "#12131A",
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
  ok: "#22C55E",
};

const Chip = ({ children }) => (
  <span
    className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
    style={{ backgroundColor: "rgba(255,255,255,0.06)", color: COLORS.text2, border: `1px solid ${COLORS.ring}` }}
  >
    {children}
  </span>
);

const ContentDetails = ({ item, onClose, onEdit }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [item]);

  const isOpen = !!item;
  const analytics = useMemo(() => {
    if (!item) return { primary: "", secondary: "" };
    const primary = item.type === "audio" ? `Listens: ${item.listens}` : `Views: ${item.views}`;
    const secondary = item.watchTime ? `Avg Watch Time: ${item.watchTime}m` : "";
    return { primary, secondary };
  }, [item]);

  if (!isOpen || !mounted) return null;

  const exportOne = () => {
    const headers = ["ID","Title","Type","Views","WatchTime","Listens","Status","Tiers","Created","Scheduled","Tags","Collection"];
    const line = [
      item.id,
      item.title,
      item.type,
      item.views || 0,
      item.watchTime || 0,
      item.listens || 0,
      item.status,
      (item.tier || []).join("|"),
      item.createdAt || "",
      item.scheduledAt || "",
      (item.tags || []).join("|"),
      item.collection || "",
    ];
    const csv = [headers, line]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `content_${item.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[1999]" onClick={onClose} style={{ backgroundColor: "rgba(0,0,0,0.55)" }} />
      <aside className="fixed inset-y-0 right-0 w-[520px] max-w-[96vw] z-[2000] overflow-y-auto"
             style={{ backgroundColor: COLORS.bg2, borderLeft: `1px solid ${COLORS.ring}` }}>
        {/* Header */}
        <div className="p-4 sticky top-0 flex items-center justify-between"
             style={{ backgroundColor: COLORS.bg2, borderBottom: `1px solid ${COLORS.ring}` }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
              Content Details
            </div>
            <div className="text-xs" style={{ color: COLORS.text2 }}>
              {item.title}
            </div>
          </div>
          <button className="p-2 rounded-lg" onClick={onClose} aria-label="Close"
                  style={{ color: COLORS.text2, backgroundColor: "transparent" }}>
            <IoClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Meta */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-2"
               style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
            <div className="sm:col-span-2">
              <img src={item.cover} alt={item.title} className="w-full h-40 object-cover rounded-lg" />
            </div>
            <div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>Category</div>
              <div className="text-sm" style={{ color: COLORS.text }}>{item.category}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>Type</div>
              <div className="text-sm" style={{ color: COLORS.text }}>{item.type}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>Status</div>
              <div className="text-sm" style={{ color: COLORS.text }}>{item.status}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>Tiers</div>
              <div className="flex flex-wrap gap-1">
                {(item.tier || []).map((t) => <Chip key={t}>{t}</Chip>)}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs" style={{ color: COLORS.text2 }}>Tags</div>
              <div className="flex flex-wrap gap-1">
                {(item.tags || []).map((t) => <Chip key={t}>#{t}</Chip>)}
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-3"
               style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
            <div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>Primary</div>
              <div className="text-sm" style={{ color: COLORS.text }}>{analytics.primary}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>Avg Watch</div>
              <div className="text-sm" style={{ color: COLORS.text }}>{analytics.secondary || "—"}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>Created / Scheduled</div>
              <div className="text-sm" style={{ color: COLORS.text }}>
                {item.createdAt} {item.scheduledAt ? `• ${item.scheduledAt}` : ""}
              </div>
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="rounded-2xl p-4"
               style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
            <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: COLORS.text2 }}>
              <MdSmartphone /> Mobile Preview
            </div>
            <div className="mx-auto max-w-[320px] rounded-3xl p-3"
                 style={{ backgroundColor: "#0B0B0F", border: `1px solid ${COLORS.ring}` }}>
              <div className="rounded-2xl overflow-hidden">
                <img src={item.cover} alt="preview" className="w-full h-40 object-cover" />
                <div className="p-3">
                  <div className="text-sm font-semibold" style={{ color: COLORS.text }}>
                    {item.title}
                  </div>
                  <div className="text-xs mt-1" style={{ color: COLORS.text2 }}>
                    {item.category} • {(item.tier || []).join(", ")}
                  </div>
                  <button
                    className="mt-3 w-full rounded-xl py-2 text-sm font-medium"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
                      color: "#0B0B0F",
                    }}
                    onClick={() => alert("Open in app (placeholder)")}
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
              style={{ backgroundColor: "#12131A", border: `1px solid ${COLORS.ring}`, color: COLORS.text }}
              onClick={exportOne}
            >
              <MdDownload /> Export Analytics
            </button>
            <button
              className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
              style={{
                background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
                color: "#0B0B0F",
              }}
              onClick={onEdit}
            >
              <MdEdit /> Edit
            </button>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default ContentDetails;
