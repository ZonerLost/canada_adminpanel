import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listMatches, unlinkMatch } from "../api/listings.service.js";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import MatchDrawer from "../components/MatchDrawer.jsx";

export default function MatchList() {
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [peek, setPeek] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(
    async (p = page) => {
      setBusy(true);
      const res = await listMatches({ q, page: p, pageSize: 10 });
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
  }, [load]);

  const subtitle = useMemo(() => `${total.toLocaleString()} matches`, [total]);

  async function onDelete(id) {
    setBusy(true);
    await unlinkMatch(id);
    setConfirm(null);
    await load();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Matches</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <input
          className="input w-64"
          placeholder="Search caregiver/employer/listing…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[880px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Caregiver</th>
                <th className="px-3 py-2">Employer</th>
                <th className="px-3 py-2">Listing</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Created</th>
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
                    No records.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2">{r.caregiver_name}</td>
                    <td className="px-3 py-2">{r.employer_name}</td>
                    <td className="px-3 py-2">#{r.listing_id}</td>
                    <td className="px-3 py-2">{r.score}</td>
                    <td className="px-3 py-2">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          className="btn-ghost"
                          onClick={() => setPeek(r)}
                        >
                          View
                        </button>
                        <button
                          className="btn-ghost"
                          onClick={() => setConfirm({ id: r.id })}
                        >
                          Unlink
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

      <MatchDrawer open={!!peek} record={peek} onClose={() => setPeek(null)} />
      <ConfirmDialog
        open={!!confirm}
        title="Unlink match?"
        message="This will remove the match connection."
        confirmLabel="Unlink"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
