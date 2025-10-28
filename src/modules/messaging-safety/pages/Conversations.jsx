import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listConversations } from "../api/messaging.service.js";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ThreadPeek from "../components/ThreadPeek.jsx";

export default function Conversations() {
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [peek, setPeek] = useState(null);

  const load = useCallback(
    async (p = page) => {
      setBusy(true);
      // compute date_from/date_to in epoch ms based on selected range
      let date_from = null;
      let date_to = null;
      const now = Date.now();
      const startOfDay = (d) =>
        new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      if (dateRange === "today") {
        date_from = startOfDay(new Date());
        date_to = now;
      } else if (dateRange === "yesterday") {
        const todayStart = startOfDay(new Date());
        date_from = todayStart - 24 * 60 * 60 * 1000;
        date_to = todayStart - 1;
      } else if (dateRange === "7d") {
        date_from = now - 1000 * 60 * 60 * 24 * 7;
        date_to = now;
      } else if (dateRange === "custom") {
        date_from = customFrom ? new Date(customFrom).getTime() : null;
        date_to = customTo
          ? new Date(customTo).getTime() + 1000 * 60 * 60 * 24 - 1
          : null;
      }
      const res = await listConversations({
        q,
        page: p,
        pageSize: 10,
        date_from,
        date_to,
      });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
      setBusy(false);
    },
    [q, page, dateRange, customFrom, customTo]
  );

  useEffect(() => {
    load(1);
  }, [q, dateRange, customFrom, customTo, load]);

  const subtitle = useMemo(
    () => `${total.toLocaleString()} conversations`,
    [total]
  );

  function formatRelDate(ts) {
    if (!ts) return "—";
    const t = Number(ts);
    const now = Date.now();
    const startOfDay = (d) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const todayStart = startOfDay(new Date());
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 1000 * 60 * 60 * 24 * 7;
    if (t >= todayStart) {
      return `Today, ${new Date(t).toLocaleTimeString()}`;
    }
    if (t >= yesterdayStart && t < todayStart) {
      return `Yesterday, ${new Date(t).toLocaleTimeString()}`;
    }
    if (t >= sevenDaysAgo) {
      return `Last 7 days`;
    }
    return new Date(t).toLocaleDateString();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Conversations</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="input w-64"
            placeholder="Search subject/participants…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="all">All dates</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7d">Last 7 days</option>
            <option value="custom">Custom range</option>
          </select>
          {dateRange === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                className="input"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
              <input
                type="date"
                className="input"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-full">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Subject</th>
                <th className="px-3 py-2 hidden sm:table-cell">User A</th>
                <th className="px-3 py-2 hidden md:table-cell">User B</th>
                <th className="px-3 py-2 hidden sm:table-cell">Unread</th>
                <th className="px-3 py-2 hidden md:table-cell">Updated</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <>
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-muted">
                    No conversations.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2">{r.subject}</td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      {r.a_user}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {r.b_user}
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      {r.unread_for_admin || 0}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {formatRelDate(r.updated_at)}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end flex-wrap">
                        <button
                          className="btn-ghost"
                          onClick={() => setPeek(r.id)}
                        >
                          Open
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

      <ThreadPeek
        open={!!peek}
        conversationId={peek}
        onClose={() => setPeek(null)}
      />
    </div>
  );
}
