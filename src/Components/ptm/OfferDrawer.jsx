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
  brand: "",
  category: "Dining",
  tiers: ["Paid"],
  status: "Active",
  codeType: "code",
  codeValue: "",
  perUserLimit: 1,
  totalLimit: 1000,
  validFrom: "",
  validTo: "",
  geo: { cities: [], radiusDefaultKm: 50 },
  vendor: { id: "", logo: "", contact: "", website: "" },
  redemptions: { byCity: {}, byTier: {}, total: 0 },
  createdAt: "",
  updatedAt: "",
};

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

const OfferDrawer = ({ open, initial, onClose, onSave }) => {
  const [mounted, setMounted] = useState(false);
  const [offer, setOffer] = useState(DEFAULT);

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => { if (open) setOffer({ ...DEFAULT, ...(initial || {}) }); }, [open, initial]);

  const set = (patch) => setOffer((p) => ({ ...p, ...patch }));

  const addCity = () => {
    const name = prompt("City, Country (e.g., London, UK)");
    if (!name) return;
    const radiusStr = prompt("Radius (km)", String(offer.geo?.radiusDefaultKm ?? 50));
    const radiusKm = Number(radiusStr || 50);
    set({
      geo: { ...offer.geo, cities: [...(offer.geo?.cities||[]), { name, radiusKm }] },
    });
  };
  const removeCity = (idx) => {
    set({ geo: { ...offer.geo, cities: (offer.geo?.cities||[]).filter((_,i)=>i!==idx) } });
  };

  const randomCode = () => {
    const s = Math.random().toString(36).slice(2, 8).toUpperCase();
    set({ codeValue: `${offer.brand?.slice(0,3).toUpperCase() || "OFF"}-${s}` });
  };

  const submit = () => {
    if (!offer.title.trim() || !offer.brand.trim()) return alert("Title and Brand are required.");
    if (!offer.validFrom || !offer.validTo) return alert("Validity (from/to) is required.");
    onSave?.({ ...offer, updatedAt: new Date().toISOString().slice(0,10) });
  };

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[2999]" onClick={onClose} style={{ backgroundColor:"rgba(0,0,0,0.55)" }} />
      <aside className="fixed inset-y-0 right-0 w-[560px] max-w-[96vw] z-[3000] overflow-y-auto"
             style={{ backgroundColor: COLORS.bg2, borderLeft:`1px solid ${COLORS.ring}`, color: COLORS.text }}>
        {/* Header */}
        <div className="p-4 sticky top-0 flex items-center justify-between"
             style={{ backgroundColor: COLORS.bg2, borderBottom:`1px solid ${COLORS.ring}` }}>
          <div>
            <div className="text-sm font-semibold">{offer.id ? "Edit Offer" : "Create Offer"}</div>
            <div className="text-xs" style={{ color: COLORS.text2 }}>Title, brand, tiers, geo coverage & codes.</div>
          </div>
          <button className="p-2 rounded-lg" onClick={onClose} aria-label="Close" style={{ color: COLORS.text2 }}>
            <MdClose size={20}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Basics */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-2" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div className="sm:col-span-2">
              <label className="text-xs" style={{ color: COLORS.text2 }}>Title</label>
              <input
                value={offer.title}
                onChange={(e)=>set({ title:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                placeholder="e.g., 20% off Breakfast"
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Brand</label>
              <input
                value={offer.brand}
                onChange={(e)=>set({ brand:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                placeholder="Brand name"
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Category</label>
              <select
                value={offer.category}
                onChange={(e)=>set({ category:e.target.value })}
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              >
                {["Dining","Travel","Lifestyle"].map(c=> <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Status</label>
              <select
                value={offer.status}
                onChange={(e)=>set({ status:e.target.value })}
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              >
                {["Active","Paused","Expired","Draft"].map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Tier Access</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {["Free","Paid","VIP"].map((t)=>(
                  <TagBtn
                    key={t}
                    label={t}
                    active={(offer.tiers||[]).includes(t)}
                    onClick={() => set((p)=> {
                      const s = new Set(p.tiers||[]);
                      s.has(t) ? s.delete(t) : s.add(t);
                      return { tiers: Array.from(s) };
                    })}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Valid From</label>
              <input
                type="date"
                value={offer.validFrom || ""}
                onChange={(e)=>set({ validFrom:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Valid To</label>
              <input
                type="date"
                value={offer.validTo || ""}
                onChange={(e)=>set({ validTo:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs" style={{ color: COLORS.text2 }}>Description / Rules</label>
              <textarea
                rows={3}
                value={offer.description || ""}
                onChange={(e)=>set({ description:e.target.value })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                placeholder="Key terms, blackout dates, weekdays only, etc."
              />
            </div>
          </div>

          {/* Codes & Limits */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-2" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Code Type</label>
              <select
                value={offer.codeType}
                onChange={(e)=>set({ codeType:e.target.value })}
                className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              >
                {["code","qr"].map(t=> <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs" style={{ color: COLORS.text2 }}>Code / QR Payload</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  value={offer.codeValue}
                  onChange={(e)=>set({ codeValue:e.target.value })}
                  className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                  placeholder="OFF-ABC123"
                />
                <button
                  className="px-3 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor:"#12131A", color: COLORS.text2, border:`1px solid ${COLORS.ring}` }}
                  onClick={randomCode}
                >
                  Random
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Per-user Limit</label>
              <input
                type="number"
                min={1}
                value={offer.perUserLimit}
                onChange={(e)=>set({ perUserLimit:Number(e.target.value||0) })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              />
            </div>
            <div>
              <label className="text-xs" style={{ color: COLORS.text2 }}>Total Limit</label>
              <input
                type="number"
                min={1}
                value={offer.totalLimit}
                onChange={(e)=>set({ totalLimit:Number(e.target.value||0) })}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              />
            </div>
          </div>

          {/* Geo coverage */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div className="flex items-center justify-between">
              <div className="text-xs" style={{ color: COLORS.text2 }}>Geo Coverage (“In My Area”)</div>
              <button
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                onClick={addCity}
              >
                + Add City
              </button>
            </div>
            <div className="mt-3 grid gap-2">
              {(offer.geo?.cities||[]).map((c, i)=>(
                <div key={`${c.name}-${i}`} className="flex items-center justify-between rounded-lg px-3 py-2"
                     style={{ backgroundColor:"#0F1118", border:`1px solid ${COLORS.ring}` }}>
                  <div className="text-sm" style={{ color: COLORS.text }}>{c.name}</div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.text2 }}>
                    radius {c.radiusKm}km
                    <button
                      className="px-2 py-1 rounded-md"
                      style={{ backgroundColor:"#12131A", color: COLORS.text2, border:`1px solid ${COLORS.ring}` }}
                      onClick={() => removeCity(i)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {!offer.geo?.cities?.length && (
                <div className="text-xs" style={{ color: COLORS.text2 }}>No cities added yet.</div>
              )}
              <div className="rounded-xl overflow-hidden mt-2 ring-1" style={{ borderColor: COLORS.ring }}>
                {/* Map placeholder: put /public/assets/Map.png */}
                <img src="/assets/Map.png" alt="Map coverage" className="w-full h-40 object-contain opacity-90" />
              </div>
            </div>
          </div>

          {/* Vendor */}
          <div className="rounded-2xl p-4 grid gap-3 sm:grid-cols-[96px_1fr]" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
            <div className="h-24 w-24 rounded-xl overflow-hidden ring-1 flex items-center justify-center bg-white" style={{ borderColor: COLORS.ring }}>
              {offer.vendor?.logo ? (
                <img src={offer.vendor.logo} alt="logo" className="h-full w-full object-contain" />
              ) : (
                <span className="text-xs text-gray-500">Logo</span>
              )}
            </div>
            <div className="grid gap-2">
              <div>
                <label className="text-xs" style={{ color: COLORS.text2 }}>Vendor Contact</label>
                <input
                  value={offer.vendor?.contact || ""}
                  onChange={(e)=>set({ vendor:{ ...(offer.vendor||{}), contact:e.target.value } })}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                  placeholder="email@brand.com"
                />
              </div>
              <div>
                <label className="text-xs" style={{ color: COLORS.text2 }}>Vendor Website</label>
                <input
                  value={offer.vendor?.website || ""}
                  onChange={(e)=>set({ vendor:{ ...(offer.vendor||{}), website:e.target.value } })}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                  placeholder="https://brand.com"
                />
              </div>
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

export default OfferDrawer;
