import React from "react";

export default function Section({
  title,
  hint,
  right = null,
  children,
  className = "",
}) {
  return (
    <div className={`card ${className}`}>
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div className="font-semibold">{title}</div>
          {hint ? <div className="text-xs text-muted">{hint}</div> : null}
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
