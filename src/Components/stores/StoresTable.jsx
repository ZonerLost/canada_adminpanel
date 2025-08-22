import React, { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiPlus,
  FiFilter,
  FiSliders,
  FiSearch,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import { SiNike, SiAdidas, SiPuma, SiSony } from "react-icons/si";
import { TbTree } from "react-icons/tb";

/* -------------------- Sample Data -------------------- */
const storeRows = [
  {
    id: "#CM9801",
    name: "Nike",
    type: "Shoes & Sports wear",
    date: "Just now",
    Icon: SiNike,
    iconBg: "bg-black text-white",
    email: "info@nike.com",
    phone: "+1 (000) 000 0000",
  },
  {
    id: "#CM9801",
    name: "Adidas",
    type: "Shoes & Sports wear",
    date: "A minute ago",
    Icon: SiAdidas,
    iconBg: "bg-white text-black border",
    email: "hello@adidas.com",
    phone: "+49 000 0000",
  },
  {
    id: "#CM9801",
    name: "Puma",
    type: "Shoes & Sports wear",
    date: "1 hour ago",
    Icon: SiPuma,
    iconBg: "bg-black text-white",
    email: "support@puma.com",
    phone: "+49 000 0000",
  },
  {
    id: "#CM9801",
    name: "Timberland",
    type: "Shoes & wearables",
    date: "Yesterday",
    Icon: TbTree,
    iconBg: "bg-amber-400 text-black",
    email: "care@timberland.com",
    phone: "+1 (000) 000 0000",
  },
  {
    id: "#CM9801",
    name: "Sony",
    type: "Electronics",
    date: "Feb 2, 2023",
    Icon: SiSony,
    iconBg: "bg-black text-white",
    email: "info@sonyidn.com",
    phone: "+62 000 000 000",
  },
  {
    id: "#CM9801",
    name: "Nike Asia",
    type: "Shoes",
    date: "Just now",
    Icon: SiNike,
    iconBg: "bg-black text-white",
    email: "asia@nike.com",
    phone: "+65 0000 0000",
  },
  {
    id: "#CM9801",
    name: "Adidas UK",
    type: "Shoes",
    date: "A minute ago",
    Icon: SiAdidas,
    iconBg: "bg-white text-black border",
    email: "uk@adidas.com",
    phone: "+44 0000 0000",
  },
  {
    id: "#CM9801",
    name: "Puma Arizona",
    type: "Shoes",
    date: "1 hour ago",
    Icon: SiPuma,
    iconBg: "bg-black text-white",
    email: "az@puma.com",
    phone: "+1 (000) 000 0000",
  },
  {
    id: "#CM9801",
    name: "Timberland Chicago",
    type: "Shoes",
    date: "Yesterday",
    Icon: TbTree,
    iconBg: "bg-amber-400 text-black",
    email: "chi@timberland.com",
    phone: "+1 (000) 000 0000",
  },
  {
    id: "#CM9801",
    name: "Sony Singapore",
    type: "Cameras",
    date: "Feb 2, 2023",
    Icon: SiSony,
    iconBg: "bg-black text-white",
    email: "sg@sony.com",
    phone: "+65 0000 0000",
  },
];

const Checkbox = ({ checked, onChange }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onChange?.(e.target.checked)}
    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
  />
);

/* -------------------- Modal (Portal) -------------------- */
const Modal = ({ open, onClose, title, children, className = "" }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3"
      aria-modal="true"
      role="dialog"
      onMouseDown={(e) => {
        // close on backdrop click
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className={`relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-xl ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 pt-3">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

/* -------------------- Requests Modal -------------------- */
const StoreRequestsModal = ({
  open,
  onClose,
  requests,
  onDecision, // (store, decision)
}) => {
  const [mode, setMode] = useState("list"); // 'list' | 'details'
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (open) {
      setMode("list");
      setActive(null);
    }
  }, [open]);

  const Row = ({ r }) => (
    <li className="flex items-center gap-3 py-2">
      <span
        className={`w-9 h-9 rounded-full grid place-items-center ${r.iconBg} border border-black/10`}
      >
        <r.Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setActive(r);
            setMode("details");
          }}
          className="h-8 rounded-md px-3 text-[12px] font-semibold text-[#7C5AC2] bg-white border border-[#7C5AC2]/40 hover:bg-[#f7f3ff]"
        >
          View Details
        </button>
        <button
          onClick={() => onDecision?.(r, "accept")}
          className="h-8 rounded-md px-3 text-[12px] font-semibold text-white bg-emerald-500 hover:bg-emerald-600"
        >
          Accept
        </button>
        <button
          onClick={() => onDecision?.(r, "reject")}
          className="h-8 rounded-md px-3 text-[12px] font-semibold text-white bg-rose-500 hover:bg-rose-600"
        >
          Reject
        </button>
      </div>
    </li>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "list" ? "Store Requests" : "Store Details"}
    >
      {/* Subtitle bar like the screenshot */}
      {mode === "list" ? (
        <>
          <p className="px-4 sm:px-5 text-xs text-gray-500">
            Requests of all the stores to be verified
          </p>
          <div className="px-4 sm:px-5 pb-4 pt-2">
            <ul className="space-y-2">
              {requests.map((r) => (
                <Row key={r.name} r={r} />
              ))}
            </ul>
          </div>

          {/* Footer buttons */}
          <div className="px-4 sm:px-5 pb-4 space-y-2">
            <button
              onClick={onClose}
              className="h-10 w-full rounded-xl bg-[#7C5AC2] text-white font-semibold hover:bg-[#6f4dbb]"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="h-10 w-full rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        /* Details view */
        <>
          {/* back + header strip */}
          <div className="px-4 sm:px-5">
            <button
              onClick={() => setMode("list")}
              className="mt-2 mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <FiArrowLeft /> Back
            </button>
          </div>

          <div className="mx-4 sm:mx-5 rounded-xl bg-emerald-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`w-9 h-9 rounded-full grid place-items-center ${active?.iconBg} border border-white/10 bg-white/10`}
              >
                {active && <active.Icon className="w-4 h-4" />}
              </span>
              <div>
                <p className="text-sm font-semibold">{active?.name}</p>
                <p className="text-xs opacity-90">{active?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDecision?.(active, "accept")}
                className="h-8 rounded-md px-3 text-[12px] font-semibold text-emerald-700 bg-white/90 hover:bg-white"
              >
                Accept
              </button>
              <button
                onClick={() => onDecision?.(active, "reject")}
                className="h-8 rounded-md px-3 text-[12px] font-semibold text-white bg-rose-500 hover:bg-rose-600"
              >
                Reject
              </button>
            </div>
          </div>

          {/* Info grid */}
          <div className="px-4 sm:px-5 py-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <dl className="grid grid-cols-1 sm:grid-cols-1 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Store Name</dt>
                  <dd className="text-gray-900 font-medium">{active?.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Email</dt>
                  <dd className="text-gray-900 font-medium">{active?.email}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Phone Number</dt>
                  <dd className="text-gray-900 font-medium">{active?.phone}</dd>
                </div>
              </dl>
            </div>

            {/* Documents strip */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-800 mb-2">
                Documents
              </p>
              <div className="rounded-xl bg-gray-50 p-3">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/id-${i}/140/84`}
                      alt="document"
                      className="h-20 w-36 rounded-lg object-cover ring-1 ring-gray-200"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

/* -------------------- Main Table -------------------- */
const StoresTable = () => {
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState(() => new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRequests, setModalRequests] = useState([]);

  const rows = useMemo(
    () =>
      storeRows.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.type.toLowerCase().includes(search.toLowerCase()) ||
          r.id.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const openRequestsFor = (row) => {
    // build a small group with the clicked row first + 2 more (demo)
    const others = storeRows.filter((r) => r.name !== row.name).slice(0, 2);
    setModalRequests([row, ...others]);
    setModalOpen(true);
  };

  const handleDecision = (store, decision) => {
    // Demo-only: show visual feedback by toggling highlight
    console.log(decision.toUpperCase(), store.name);
    setModalRequests((prev) =>
      prev.map((r) => (r.name === store.name ? { ...r, decision } : r))
    );
  };

  return (
    <>
      <div className="rounded-2xl mt-4 bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="rounded-2xl bg-[#7C5AC2] px-3 sm:px-4 py-2.5 flex flex-wrap gap-3 items-center">
          {/* Left buttons */}
          <div className="flex items-center gap-4 text-white/95">
            <button type="button" className="p-2 hover:text-white">
              <FiPlus size={18} />
            </button>
            <button type="button" className="p-2 hover:text-white">
              <FiFilter size={18} />
            </button>
            <button type="button" className="p-2 hover:text-white">
              <FiSliders size={18} />
            </button>
          </div>

          {/* Right side */}
          <div className="ml-auto flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* New Stores */}
            <button
              type="button"
              className="h-8 pl-3 pr-2 rounded-full bg-white text-gray-700 text-sm shadow-sm inline-flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-center"
            >
              <span>New Stores</span>
              <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#7C5AC2] text-white text-[11px] px-1">
                8
              </span>
            </button>

            {/* Search */}
            <div className="w-full sm:w-52 md:w-64">
              <div className="relative">
                <FiSearch
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search"
                  className="h-9 w-full rounded-lg bg-white/95 ring-1 ring-white/60 pl-9 pr-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/80"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200">
                <th className="px-4 py-3 w-10">
                  <Checkbox checked={false} onChange={() => {}} />
                </th>
                <th className="py-3 text-left">Store ID</th>
                <th className="py-3 text-left">Stores</th>
                <th className="py-3 text-left">Type</th>
                <th className="py-3 text-left">Date</th>
                <th className="py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => {
                const active = checked.has(idx);
                const zebra = idx % 2 === 1;
                return (
                  <tr
                    key={r.name + idx}
                    className={`${
                      active
                        ? "bg-[#F6F2FF]"
                        : zebra
                        ? "bg-gray-50/70"
                        : "bg-white"
                    } border-b border-gray-100`}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={active}
                        onChange={(v) => {
                          const next = new Set(checked);
                          v ? next.add(idx) : next.delete(idx);
                          setChecked(next);
                        }}
                      />
                    </td>
                    <td className="py-3 text-gray-700">{r.id}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full grid place-items-center ${r.iconBg} border border-black/10`}
                        >
                          <r.Icon className="w-4 h-4" />
                        </span>
                        <span className="text-gray-800">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-700">{r.type}</td>
                    <td className="py-3 text-gray-700">
                      <span className="inline-flex items-center gap-2">
                        <FiCalendar className="text-gray-400" size={16} />
                        {r.date}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        className="text-[#7C5AC2] hover:underline font-medium"
                        onClick={() => openRequestsFor(r)}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-end w-full justify-end gap-1 p-3">
          <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100">
            <FiChevronLeft />
          </button>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={`h-8 w-8 rounded-md text-sm ${
                n === 1
                  ? "bg-gray-900 text-white"
                  : "bg-white ring-1 ring-gray-300"
              }`}
            >
              {n}
            </button>
          ))}
          <button className="h-8 w-8 grid place-items-center rounded-md hover:bg-gray-100">
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Requests Modal */}
      <StoreRequestsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        requests={modalRequests}
        onDecision={handleDecision}
      />
    </>
  );
};

export default StoresTable;
