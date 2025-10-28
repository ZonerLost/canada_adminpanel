import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearBoost,
  extendBoost,
  listBoosts,
  formatMoney,
} from "../api/billing.service.js";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Boosts() {
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(
    async (p = page) => {
      setBusy(true);
      const res = await listBoosts({ q, page: p, pageSize: 10 });
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

  const subtitle = useMemo(() => `${total.toLocaleString()} boosts`, [total]);

  async function onExtend(id) {
    const val = prompt("Extend days:", "3");
    if (!val) return;
    setBusy(true);
    await extendBoost(id, Number(val));
    await load();
  }
  async function onEnd(id) {
    setBusy(true);
    await clearBoost(id);
    setConfirm(null);
    await load();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Boosts</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <input
          className="input w-64"
          placeholder="Search listing/employer/id…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[980px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Listing</th>
                <th className="px-3 py-2">Employer</th>
                <th className="px-3 py-2">Started</th>
                <th className="px-3 py-2">Ends</th>
                <th className="px-3 py-2">Days</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <>
                  <SkeletonRow cols={8} />
                  <SkeletonRow cols={8} />
                  <SkeletonRow cols={8} />
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-muted">
                    No boosts.
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
                      <div className="font-medium">{r.listing_title}</div>
                      <div className="text-xs text-muted">#{r.listing_id}</div>
                    </td>
                    <td className="px-3 py-2">{r.employer}</td>
                    <td className="px-3 py-2">
                      {new Date(r.started_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(r.ends_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{r.days_purchased}</td>
                    <td className="px-3 py-2">
                      {formatMoney(r.amount, r.currency)}
                    </td>
                    <td className="px-3 py-2 capitalize">{r.status}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          className="btn-ghost"
                          onClick={() => onExtend(r.id)}
                        >
                          Extend
                        </button>
                        {r.status !== "ended" && (
                          <button
                            className="btn-ghost"
                            onClick={() =>
                              setConfirm({ id: r.id, title: r.listing_title })
                            }
                          >
                            End
                          </button>
                        )}
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

      <ConfirmDialog
        open={!!confirm}
        title="End boost?"
        message={`This will end boost for "${confirm?.title}".`}
        confirmLabel="End"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onEnd(confirm.id)}
      />
    </div>
  );
}
