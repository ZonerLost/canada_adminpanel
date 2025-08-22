import React, { useMemo, useState } from "react";
import { MdSearch, MdFlag, MdWarning, MdOutlineRule } from "react-icons/md";

const COLORS = {
  text: "#E6E8F0",
  text2: "#A3A7B7",
  card: "#161821",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

const ModerationBoard = ({ rooms=[], reports=[], onSelectReport, blocklist=[], setBlocklist, rateLimit, setRateLimit }) => {
  const [q, setQ] = useState("");
  const [roomFilter, setRoomFilter] = useState("All");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return reports.filter(r => {
      const roomOk = roomFilter === "All" || r.room === roomFilter;
      const qOk = !s || [r.reason, r.content, r.user].some(x => (x||"").toLowerCase().includes(s));
      return roomOk && qOk;
    });
  }, [reports, roomFilter, q]);

  const removeKeyword = (i) => setBlocklist?.(blocklist.filter((_, idx) => idx !== i));
  const addKeyword = () => {
    const kw = prompt("Add blocked keyword:");
    if (kw && kw.trim()) setBlocklist?.([...blocklist, kw.trim()]);
  };

  return (
    <div className="rounded-2xl" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
      <div className="px-3 sm:px-4 py-3 flex items-center justify-between">
        <div className="text-sm font-semibold" style={{ color: COLORS.text }}>Community Moderation</div>
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.text2 }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search reports…"
              className="h-9 w-full rounded-lg pl-9 pr-3 text-sm outline-none"
              style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
            />
          </div>
          <select
            value={roomFilter}
            onChange={(e)=>setRoomFilter(e.target.value)}
            className="h-9 rounded-lg px-2 text-sm"
            style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
          >
            <option value="All">All Rooms</option>
            {rooms.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-4 p-3 lg:grid-cols-[1fr_320px]">
        {/* Reports list */}
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl p-3"
                 style={{ backgroundColor:"#0F1118", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}>
              <div className="flex items-center gap-2">
                <MdFlag className="text-[#F59E0B]" />
                <div className="font-medium">#{r.id} — {r.reason}</div>
                <div className="ml-auto text-xs" style={{ color: COLORS.text2 }}>{r.ts}</div>
              </div>
              <div className="mt-1 text-xs" style={{ color: COLORS.text2 }}>
                Room: <span className="font-medium">{r.room}</span> • User: <span className="font-medium">{r.user}</span>
              </div>
              <div className="mt-2 text-sm" style={{ color: COLORS.text2 }}>{r.content}</div>
              <div className="mt-2 flex items-center justify-end">
                <button
                  className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
                  style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                  onClick={() => onSelectReport?.(r)}
                >
                  Review
                </button>
              </div>
            </div>
          ))}
          {!filtered.length && (
            <div className="text-sm px-1 pb-2" style={{ color: COLORS.text2 }}>
              No reports found for the current filters.
            </div>
          )}
        </div>

        {/* Right: rules */}
        <div className="space-y-3">
          <div className="rounded-2xl p-3" style={{ backgroundColor:"#0F1118", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}>
            <div className="flex items-center gap-2 mb-2">
              <MdOutlineRule /> <div className="text-sm font-semibold">Filters & Limits</div>
            </div>
            <div className="text-xs mb-1" style={{ color: COLORS.text2 }}>Blocklist</div>
            <div className="flex flex-wrap gap-2">
              {blocklist.map((kw, i) => (
                <span key={`${kw}-${i}`} className="px-2 py-1 rounded-md text-[11px] font-semibold inline-flex items-center gap-2"
                      style={{ backgroundColor:"rgba(163,167,183,0.15)", color: COLORS.text }}>
                  {kw}
                  <button onClick={() => removeKeyword(i)} className="text-xs" title="remove">×</button>
                </span>
              ))}
              <button
                className="px-2 py-1 rounded-md text-[11px] font-semibold"
                style={{ background:`linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color:"#0B0B0F" }}
                onClick={addKeyword}
              >
                + Add
              </button>
            </div>

            <div className="mt-3">
              <div className="text-xs mb-1" style={{ color: COLORS.text2 }}>Rate limit (messages / 60s)</div>
              <input
                type="range"
                min={5}
                max={60}
                value={rateLimit}
                onChange={(e)=>setRateLimit?.(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs mt-1" style={{ color: COLORS.text2 }}>{rateLimit} messages per minute</div>
            </div>

            <div className="mt-3 text-xs" style={{ color: COLORS.text2 }}>
              Moderation changes are applied immediately. Actual enforcement happens server-side.
            </div>
          </div>

          {/* Rooms summary */}
          <div className="rounded-2xl p-3" style={{ backgroundColor:"#0F1118", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}>
            <div className="text-sm font-semibold mb-2">Rooms</div>
            <div className="space-y-2">
              {rooms.map(r => (
                <div key={r.id} className="flex items-center justify-between">
                  <div className="text-sm">{r.name}</div>
                  <div className="text-xs" style={{ color: COLORS.text2 }}>{r.members} members</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs" style={{ color: COLORS.text2 }}>
              Use “Reports” to act on specific messages or users.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModerationBoard;
