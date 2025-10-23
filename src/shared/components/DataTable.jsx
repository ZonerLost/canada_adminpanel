import React from "react";
import SkeletonRow from "./SkeletonRow.jsx";

export default function DataTable({
  columns = [],
  rows,
  loading = false,
  empty = "No data.",
  footer,
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="text-left text-muted">
            <tr>
              {columns.map((c) => (
                <th key={c.key || c.header} className="px-3 py-2">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <SkeletonRow cols={columns.length} />
                <SkeletonRow cols={columns.length} />
                <SkeletonRow cols={columns.length} />
              </>
            ) : !rows?.length ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-10 text-center text-muted"
                >
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr
                  key={r.id || i}
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  {columns.map((c) => (
                    <td key={c.key || c.header} className="px-3 py-2">
                      {c.render ? c.render(r) : r[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer && (
        <div
          className="px-3 py-2 border-t flex justify-between items-center text-xs text-muted"
          style={{ borderColor: "var(--border)" }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
