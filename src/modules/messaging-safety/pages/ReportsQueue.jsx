import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listReports } from "../api/messaging.service.js";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ReportDrawer from "../components/ReportDrawer.jsx";

export default function ReportsQueue() {
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(null);

  const load = useCallback(
    async (p = page) => {
      setBusy(true);
      const res = await listReports({ status, q, page: p, pageSize: 10 });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
      setBusy(false);
    },
    [page, status, q]
  );

  useEffect(() => {
    load(1);
  }, [q, status, load]);

  const subtitle = useMemo(() => `${total.toLocaleString()} reports`, [total]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Reports</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex gap-2">
          <input
            className="input w-64"
            placeholder="Search type/user/note…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-full">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2 hidden sm:table-cell">Status</th>
                <th className="px-3 py-2">Reported by</th>
                <th className="px-3 py-2 hidden md:table-cell">Target user</th>
                <th className="px-3 py-2 hidden md:table-cell">Conversation</th>
                <th className="px-3 py-2 hidden sm:table-cell">Created</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <>
                  <SkeletonRow cols={7} />
                  <SkeletonRow cols={7} />
                  <SkeletonRow cols={7} />
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-muted">
                    No reports.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2 capitalize">{r.type}</td>
                    <td className="px-3 py-2 hidden sm:table-cell capitalize">
                      {r.status}
                    </td>
                    <td className="px-3 py-2">{r.reported_by}</td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {r.target_user}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      #{r.conversation_id}
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end flex-wrap">
                        <button
                          className="btn-ghost"
                          onClick={() => setOpen(r.id)}
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          className="px-3 py-2 border-t flex items-center justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="text-xs text-muted">
            Page {page} of {pages}
          </div>
          <div className="flex gap-2">
            <button
              className="btn-ghost text-sm"
              disabled={page <= 1 || busy}
              onClick={() => load(page - 1)}
            >
              Prev
            </button>
            <button
              className="btn-ghost text-sm"
              disabled={page >= pages || busy}
              onClick={() => load(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ReportDrawer
        open={!!open}
        reportId={open}
        onClose={() => setOpen(null)}
        onChanged={() => load()}
      />
    </div>
  );
}
