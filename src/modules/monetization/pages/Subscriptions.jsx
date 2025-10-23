import React, { useEffect, useMemo, useState } from "react";
import {
  listSubscriptions,
  listPlans,
  cancelSubscription,
} from "../api/billing.service.js";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import RefundDialog from "../components/RefundDialog.jsx";
import SubscriptionDrawer from "../components/SubscriptionDrawer.jsx";
import { updateSubscription } from "../api/billing.service.js";

export default function Subscriptions() {
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [plans, setPlans] = useState([]);
  const [refundFor, setRefundFor] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [editSub, setEditSub] = useState(null);

  useEffect(() => {
    (async () => {
      const p = await listPlans();
      setPlans(p.data);
    })();
  }, []);

  const load = React.useCallback(
    async (p = page) => {
      setBusy(true);
      const res = await listSubscriptions({ status, q, page: p, pageSize: 10 });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
      setBusy(false);
    },
    [q, status, page]
  );
  useEffect(() => {
    load(1);
  }, [load]);

  const subtitle = useMemo(
    () => `${total.toLocaleString()} subscriptions`,
    [total]
  );

  async function onCancel(id) {
    setBusy(true);
    await cancelSubscription(id);
    setConfirm(null);
    await load();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Subscriptions</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex gap-2">
          <input
            className="input w-64"
            placeholder="Search name or email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past due</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[1060px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Started</th>
                <th className="px-3 py-2">Period End</th>
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
                    No subscriptions.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2">{r.user_name}</td>
                    <td className="px-3 py-2">{r.user_email}</td>
                    <td className="px-3 py-2">{planName(plans, r.plan_id)}</td>
                    <td className="px-3 py-2 capitalize">{r.status}</td>
                    <td className="px-3 py-2">
                      {new Date(r.started_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(r.current_period_end).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          className="btn-ghost"
                          onClick={() => setEditSub(r)}
                        >
                          Edit
                        </button>

                        {r.status !== "canceled" && (
                          <button
                            className="btn-ghost"
                            onClick={() =>
                              setConfirm({ id: r.id, user: r.user_name })
                            }
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          className="btn-ghost"
                          onClick={() => setRefundFor(r)}
                        >
                          Refund
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

      <RefundDialog
        open={!!refundFor}
        record={refundFor}
        onClose={() => setRefundFor(null)}
        onDone={() => load()}
      />

      <ConfirmDialog
        open={!!confirm}
        title="Cancel subscription?"
        message={`This will stop renewals for "${confirm?.user}".`}
        confirmLabel="Cancel"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onCancel(confirm.id)}
      />

      <SubscriptionDrawer
        open={!!editSub}
        record={editSub}
        plans={plans}
        onClose={() => setEditSub(null)}
        onSave={async (payload) => {
          await updateSubscription(payload.id, payload);
          setEditSub(null);
          await load();
        }}
      />
    </div>
  );
}

function planName(plans, id) {
  return plans.find((p) => p.id === id)?.name || id;
}
