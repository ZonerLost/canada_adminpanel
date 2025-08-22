import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { MdGavel, MdDeleteOutline, MdVisibilityOff, MdWarningAmber } from "react-icons/md";

const COLORS = {
  bg2: "#12131A",
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

const ModerationDetails = ({ report, onClose, onAction }) => {
  const [mounted, setMounted] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  useEffect(() => {
    if (!report) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [report]);

  if (!report || !mounted) return null;

  const act = (a) => onAction?.(report.id, a, reason);

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2999]" onClick={onClose} style={{ backgroundColor:"rgba(0,0,0,0.55)" }} />
      <aside className="fixed inset-y-0 right-0 w-[540px] max-w-[96vw] z-[3000] overflow-y-auto"
             style={{ backgroundColor: COLORS.bg2, borderLeft:`1px solid ${COLORS.ring}` }}>
        {/* Header */}
        <div className="p-4 sticky top-0 flex items-center justify-between"
             style={{ backgroundColor: COLORS.bg2, borderBottom:`1px solid ${COLORS.ring}` }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: COLORS.text }}>Report #{report.id}</div>
            <div className="text-xs" style={{ color: COLORS.text2 }}>
              {report.reason} • {report.room} • {report.ts}
            </div>
          </div>
          <button className="p-2 rounded-lg" onClick={onClose} aria-label="Close" style={{ color: COLORS.text2 }}>
            <IoClose size={20}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4" style={{ color: COLORS.text }}>
          <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div className="text-xs mb-1" style={{ color: COLORS.text2 }}>Reported content</div>
            <div className="text-sm" style={{ color: COLORS.text2 }}>{report.content}</div>
            <div className="mt-2 text-xs" style={{ color: COLORS.text2 }}>User: {report.user}</div>
          </div>

          <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div className="text-sm font-semibold">Action</div>
            <input
              value={reason}
              onChange={(e)=>setReason(e.target.value)}
              placeholder="Moderator note / reason (optional)"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                onClick={() => act("warn")}
              >
                <MdWarningAmber/> Warn
              </button>
              <button
                className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                onClick={() => act("mute")}
              >
                <MdGavel/> Mute 24h
              </button>
              <button
                className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                onClick={() => act("shadowban")}
              >
                <MdVisibilityOff/> Shadowban
              </button>
              <button
                className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                style={{ background:`linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color:"#0B0B0F" }}
                onClick={() => act("ban")}
              >
                <MdGavel/> Ban
              </button>
              <button
                className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2 col-span-2"
                style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                onClick={() => act("delete")}
              >
                <MdDeleteOutline/> Delete content
              </button>
              <button
                className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2 col-span-2"
                style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                onClick={() => act("dismiss")}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default ModerationDetails;
