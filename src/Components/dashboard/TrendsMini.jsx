import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = {
  card: "#161821",
  text: "#E6E8F0",
  text2: "#A3A7B7",
  gold: "#D4AF37",
  purple: "#6E56CF",
  ring: "rgba(110,86,207,0.25)",
};

const Card = ({ title, subtitle, children }) => (
  <div
    className="rounded-2xl p-4 sm:p-5"
    style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.ring}` }}
  >
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-semibold" style={{ color: COLORS.text }}>
        {title}
      </h3>
      {subtitle ? (
        <span className="text-xs" style={{ color: COLORS.text2 }}>
          {subtitle}
        </span>
      ) : null}
    </div>
    {children}
  </div>
);

const Pill = ({ label, color }) => (
  <span className="inline-flex items-center gap-1 text-[11px] font-medium">
    <span
      className="w-2 h-2 rounded-full"
      style={{ background: color, boxShadow: "0 0 0 2px rgba(255,255,255,0.06)" }}
    />
    <span style={{ color: COLORS.text2 }}>{label}</span>
  </span>
);

const TrendChart = ({ data, valueFmt }) => (
  <div className="h-40">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#222533" vertical={false} />
        <XAxis dataKey="m" tickLine={false} axisLine={false} stroke={COLORS.text2} fontSize={12} />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke={COLORS.text2}
          fontSize={12}
          tickFormatter={valueFmt}
          width={36}
        />
        <Tooltip
          contentStyle={{
            background: "#0F1117",
            border: `1px solid ${COLORS.ring}`,
            borderRadius: 8,
            color: COLORS.text,
            fontSize: 12,
          }}
          formatter={(v) => [valueFmt(v), ""]}
          labelStyle={{ color: COLORS.text2 }}
        />
        <Line
          type="monotone"
          dataKey="cur"
          stroke="#D4AF37"
          strokeWidth={3}
          dot={{ r: 3, fill: "#D4AF37", stroke: "#12131A", strokeWidth: 2 }}
          activeDot={{ r: 5, fill: "#D4AF37", stroke: "#12131A", strokeWidth: 3 }}
        />
        <Line
          type="monotone"
          dataKey="prev"
          stroke="#6E56CF"
          strokeWidth={3}
          strokeDasharray="6 6"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const TrendsMini = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card title="Subscribers" subtitle={<Pill label="current vs previous" color="#D4AF37" />}>
        <TrendChart data={data.subs} valueFmt={(v) => v} />
      </Card>

      <Card title="Revenue (×$1k)" subtitle={<Pill label="current vs previous" color="#D4AF37" />}>
        <TrendChart data={data.revenue} valueFmt={(v) => `$${v}`} />
      </Card>

      <Card title="Engagement (min)" subtitle={<Pill label="current vs previous" color="#D4AF37" />}>
        <TrendChart data={data.engagement} valueFmt={(v) => v} />
      </Card>

      <Card title="Redemptions" subtitle={<Pill label="current vs previous" color="#D4AF37" />}>
        <TrendChart data={data.redemptions} valueFmt={(v) => v} />
      </Card>
    </div>
  );
};

export default TrendsMini;
