import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  listListings,
  createListing,
  updateListing,
  deleteListing,
  publishListing,
  unpublishListing,
  closeListing,
  boostListing,
  clearBoost,
} from "../api/listings.service.js";
import FilterBar from "../components/FilterBar.jsx";
import ListingDrawer from "../components/ListingDrawer.jsx";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function ListingsList() {
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(
    async (p = page) => {
      setBusy(true);
      const res = await listListings({ status, q, page: p, pageSize: 10 });
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
  }, [load]);

  const subtitle = useMemo(() => `${total.toLocaleString()} listings`, [total]);

  async function onCreate(payload) {
    setBusy(true);
    const res = await createListing(payload);
    setOpen(false);
    if (page === 1) setRows((r) => [res.data, ...(r || [])].slice(0, 10));
    await load();
  }
  async function onEdit(payload) {
    setBusy(true);
    const res = await updateListing(editRec.id, payload);
    setEditRec(null);
    setRows((r) => r.map((x) => (x.id === res.data.id ? res.data : x)));
    setBusy(false);
  }
  async function onDelete(id) {
    setBusy(true);
    await deleteListing(id);
    setConfirm(null);
    await load();
  }
  async function onAction(id, action) {
    setBusy(true);
    if (action === "publish") await publishListing(id);
    if (action === "unpublish") await unpublishListing(id);
    if (action === "close") await closeListing(id);
    if (action === "boost") await onBoost(id);
    if (action === "clear-boost") await clearBoost(id);
    await load();
  }
  async function onBoost(id) {
    const val = prompt("Boost for how many days?", "3");
    if (!val) return;
    const days = Math.max(1, Number(val));
    await boostListing(id, days);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Listings</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <button className="btn" onClick={() => setOpen(true)}>
          New Listing
        </button>
      </div>

      <FilterBar
        defaultStatus=""
        onChange={({ q, status }) => {
          setQ(q);
          setStatus(status);
        }}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-full">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2 hidden sm:table-cell">Employer</th>
                <th className="px-3 py-2 hidden md:table-cell">Location</th>
                <th className="px-3 py-2 hidden sm:table-cell">Status</th>
                <th className="px-3 py-2 hidden sm:table-cell">Boost</th>
                <th className="px-3 py-2 hidden md:table-cell">Created</th>
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
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.title}</div>
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      {r.employer_name}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {r.location}
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell capitalize">
                      {r.status}
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      {r.boosted_until
                        ? `until ${new Date(
                            r.boosted_until
                          ).toLocaleDateString()}`
                        : "—"}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1 justify-end flex-wrap">
                        {r.status !== "live" && (
                          <button
                            className="btn-ghost"
                            onClick={() => onAction(r.id, "publish")}
                          >
                            Publish
                          </button>
                        )}
                        {r.status === "live" && (
                          <button
                            className="btn-ghost"
                            onClick={() => onAction(r.id, "unpublish")}
                          >
                            Unpublish
                          </button>
                        )}
                        {r.status !== "closed" && (
                          <button
                            className="btn-ghost"
                            onClick={() => onAction(r.id, "close")}
                          >
                            Close
                          </button>
                        )}
                        {!r.boosted_until && (
                          <button
                            className="btn-ghost"
                            onClick={() => onAction(r.id, "boost")}
                          >
                            Boost
                          </button>
                        )}
                        {r.boosted_until && (
                          <button
                            className="btn-ghost"
                            onClick={() => onAction(r.id, "clear-boost")}
                          >
                            Clear Boost
                          </button>
                        )}
                        <button
                          className="btn-ghost"
                          onClick={() => setEditRec(r)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-ghost"
                          onClick={() =>
                            setConfirm({ id: r.id, title: r.title })
                          }
                        >
                          Delete
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

      <ListingDrawer
        open={open}
        mode="create"
        onClose={() => setOpen(false)}
        onSubmit={onCreate}
      />
      <ListingDrawer
        open={!!editRec}
        mode="edit"
        record={editRec}
        onClose={() => setEditRec(null)}
        onSubmit={onEdit}
      />
      <ConfirmDialog
        open={!!confirm}
        title="Delete listing?"
        message={`This will permanently remove "${confirm?.title}".`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
