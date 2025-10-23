import React, { useEffect, useState } from "react";

export default function FilterBar({
  defaultStatus = "",
  onChange,
  placeholder = "Search name, email, phone, location…",
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(defaultStatus);

  // debounce search
  useEffect(() => {
    const id = setTimeout(() => onChange({ q, status }), 300);
    return () => clearTimeout(id);
  }, [q, status, onChange]);

  return (
    <div className="card p-3 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <input
        className="input w-full sm:max-w-md"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="flex gap-2">
        <select
          className="input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
        </select>
        {/* reserved for future filters */}
      </div>
    </div>
  );
}
