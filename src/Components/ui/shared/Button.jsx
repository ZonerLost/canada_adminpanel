import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-1.5 text-sm rounded-md font-medium ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
