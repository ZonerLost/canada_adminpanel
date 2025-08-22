import React from "react";

export function Checkbox({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
    />
  );
}
