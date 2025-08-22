import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { MdEdit, MdDownload } from "react-icons/md";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const COLORS = { bg2:"#12131A", card:"#161821", text:"#E6E8F0", text2:"#A3A7B7", ring:"rgba(110,86,207,0.25)", gold:"#D4AF37", purple:"#6E56CF" };

const BroadcastDetails = ({ open, campaign, onClose, onEdit, onExportOne }) => {
  // ✅ hooks always run
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const series = useMemo(() => campaign?.metrics?.timeseries || [], [campaign]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[2999] ${open ? "block" : "hidden"}`}
        onClick={onClose}
        style={{ backgroundColor:"rgba(0,0,0,0.55)" }}
      />
      <aside
        className={`fixed inset-y-0 right-0 w-[720px] max-w-[98vw] z-[3000] overflow-y-auto transition-transform duration-200
                   ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: COLORS.bg2, borderLeft:`1px solid ${COLORS.ring}` }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="p-4 sticky top-0 flex items-center justify-between"
             style={{ backgroundColor: COLORS.bg2, borderBottom:`1px solid ${COLORS.ring}`, color: COLORS.text }}>
          <div>
            <div className="text-sm font-semibold">{campaign?.name || "Campaign"}</div>
            <div className="text-xs" style={{ color: COLORS.text2 }}>
              {(campaign?.channel || "").toUpperCase()} • {(campaign?.segments || []).join(", ")} • {campaign?.status || ""}
            </div>
          </div>
          <button className="p-2 rounded-lg" onClick={onClose} aria-label="Close" style={{ color: COLORS.text2 }}>
            <IoClose size={20}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4" style={{ color: COLORS.text }}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { k: "Sent", v: campaign?.metrics?.sent || 0 },
              { k: "Delivered", v: campaign?.metrics?.delivered || 0 },
              { k: "Opens", v: campaign?.metrics?.opens || 0 },
              { k: "Clicks", v: campaign?.metrics?.clicks || 0 },
              { k: "Unsubs", v: campaign?.metrics?.unsub || 0 },
            ].map((m) => (
              <div key={m.k} className="rounded-xl p-3" style={{ backgroundColor:"#0F1118", border:`1px solid ${COLORS.ring}` }}>
                <div className="text-xs" style={{ color: COLORS.text2 }}>{m.k}</div>
                <div className="text-lg font-semibold">{m.v}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div className="text-xs mb-2" style={{ color: COLORS.text2 }}>Engagement over time</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="t" tick={{ fill: COLORS.text2, fontSize: 12 }} />
                  <YAxis tick={{ fill: COLORS.text2, fontSize: 12 }} />
                  <Tooltip contentStyle={{ background:"#0F1118", border:`1px solid ${COLORS.ring}`, color: COLORS.text }} />
                  <Legend />
                  <Line type="monotone" dataKey="sent"  stroke="#64748B" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="open"  stroke={COLORS.purple} strokeWidth={3} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="click" stroke={COLORS.gold} strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Activity Log</div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                  style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                  onClick={onExportOne}
                >
                  <MdDownload/> Export
                </button>
                <button
                  className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                  style={{ background:`linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color:"#0B0B0F" }}
                  onClick={onEdit}
                >
                  <MdEdit/> Edit
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {(campaign?.logs || []).map((l, i) => (
                <div key={i} className="rounded-lg px-3 py-2 text-sm"
                     style={{ backgroundColor:"#0F1118", border:`1px solid ${COLORS.ring}` }}>
                  <div className="text-xs" style={{ color: COLORS.text2 }}>{l.ts}</div>
                  <div>{l.msg}</div>
                </div>
              ))}
              {!campaign?.logs?.length && (
                <div className="text-sm" style={{ color: COLORS.text2 }}>No log entries yet.</div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default BroadcastDetails;
