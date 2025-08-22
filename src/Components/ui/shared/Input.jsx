import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-black ${className}`}
      {...props}
    />
  );
}
