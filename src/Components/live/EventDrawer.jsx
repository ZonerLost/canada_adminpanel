import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

const COLORS = {
  bg2: "#12131A",
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

const DEFAULT = {
  id: "",
  title: "",
  type: "live",         // live | event
  category: "Real Estate",
  mode: "virtual",      // virtual | in-person
  host: "",
  tiers: ["Paid"],
  capacity: 100,
  tickets: [{ name: "General", price: 0 }],
  chatEnabled: true,
  qnaEnabled: true,
  recordEnabled: true,
  reminders: ["24h", "1h"],
  rtmpUrl: "",
  joinUrl: "",
  location: "",
  description: "",
  start: "",
  end: "",
  status: "Scheduled",
  replayUrl: "",
  attendees: [],
  participants: [],
  metrics: { registrants: 0, attendees: 0, avgWatchMins: 0, chatMessages: 0 },
};

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 text-sm">
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e.target.checked)} />
    <span>{label}</span>
  </label>
);

const TagBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 rounded-lg text-sm font-medium"
    style={{
      background: active ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})` : "transparent",
      color: active ? "#0B0B0F" : COLORS.text2,
      border: active ? "none" : `1px solid ${COLORS.ring}`,
    }}
  >
    {label}
  </button>
);

const EventDrawer = ({ open, initial, onClose, onSave }) => {
  const [mounted, setMounted] = useState(false);
  const [ev, setEv] = useState(DEFAULT);

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (open) {
      setEv({ ...DEFAULT, ...(initial || {}) });
    }
  }, [open, initial]);

  const set = (patch) => setEv((p) => ({ ...p, ...patch }));

  const onSubmit = () => {
    if (!ev.title.trim()) return alert("Title is required.");
    if (!ev.start || !ev.end) return alert("Start and End are required.");
    if (new Date(ev.end) <= new Date(ev.start)) return alert("End must be after Start.");
    onSave?.(ev);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[1999]" onClick={onClose} style={{ backgroundColor: "rgba(0,0,0,0.55)" }} />
      <aside className="fixed inset-y-0 right-0 w-[560px] max-w-[96vw] z-[2000] overflow-y-auto"
             style={{ backgroundColor: COLORS.bg2, borderLeft: `1px solid ${COLORS.ring}`, color: COLORS.text }}>
        {/* Header */}
        <div className="p-4 sticky top-0 flex items-center justify-between"
             style={{ backgroundColor: COLORS.bg2, borderBottom: `1px solid ${COLORS.ring}` }}>
          <div>
            <div className="text-sm font-semibold">{ev.id ? "Edit Session / Event" : "Create Session / Event"}</div>
            <div className="text-xs" style={{ color: COLORS.text2 }}>Schedule, configure capacity/tickets, links & permissions.</div>
          </div>
          <button className="p-2 rounded-lg" onClick={onClose} aria-label="Close" style={{ color: COLORS.text2 }}>
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Basics */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-2"
               style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
            <div className="sm:col-span-2">
              <label className="text-xs" style={{ color: COLORS.text2 }}>Title</label>
              <input
                value={ev.title}
                onChange={(e) => set({ title: e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                placeholder="e.g., Live: Real Estate AMA"
              />
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Type</label>
              <select
                value={ev.type}
                onChange={(e) => set({ type: e.target.value })}
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
              >
                {["live","event"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Category</label>
              <select
                value={ev.category}
                onChange={(e) => set({ category: e.target.value })}
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
              >
                {["Real Estate","Acting & Entertainment","Finance","Marketing"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Mode</label>
              <select
                value={ev.mode}
                onChange={(e) => set({ mode: e.target.value })}
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
              >
                {["virtual","in-person"].map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Host</label>
              <input
                value={ev.host}
                onChange={(e) => set({ host: e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                placeholder="Founder / Mentor name"
              />
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Capacity</label>
              <input
                type="number"
                min={1}
                value={ev.capacity}
                onChange={(e) => set({ capacity: Number(e.target.value || 0) })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
              />
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Start</label>
              <input
                type="datetime-local"
                value={ev.start?.slice(0,16) || ""}
                onChange={(e) => set({ start: e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
              />
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>End</label>
              <input
                type="datetime-local"
                value={ev.end?.slice(0,16) || ""}
                onChange={(e) => set({ end: e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs" style={{ color: COLORS.text2 }}>Description</label>
              <textarea
                rows={3}
                value={ev.description}
                onChange={(e) => set({ description: e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                placeholder="Short description…"
              />
            </div>
          </div>

          {/* Tiers & Tickets */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-2"
               style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
            <div>
              <div className="text-xs mb-2" style={{ color: COLORS.text2 }}>Tier Access</div>
              <div className="flex flex-wrap gap-2">
                {["Free","Paid","VIP"].map((t) => (
                  <TagBtn
                    key={t}
                    label={t}
                    active={(ev.tiers||[]).includes(t)}
                    onClick={() =>
                      set((p) => {
                        const setT = new Set((p.tiers||[]));
                        setT.has(t) ? setT.delete(t) : setT.add(t);
                        return { tiers: Array.from(setT) };
                      })
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs mb-2" style={{ color: COLORS.text2 }}>Tickets</div>
              <div className="space-y-2">
                {(ev.tickets||[]).map((tk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={tk.name}
                      onChange={(e) =>
                        set({
                          tickets: ev.tickets.map((t, idx) => idx === i ? { ...t, name: e.target.value } : t),
                        })
                      }
                      className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                      placeholder="Type (e.g., VIP)"
                    />
                    <input
                      type="number"
                      value={tk.price}
                      onChange={(e) =>
                        set({
                          tickets: ev.tickets.map((t, idx) => idx === i ? { ...t, price: Number(e.target.value||0) } : t),
                        })
                      }
                      className="w-28 rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                      placeholder="Price"
                    />
                    <button
                      className="px-2 py-2 rounded-lg text-sm font-semibold"
                      style={{ backgroundColor: "#12131A", color: COLORS.text2, border: `1px solid ${COLORS.ring}` }}
                      onClick={() => set({ tickets: ev.tickets.filter((_, idx) => idx !== i) })}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  className="px-3 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                  onClick={() => set({ tickets: [...(ev.tickets||[]), { name: "General", price: 0 }] })}
                >
                  + Add Ticket
                </button>
              </div>
            </div>
          </div>

          {/* Links & Options */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-2"
               style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
            {ev.mode === "virtual" ? (
              <>
                <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs" style={{ color: COLORS.text2 }}>RTMP URL</label>
                    <input
                      value={ev.rtmpUrl}
                      onChange={(e) => set({ rtmpUrl: e.target.value })}
                      className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                      placeholder="rtmp://…"
                    />
                  </div>
                  <div>
                    <label className="text-xs" style={{ color: COLORS.text2 }}>Join Link (Zoom/RTMP)</label>
                    <input
                      value={ev.joinUrl}
                      onChange={(e) => set({ joinUrl: e.target.value })}
                      className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                      placeholder="https://…"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="sm:col-span-2">
                <label className="text-xs" style={{ color: COLORS.text2 }}>Location</label>
                <input
                  value={ev.location}
                  onChange={(e) => set({ location: e.target.value })}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                  placeholder="Venue / Address"
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs" style={{ color: COLORS.text2 }}>Session Options</div>
              <Toggle label="Chat Enabled" checked={ev.chatEnabled} onChange={(v) => set({ chatEnabled: v })} />
              <Toggle label="Q&A Enabled" checked={ev.qnaEnabled} onChange={(v) => set({ qnaEnabled: v })} />
              <Toggle label="Record Session" checked={ev.recordEnabled} onChange={(v) => set({ recordEnabled: v })} />
            </div>

            <div className="space-y-2">
              <div className="text-xs" style={{ color: COLORS.text2 }}>Reminders</div>
              <div className="flex flex-wrap gap-2">
                {["72h","24h","1h","10m"].map((r) => (
                  <TagBtn
                    key={r}
                    label={r}
                    active={(ev.reminders||[]).includes(r)}
                    onClick={() => set((p) => {
                      const s = new Set(p.reminders||[]);
                      s.has(r) ? s.delete(r) : s.add(r);
                      return { reminders: Array.from(s) };
                    })}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              className="px-3 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "#12131A", border: `1px solid ${COLORS.ring}`, color: COLORS.text }}
              onClick={onSubmit}
            >
              Save
            </button>
            <button
              className="px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color: "#0B0B0F" }}
              onClick={onSubmit}
            >
              Save & Close
            </button>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default EventDrawer;
