import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { MdDownload } from "react-icons/md";
import { COLORS } from "../../Pages/SupportMediaSettingsPage";

const macros = [
  { id: "m_refund", name: "Refund + Downgrade", text: "We have refunded your charge and downgraded your plan to Free." },
  { id: "m_welcome", name: "Welcome message", text: "Welcome to Sexy Soul Living! Let us know if you need anything." },
  { id: "m_ptm", name: "PTM sync info", text: "We synced discount partners. Please retry your redemption." },
];

const TicketDetails = ({ open, ticket, onClose, onSave }) => {
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState(null);

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => { if (open) setDraft(ticket || null); }, [open, ticket]);

  const timeline = useMemo(() => draft?.thread || [], [draft]);
  const [note, setNote] = useState("");

  const applyMacro = (id) => {
    const m = macros.find((x) => x.id === id);
    if (!m) return;
    setDraft((p) => ({
      ...p,
      thread: [...(p?.thread || []), { who: "Support", at: ts(), text: m.text }],
      updatedAt: ts(),
    }));
  };

  const set = (patch) => setDraft((p) => ({ ...p, ...patch }));

  const submit = () => {
    if (!draft) return;
    const next = { ...draft };
    if (note.trim()) {
      next.notes = [...(next.notes || []), { at: ts(), by: "You", text: note.trim() }];
      setNote("");
    }
    onSave?.(next);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[2999] ${open ? "block" : "hidden"}`}
        onClick={onClose}
        style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      />
      <aside
        className={`fixed inset-y-0 right-0 w-[960px] max-w-[98vw] z-[3000] overflow-y-auto transition-transform duration-200
                    ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: COLORS.bg2, borderLeft: `1px solid ${COLORS.ring}`, color: COLORS.text }}
        aria-hidden={!open}
      >
        {/* header */}
        <div className="p-4 sticky top-0 flex items-center justify-between"
             style={{ backgroundColor: COLORS.bg2, borderBottom: `1px solid ${COLORS.ring}` }}>
          <div>
            <div className="text-sm font-semibold">Ticket Details</div>
            <div className="text-xs" style={{ color: COLORS.text2 }}>
              {draft?.id} • {draft?.status} • Priority {draft?.priority}
            </div>
          </div>
          <button className="p-2 rounded-lg" onClick={onClose} aria-label="Close" style={{ color: COLORS.text2 }}>
            <IoClose size={20} />
          </button>
        </div>

        {/* body */}
        <div className="p-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          {/* left: conversation + actions */}
          <div className="space-y-4">
            <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
              <div className="text-sm font-semibold">{draft?.subject}</div>
              <div className="mt-3 space-y-3">
                {timeline.map((m, i) => (
                  <div key={i} className="rounded-lg px-3 py-2"
                       style={{ backgroundColor: "#0F1118", border: `1px solid ${COLORS.ring}` }}>
                    <div className="text-xs" style={{ color: COLORS.text2 }}>
                      {m.who} • {m.at}
                    </div>
                    <div className="text-sm mt-1">{m.text}</div>
                  </div>
                ))}
                {!timeline.length && (
                  <div className="text-xs" style={{ color: COLORS.text2 }}>
                    No messages yet.
                  </div>
                )}
              </div>

              {/* reply box */}
              <div className="mt-3">
                <label className="text-xs" style={{ color: COLORS.text2 }}>Quick Macros</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {macros.map((m) => (
                    <button
                      key={m.id}
                      className="px-2 py-1 rounded-md text-xs"
                      style={{ backgroundColor: "#0F1118", border: `1px solid ${COLORS.ring}`, color: COLORS.text2 }}
                      onClick={() => applyMacro(m.id)}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs" style={{ color: COLORS.text2 }}>Status</label>
                  <select
                    value={draft?.status || "Open"}
                    onChange={(e) => set({ status: e.target.value, updatedAt: ts() })}
                    className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                    style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                  >
                    {["New", "Open", "Pending", "Resolved", "Closed"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs" style={{ color: COLORS.text2 }}>Priority</label>
                  <select
                    value={draft?.priority || "Medium"}
                    onChange={(e) => set({ priority: e.target.value, updatedAt: ts() })}
                    className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                    style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                  >
                    {["Low", "Medium", "High"].map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs" style={{ color: COLORS.text2 }}>Assignee</label>
                  <input
                    value={draft?.assignee || ""}
                    onChange={(e) => set({ assignee: e.target.value, updatedAt: ts() })}
                    placeholder="Assign to…"
                    className="mt-1 w-full rounded-lg px-3 h-10 text-sm outline-none"
                    style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs" style={{ color: COLORS.text2 }}>Internal Note</label>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                  placeholder="Add a note for other agents…"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs" style={{ color: COLORS.text2 }}>
                  SLA due: {draft?.slaDue || "—"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-2 rounded-xl text-sm font-medium inline-flex items-center gap-2"
                    style={{ backgroundColor: "#12131A", border: `1px solid ${COLORS.ring}`, color: COLORS.text }}
                    onClick={() => window.alert("Download transcript (mock)")}
                  >
                    <MdDownload /> Transcript
                  </button>
                  <button
                    className="px-3 py-2 rounded-xl text-sm font-medium"
                    style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color: "#0B0B0F" }}
                    onClick={submit}
                  >
                    Save & Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* right: user context */}
          <div className="space-y-4">
            <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
              <div className="text-sm font-semibold">User</div>
              <div className="text-xs mt-1" style={{ color: COLORS.text2 }}>
                Name
              </div>
              <div className="font-medium">{draft?.user?.name}</div>
              <div className="text-xs mt-2" style={{ color: COLORS.text2 }}>
                Email
              </div>
              <div className="font-medium">{draft?.user?.email}</div>
              <div className="text-xs mt-2" style={{ color: COLORS.text2 }}>
                Tier
              </div>
              <div className="font-medium">{draft?.user?.tier}</div>

              <div className="h-px my-3" style={{ backgroundColor: COLORS.ring }} />

              <div className="text-sm font-semibold">Invoices</div>
              <ul className="mt-2 space-y-2 text-sm">
                {(draft?.user?.invoices || []).map((inv) => (
                  <li key={inv.id} className="flex items-center justify-between">
                    <span>{inv.id}</span>
                    <span>${inv.amount?.toFixed(2)} • {inv.date}</span>
                  </li>
                ))}
                {!(draft?.user?.invoices || []).length && (
                  <li className="text-xs" style={{ color: COLORS.text2 }}>No invoices found.</li>
                )}
              </ul>
            </div>

            <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
              <div className="text-sm font-semibold">Notes</div>
              <div className="mt-2 space-y-2">
                {(draft?.notes || []).map((n, i) => (
                  <div key={i} className="rounded-lg px-3 py-2 text-sm"
                       style={{ backgroundColor: "#0F1118", border: `1px solid ${COLORS.ring}` }}>
                    <div className="text-xs" style={{ color: COLORS.text2 }}>{n.by} • {n.at}</div>
                    <div>{n.text}</div>
                  </div>
                ))}
                {!(draft?.notes || []).length && (
                  <div className="text-xs" style={{ color: COLORS.text2 }}>No internal notes yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default TicketDetails;

const ts = () => new Date().toISOString().replace("T", " ").slice(0, 16);
