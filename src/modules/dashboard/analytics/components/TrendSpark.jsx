import React, { useMemo } from "react";

export default function TrendSpark({
  data = [],
  height = 40,
  strokeWidth = 2,
  className = "",
}) {
  const {
    path,
    minY: _minY,
    maxY: _maxY,
    lastDeltaUp,
  } = useMemo(() => {
    if (!data || data.length === 0)
      return { path: "", minY: 0, maxY: 0, lastDeltaUp: false };

    const xs = data.map((_, i) => i);
    const ys = data.map((p) => p.y);

    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const dx = xs.length > 1 ? 100 / (xs.length - 1) : 0;
    const scaleY = (v) => {
      if (maxY === minY) return height / 2;
      const t = (v - minY) / (maxY - minY);
      return height - t * height;
    };

    const d = xs
      .map(
        (x, i) => `${i === 0 ? "M" : "L"} ${x * dx},${scaleY(ys[i]).toFixed(2)}`
      )
      .join(" ");

    const lastDeltaUp = ys.length > 1 ? ys.at(-1) >= ys.at(-2) : true;

    return { path: d, minY, maxY, lastDeltaUp };
  }, [data, height]);

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      width="100%"
      height={height}
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d={path}
        fill="none"
        stroke="url(#spark)"
        strokeWidth={strokeWidth}
        opacity="0.95"
        className="spark-path"
      />
      <defs>
        <linearGradient id="spark" x1="0%" x2="100%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.95" />
          <stop
            offset="100%"
            stopColor="rgba(99,102,241,0.9)"
            stopOpacity="0.95"
          />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="100"
        height={height}
        fill="currentColor"
        opacity="0.06"
      />
      <circle
        cx="100"
        cy={(() => {
          if (!data?.length) return height / 2;
          const ys = data.map((p) => p.y);
          const minY2 = Math.min(...ys);
          const maxY2 = Math.max(...ys);
          const v = ys.at(-1);
          if (maxY2 === minY2) return height / 2;
          const t = (v - minY2) / (maxY2 - minY2);
          return height - t * height;
        })()}
        r="2.8"
        fill="currentColor"
        opacity={lastDeltaUp ? 0.9 : 0.55}
      />
    </svg>
  );
}
