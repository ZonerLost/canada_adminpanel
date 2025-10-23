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
  const [peek, setPeek] = useState(null);

  const load = useCallback(
    async (p = page) => {
      setBusy(true);
      const res = await listConversations({ q, page: p, pageSize: 10 });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
      setBusy(false);
    },
    [q, page]
  );

  useEffect(() => {
    load(1);
  }, [q, load]);

  const subtitle = useMemo(
    () => `${total.toLocaleString()} conversations`,
    [total]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Conversations</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <input
          className="input w-64"
          placeholder="Search subject/participants…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[920px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Subject</th>
                <th className="px-3 py-2">User A</th>
                <th className="px-3 py-2">User B</th>
                <th className="px-3 py-2">Unread</th>
                <th className="px-3 py-2">Updated</th>
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
                    <td className="px-3 py-2">{r.a_user}</td>
                    <td className="px-3 py-2">{r.b_user}</td>
                    <td className="px-3 py-2">{r.unread_for_admin || 0}</td>
                    <td className="px-3 py-2">
                      {new Date(r.updated_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end">
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
