import React from "react";

export default function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-2">Loading…</div>
        <div className="animate-pulse h-2 w-40 bg-slate-800 rounded" />
      </div>
    </div>
  );
}
