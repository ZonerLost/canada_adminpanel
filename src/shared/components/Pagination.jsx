import React from "react";
export default function Pagination({ page, pages, onPage }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        className="btn-ghost"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        Prev
      </button>
      <span className="text-muted">
        Page {page} of {pages}
      </span>
      <button
        className="btn-ghost"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
