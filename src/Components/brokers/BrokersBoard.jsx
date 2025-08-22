import React, { useMemo, useState } from "react";
import { MdAdd, MdFilterAlt, MdSearch, MdEdit, MdVisibility, MdDownload } from "react-icons/md";

const COLORS = {
  text: "#E6E8F0",
  text2: "#A3A7B7",
  card: "#161821",
  ring: "rgba(110,86,207,0.25)",
  gold: "#D4AF37",
  purple: "#6E56CF",
};

const Checkbox = ({ checked, onChange }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className="accent-[#6E56CF]"
    />
  </label>
);

const Pill = ({ label, tone = "neutral" }) => {
  const map = {
    success: { bg: "rgba(34,197,94,0.12)", fg: "#22C55E" },
    warn:    { bg: "rgba(245,158,11,0.12)", fg: "#F59E0B" },
    danger:  { bg: "rgba(239,68,68,0.12)", fg: "#EF4444" },
    neutral: { bg: "rgba(163,167,183,0.15)", fg: "#A3A7B7" },
  };
  const c = map[tone] || map.neutral;
  return <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold" style={{ backgroundColor:c.bg, color:c.fg }}>{label}</span>;
};

const BrokersBoard = ({ data = [], onCreate, onEdit, onSelect, onExport }) => {
  const [segment, setSegment] = useState("All");
  const [status, setStatus] = useState("All");
  const [kyc, setKyc] = useState("All");
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const segments = ["All", "Top", "New", "Risk"];

  const filtered = useMemo(() => {
    return data.filter((b) => {
      const segOk =
        segment === "All" ||
        (segment === "Top" && b.activations >= 30) ||
        (segment === "New" && Date.parse(b.joinedAt) > Date.now() - 45*24*3600*1000) ||
        (segment === "Risk" && (b.kyc === "Rejected" || (b.chargebacks||0) > 0));
      const statusOk = status === "All" || b.status === status;
      const kycOk = kyc === "All" || b.kyc === kyc;
      const q = search.trim().toLowerCase();
      const qOk = !q || [b.name, b.email, b.phone, b.id].some(x => (x||"").toLowerCase().includes(q));
      return segOk && statusOk && kycOk && qOk;
    });
  }, [data, segment, status, kyc, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = useMemo(() => {
    const s = (page - 1) * perPage;
    return filtered.slice(s, s + perPage);
  }, [filtered, page]);

  const toggleAll = (v) => {
    if (v) {
      setChecked(new Set(pageRows.map((b) => b.id)));
    } else {
      setChecked(new Set());
    }
  };
  const allSelected = pageRows.length > 0 && pageRows.every((b) => checked.has(b.id));

  const kycTone = (k) => (k === "Approved" ? "success" : k === "Pending" ? "warn" : "danger");

  return (
    <div className="rounded-2xl" style={{ backgroundColor: COLORS.card, border:`1px solid ${COLORS.ring}` }}>
      {/* Toolbar */}
      <div className="px-3 sm:px-4 py-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Segments */}
          <div className="-mx-1 overflow-x-auto">
            <div className="px-1 flex items-center gap-2 min-w-max">
              {segments.map((seg) => {
                const active = segment === seg;
                return (
                  <button
                    key={seg}
                    onClick={() => { setSegment(seg); setPage(1); }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap"
                    style={{
                      background: active ? `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})` : "transparent",
                      color: active ? "#0B0B0F" : COLORS.text2,
                      border: active ? "none" : `1px solid ${COLORS.ring}`,
                    }}
                  >
                    {seg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right cluster */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {/* Search */}
            <div className="relative w-full sm:w-64 xl:w-80 order-1 sm:order-none">
              <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.text2 }} />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search broker, email, ID…"
                className="h-9 w-full rounded-lg pl-9 pr-3 text-sm outline-none"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              />
            </div>

            {/* Mobile Filters toggle */}
            <button
              type="button"
              onClick={() => setFiltersOpen(v => !v)}
              className="sm:hidden h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
              style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
            >
              <MdFilterAlt /> Filters
            </button>

            {/* ≥ sm Filters */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 text-xs" style={{ color: COLORS.text2 }}>
                <MdFilterAlt /> Filters
              </div>
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="h-9 rounded-lg px-2 text-sm"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              >
                {["All","Active","Inactive"].map(s => <option key={s} value={s}>Status: {s}</option>)}
              </select>
              <select
                value={kyc}
                onChange={(e) => { setKyc(e.target.value); setPage(1); }}
                className="h-9 rounded-lg px-2 text-sm"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
              >
                {["All","Approved","Pending","Rejected"].map(k => <option key={k} value={k}>KYC: {k}</option>)}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap sm:justify-end">
              <button
                className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
                onClick={() => onExport?.(Array.from(checked).length ? data.filter(d => checked.has(d.id)) : filtered)}
                title="Export CSV"
              >
                <MdDownload /> Export
              </button>
              <button
                className="h-9 px-3 rounded-lg text-sm font-medium inline-flex items-center gap-2"
                style={{ background:`linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color:"#0B0B0F" }}
                onClick={onCreate}
              >
                <MdAdd /> New Broker
              </button>
            </div>
          </div>

          {/* Mobile filters */}
          <div className={`${filtersOpen ? "grid" : "hidden"} grid-cols-1 gap-2 sm:hidden`}>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="h-9 rounded-lg px-2 text-sm"
              style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
            >
              {["All","Active","Inactive"].map(s => <option key={s} value={s}>Status: {s}</option>)}
            </select>
            <select
              value={kyc}
              onChange={(e) => { setKyc(e.target.value); setPage(1); }}
              className="h-9 rounded-lg px-2 text-sm"
              style={{ backgroundColor:"#12131A", color: COLORS.text, border:`1px solid ${COLORS.ring}` }}
            >
              {["All","Approved","Pending","Rejected"].map(k => <option key={k} value={k}>KYC: {k}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Cards (mobile) */}
      <div className="md:hidden grid grid-cols-1 gap-3 px-3 pb-3">
        {pageRows.map((b) => (
          <div key={b.id} className="rounded-xl p-3" style={{ backgroundColor:"#0F1118", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}>
            <div className="flex items-center gap-3">
              <img src={b.avatar} alt={b.name} className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0">
                <div className="font-semibold truncate">{b.name}</div>
                <div className="text-xs truncate" style={{ color: COLORS.text2 }}>{b.email}</div>
              </div>
              <div className="ml-auto">
                <Pill label={b.kyc} tone={kycTone(b.kyc)} />
              </div>
            </div>
            <div className="mt-2 text-xs" style={{ color: COLORS.text2 }}>
              Activations {b.activations} • Earnings ${b.earnings}
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1"
                style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                onClick={() => onSelect?.(b)}
              >
                <MdVisibility size={16}/> Details
              </button>
              <button
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1"
                style={{ background:`linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color:"#0B0B0F" }}
                onClick={() => onEdit?.(b)}
              >
                <MdEdit size={16}/> Edit
              </button>
            </div>
          </div>
        ))}
        {!pageRows.length && (
          <div className="px-1 pb-4 text-center text-sm" style={{ color: COLORS.text2 }}>
            No brokers match the current filters.
          </div>
        )}
      </div>

      {/* Table (desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead>
            <tr className="sticky top-0 z-10" style={{ backgroundColor:"#0F1118", color: COLORS.text2, borderBottom:`1px solid ${COLORS.ring}` }}>
              <th className="px-4 py-3.5 w-10"><Checkbox checked={allSelected} onChange={toggleAll} /></th>
              <th className="py-3.5 text-left">Broker</th>
              <th className="py-3.5 text-left">Status</th>
              <th className="py-3.5 text-left">KYC</th>
              <th className="py-3.5 text-left">Activations</th>
              <th className="py-3.5 text-left">Earnings</th>
              <th className="py-3.5 text-left">Commission</th>
              <th className="py-3.5 text-left">Last Active</th>
              <th className="py-3.5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((b, i) => (
              <tr key={b.id}
                  className={`transition-colors ${i % 2 ? "bg-[#131522]" : ""} hover:bg-[#1A1C26]`}
                  style={{ color: COLORS.text, borderBottom:`1px solid ${COLORS.ring}` }}>
                <td className="px-4 py-3.5 align-middle">
                  <Checkbox
                    checked={checked.has(b.id)}
                    onChange={(v) => {
                      const next = new Set(checked);
                      v ? next.add(b.id) : next.delete(b.id);
                      setChecked(next);
                    }}
                  />
                </td>
                <td className="py-3.5 pr-4 align-middle">
                  <div className="flex items-center gap-3 min-w-[320px]">
                    <img src={b.avatar} alt={b.name} className="h-10 w-10 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{b.name}</div>
                      <div className="text-xs truncate" style={{ color: COLORS.text2 }}>{b.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 pr-4 align-middle" style={{ color: COLORS.text2 }}>{b.status}</td>
                <td className="py-3.5 pr-4 align-middle"><Pill label={b.kyc} tone={kycTone(b.kyc)} /></td>
                <td className="py-3.5 pr-4 align-middle" style={{ color: COLORS.text2 }}>{b.activations}</td>
                <td className="py-3.5 pr-4 align-middle" style={{ color: COLORS.text2 }}>${b.earnings}</td>
                <td className="py-3.5 pr-4 align-middle" style={{ color: COLORS.text2 }}>{Math.round(b.commissionRate*100)}%</td>
                <td className="py-3.5 pr-4 align-middle" style={{ color: COLORS.text2 }}>{b.lastActive}</td>
                <td className="py-3.5 pr-4 align-middle">
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1"
                      style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text }}
                      onClick={() => onSelect?.(b)}
                    >
                      <MdVisibility size={16}/> Details
                    </button>
                    <button
                      className="px-2.5 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1"
                      style={{ background:`linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`, color:"#0B0B0F" }}
                      onClick={() => onEdit?.(b)}
                    >
                      <MdEdit size={16}/> Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!pageRows.length && (
              <tr>
                <td colSpan={9} className="py-10 text-center" style={{ color: COLORS.text2 }}>
                  No brokers match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2 p-3">
        <button
          className="h-8 px-3 rounded-lg text-sm"
          style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text2 }}
          onClick={() => setPage(p => Math.max(1, p-1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <div className="text-xs" style={{ color: COLORS.text2 }}>
          Page <span className="font-semibold" style={{ color: COLORS.text }}>{page}</span> / {totalPages}
        </div>
        <button
          className="h-8 px-3 rounded-lg text-sm"
          style={{ backgroundColor:"#12131A", border:`1px solid ${COLORS.ring}`, color: COLORS.text2 }}
          onClick={() => setPage(p => Math.min(totalPages, p+1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BrokersBoard;
