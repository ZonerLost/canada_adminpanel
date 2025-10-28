import React from "react";
export default function SkeletonRow({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-2">
          <div className="skel h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}
