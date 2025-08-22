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
  name: "",
  email: "",
  phone: "",
  avatar: "",
  status: "Active",
  kyc: "Pending",
  activations: 0,
  earnings: 0,
  commissionRate: 0.1,
  activationFee: 30,
  chargebacks: 0,
  lastActive: "",
  joinedAt: "",
  performance: { months: [], activations: [], earnings: [] },
  payouts: [],
  history: [],
  resources: [],
};

const BrokerDrawer = ({ open, initial, onClose, onSave }) => {
  const [mounted, setMounted] = useState(false);
  const [broker, setBroker] = useState(DEFAULT);

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => { if (open) setBroker({ ...DEFAULT, ...(initial || {}) }); }, [open, initial]);

  const set = (patch) => setBroker((p) => ({ ...p, ...patch }));

  const submit = () => {
    if (!broker.name.trim() || !broker.email.trim()) return alert("Name and Email are required.");
    if (!broker.joinedAt) set({ joinedAt: new Date().toISOString().slice(0,10) });
    onSave?.({ ...broker });
  };

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2999]" onClick={onClose} style={{ backgroundColor:"rgba(0,0,0,0.55)" }} />
      <aside className="fixed inset-y-0 right-0 w-[520px] max-w-[96vw] z-[3000] overflow-y-auto"
             style={{ backgroundColor: COLORS.bg2, borderLeft:`1px solid ${COLORS.ring}`, color: COLORS.text }}>
        {/* Header */}
        <div className="p-4 sticky top-0 flex items-center justify-between"
             style={{ backgroundColor: COLORS.bg2, borderBottom:`1px solid ${COLORS.ring}` }}>
          <div>
            <div className="text-sm font-semibold">{broker.id ? "Edit Broker" : "Create Broker"}</div>
            <div className="text-xs" style={{ color: COLORS.text2 }}>KYC/state, commission & contact details.</div>
          </div>
          <button className="p-2 rounded-lg" onClick={onClose} aria-label="Close" style={{ color: COLORS.text2 }}>
            <MdClose size={20}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Identity */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-2" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div className="sm:col-span-2">
              <label className="text-xs" style={{ color: COLORS.text2 }}>Full Name</label>
              <input
                value={broker.name}
                onChange={(e)=>set({ name:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Email</label>
              <input
                value={broker.email}
                onChange={(e)=>set({ email:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                placeholder="name@email.com"
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Phone</label>
              <input
                value={broker.phone}
                onChange={(e)=>set({ phone:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                placeholder="+1 555 555 5555"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs" style={{ color: COLORS.text2 }}>Avatar URL (optional)</label>
              <input
                value={broker.avatar || ""}
                onChange={(e)=>set({ avatar:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Status / KYC */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-3" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Status</label>
              <select
                value={broker.status}
                onChange={(e)=>set({ status:e.target.value })}
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              >
                {["Active","Inactive"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>KYC</label>
              <select
                value={broker.kyc}
                onChange={(e)=>set({ kyc:e.target.value })}
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              >
                {["Pending","Approved","Rejected"].map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Joined</label>
              <input
                type="date"
                value={broker.joinedAt || ""}
                onChange={(e)=>set({ joinedAt:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              />
            </div>
          </div>

          {/* Compensation */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-2" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Commission Rate (%)</label>
              <input
                type="number"
                min={0}
                step={1}
                value={Math.round((broker.commissionRate||0)*100)}
                onChange={(e)=>set({ commissionRate: (Number(e.target.value||0)/100) })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Activation Fee ($)</label>
              <input
                type="number"
                min={0}
                value={broker.activationFee}
                onChange={(e)=>set({ activationFee: Number(e.target.value||0) })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              className="px-3 py-2 rounded-xl text-sm font-medium"
              style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
              onClick={submit}
            >
              Save
            </button>
            <button
              className="px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background:`linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color:"#0B0B0F" }}
              onClick={submit}
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

export default BrokerDrawer;
