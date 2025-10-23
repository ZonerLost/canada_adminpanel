import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listLogs } from "../api/notifications.service.js";
import SkeletonRow from "../components/SkeletonRow.jsx";

export default function Logs() {
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [channel, setChannel] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(
    async (p = page) => {
      const res = await listLogs({ channel, status, q, page: p, pageSize: 12 });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
    },
    [channel, status, q, page]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  const subtitle = useMemo(() => `${total.toLocaleString()} events`, [total]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Notification Logs</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex gap-2">
          <input
            className="input w-64"
            placeholder="Search template/to…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option value="">All channels</option>
            <option value="email">Email</option>
            <option value="push">Push</option>
            <option value="sms">SMS</option>
            <option value="inapp">In-app</option>
          </select>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Any</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[980px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Template</th>
                <th className="px-3 py-2">Channel</th>
                <th className="px-3 py-2">To</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <>
                  <SkeletonRow cols={5} />
                  <SkeletonRow cols={5} />
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-muted">
                    No logs.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2">
                      {new Date(r.ts).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{r.template_key}</td>
                    <td className="px-3 py-2 capitalize">{r.channel}</td>
                    <td className="px-3 py-2">{r.to}</td>
                    <td className="px-3 py-2 capitalize">{r.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className="px-3 py-2 border-t text-xs text-muted flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            Page {page} of {pages}
          </div>
          <div className="flex gap-2">
            <button
              className="btn-ghost text-sm"
              disabled={page <= 1}
              onClick={() => load(page - 1)}
            >
              Prev
            </button>
            <button
              className="btn-ghost text-sm"
              disabled={page >= pages}
              onClick={() => load(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
