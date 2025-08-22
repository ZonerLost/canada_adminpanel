import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { COLORS } from "../../Pages/SupportMediaSettingsPage";

const DEFAULT = {
  id: "",
  name: "",
  type: "image",
  size: "",
  version: 1,
  tags: [],
  preview: "",
  usage: [],
  createdAt: "",
  versions: [],
  cdn: "",
};

const MediaUploadDrawer = ({ open, initial, onClose, onSave }) => {
  const [mounted, setMounted] = useState(false);
  const [a, setA] = useState(DEFAULT);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => { setMounted(true); return () => setMounted(false); }, []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (open) setA({ ...DEFAULT, ...(initial || {}), createdAt: initial?.createdAt || ts(), versions: initial?.versions || [{ v: initial?.version || 1, at: ts() }] });
  }, [open, initial]);

  const set = (patch) => setA((p) => ({ ...p, ...patch }));
  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    set({ tags: Array.from(new Set([...(a.tags || []), t])) });
    setTagInput("");
  };

  const submit = () => {
    if (!a.name.trim()) return alert("Asset name is required.");
    onSave?.(a);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div className={`fixed inset-0 z-[2999] ${open ? "block" : "hidden"}`} onClick={onClose} style={{ backgroundColor: "rgba(0,0,0,0.55)" }} />
      <aside
        className={`fixed inset-y-0 right-0 w-[720px] max-w-[98vw] z-[3000] overflow-y-auto transition-transform duration-200
                    ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: COLORS.bg2, borderLeft: `1px solid ${COLORS.ring}`, color: COLORS.text }}
        aria-hidden={!open}
      >
        {/* header */}
        <div className="p-4 sticky top-0 flex items-center justify-between"
             style={{ backgroundColor: COLORS.bg2, borderBottom: `1px solid ${COLORS.ring}` }}>
          <div>
            <div className="text-sm font-semibold">{a?.id ? "Edit Asset" : "Upload Asset"}</div>
            <div className="text-xs" style={{ color: COLORS.text2 }}>Upload • Tag • Version</div>
          </div>
          <button className="p-2 rounded-lg" onClick={onClose} aria-label="Close" style={{ color: COLORS.text2 }}>
            <IoClose size={20} />
          </button>
        </div>

        <div className="p-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          {/* left form */}
          <div className="space-y-3">
            <div className="rounded-2xl p-4 space-y-3" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
              <div>
                <label className="text-xs" style={{ color: COLORS.text2 }}>Name</label>
                <input
                  value={a.name}
                  onChange={(e) => set({ name: e.target.value })}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                  placeholder="Summer Retreat Cover"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs" style={{ color: COLORS.text2 }}>Type</label>
                  <select
                    value={a.type}
                    onChange={(e) => set({ type: e.target.value })}
                    className="mt-1 w-full rounded-lg px-2 h-10 text-sm outline-none"
                    style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                  >
                    {["image", "video", "audio", "pdf", "other"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs" style={{ color: COLORS.text2 }}>Size (display)</label>
                  <input
                    value={a.size}
                    onChange={(e) => set({ size: e.target.value })}
                    className="mt-1 w-full rounded-lg px-3 h-10 text-sm outline-none"
                    style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                    placeholder="320KB / 12MB"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs" style={{ color: COLORS.text2 }}>Preview URL</label>
                <input
                  value={a.preview}
                  onChange={(e) => set({ preview: e.target.value })}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                  placeholder="https://…"
                />
              </div>
              <div className="grid sm:grid-cols-[1fr_auto] gap-2">
                <div>
                  <label className="text-xs" style={{ color: COLORS.text2 }}>Tags</label>
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="mt-1 w-full rounded-lg px-3 h-10 text-sm outline-none"
                    style={{ backgroundColor: "#12131A", color: COLORS.text, border: `1px solid ${COLORS.ring}` }}
                    placeholder="vip, cover, promo…"
                  />
                </div>
                <button
                  className="self-end h-10 px-3 rounded-lg text-sm font-semibold"
                  style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color: "#0B0B0F" }}
                  onClick={addTag}
                >
                  Add
                </button>
              </div>
              {!!a.tags?.length && (
                <div className="flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full text-[11px] cursor-pointer"
                      style={{ backgroundColor: COLORS.bg2, border: `1px solid ${COLORS.ring}`, color: COLORS.text2 }}
                      onClick={() => set({ tags: (a.tags || []).filter((x) => x !== t) })}
                    >
                      {t} ✕
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                className="px-3 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: "#12131A", border: `1px solid ${COLORS.ring}`, color: COLORS.text }}
                onClick={submit}
              >
                Save
              </button>
              <button
                className="px-3 py-2 rounded-xl text-sm font-medium"
                style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color: "#0B0B0F" }}
                onClick={() => { submit(); onClose?.(); }}
              >
                Save & Close
              </button>
            </div>
          </div>

          {/* right preview */}
          <div className="space-y-3">
            <div className="rounded-2xl p-3" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
              <div className="text-xs mb-2" style={{ color: COLORS.text2 }}>Preview</div>
              <div className="rounded-lg overflow-hidden border" style={{ borderColor: COLORS.ring }}>
                {a.preview ? (
                  <img src={a.preview} alt="preview" className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 grid place-items-center text-sm" style={{ color: COLORS.text2 }}>
                    No preview
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-2xl p-3" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}>
              <div className="text-xs" style={{ color: COLORS.text2 }}>
                Tip: This drawer is a mock uploader. Hook it to your storage (S3/GCS/CDN) later.
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default MediaUploadDrawer;

const ts = () => new Date().toISOString().replace("T", " ").slice(0, 16);
