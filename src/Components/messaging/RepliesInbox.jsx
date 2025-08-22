import React, { useMemo, useState } from "react";
import { MdSearch, MdCheckCircle } from "react-icons/md";

const COLORS = {
  text: "#E6E8F0",
  text2: "#A3A7B7",
  card: "#161821",
  ring: "rgba(110,86,207,0.25)",
};

const RepliesInbox = ({ data=[], onResolve }) => {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return data;
    return data.filter(m => [m.user,m.email,m.text].some(x => (x||"").toLowerCase().includes(s)));
  }, [q, data]);

  return (
    <div className="rounded-2xl" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
      <div className="px-3 sm:px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-semibold" style={{ color: COLORS.text }}>Replies Inbox</div>
        <div className="relative w-56">
          <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.text2 }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search replies…"
            className="h-9 w-full rounded-lg pl-9 pr-3 text-sm outline-none"
            style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
          />
        </div>
      </div>

      <div className="grid gap-2 p-3">
        {filtered.map((m) => (
          <div key={m.id} className="rounded-xl p-3"
               style={{ backgroundColor:"#0F1118", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}>
            <div className="flex items-center gap-2">
              <div className="font-medium">{m.user}</div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>• {m.email}</div>
              <div className="ml-auto text-xs" style={{ color: COLORS.text2 }}>{m.ts}</div>
            </div>
            <div className="mt-1 text-sm" style={{ color: COLORS.text2 }}>{m.text}</div>
            <div className="mt-2 flex items-center justify-end">
              {m.status === "resolved" ? (
                <span className="inline-flex items-center gap-1 text-xs text-[#22C55E]"><MdCheckCircle/> Resolved</span>
              ) : (
                <button
                  className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
                  style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                  onClick={() => onResolve?.(m.id)}
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
        {!filtered.length && (
          <div className="text-sm px-3 pb-4" style={{ color: COLORS.text2 }}>
            No replies found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RepliesInbox;
