import React from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const COLORS = {
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  gold: "#D4AF37",
  purple: "#6E56CF",
  ring: "rgba(110,86,207,0.25)",
};

const StatCard = ({ label, value, change, isPercent, isCurrency }) => {
  const isPositive = change >= 0;
  const Arrow = isPositive ? FiArrowUpRight : FiArrowDownRight;

  const fmt = () => {
    if (isCurrency) return `$${Number(value).toFixed(2)}`;
    if (isPercent) return `${Number(value).toFixed(2)}%`;
    return Number(value).toLocaleString();
  };

  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{
        backgroundColor: COLORS.card,
        color: COLORS.text,
        border: `1px solid ${COLORS.ring}`,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium" style={{ color: COLORS.text2 }}>
          {label}
        </p>
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md"
          style={{
            background: isPositive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
            color: isPositive ? "#22C55E" : "#EF4444",
          }}
        >
          {`${isPositive ? "+" : ""}${Math.abs(change).toFixed(2)}%`}
          <Arrow size={14} />
        </span>
      </div>
      <div className="mt-2">
        <p className="text-2xl md:text-3xl font-semibold tracking-tight">{fmt()}</p>
      </div>
      <div
        className="mt-3 h-1 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.purple})`,
          opacity: 0.9,
        }}
      />
    </div>
  );
};

const KpiTiles = ({ kpis = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {kpis.map((k) => (
        <StatCard key={k.key} {...k} />
      ))}
    </div>
  );
};

export default KpiTiles;
