import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  approveUser,
  suspendUser,
} from "../api/people.service.js";
import FilterBar from "../components/FilterBar.jsx";
import UserDrawer from "../components/UserDrawer.jsx";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function UsersListBase({ role = "", title = "Users" }) {
  const [busy, setBusy] = useState(false);
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("create");
  const [editRec, setEditRec] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(
    async (p = page) => {
      setBusy(true);
      try {
        const res = await listUsers({ role, status, q, page: p, pageSize: 10 });
        setRows(res.items);
        setPage(res.page);
        setPages(res.pages);
        setTotal(res.total);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setBusy(false);
      }
    },
    [page, q, status, role]
  );

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, q, status]);

  const subtitle = useMemo(() => `${total.toLocaleString()} users`, [total]);

  async function onCreate(payload) {
    setBusy(true);
    try {
      const res = await createUser(payload);
      setDrawerOpen(false);
      if (page === 1) setRows((r) => [res.data, ...(r || [])].slice(0, 10));
      await load(1);
    } finally {
      setBusy(false);
    }
  }

  async function onEdit(payload) {
    setBusy(true);
    try {
      const res = await updateUser(editRec.id, payload);
      setEditRec(null);
      setRows((r) => r.map((x) => (x.id === res.data.id ? res.data : x)));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    setBusy(true);
    try {
      await deleteUser(id);
      setConfirm(null);
      await load(page);
    } finally {
      setBusy(false);
    }
  }

  async function onAction(id, action) {
    setBusy(true);
    try {
      if (action === "approve") await approveUser(id);
      if (action === "suspend") await suspendUser(id);
      await load(page);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <button
          className="btn"
          onClick={() => {
            setDrawerMode("create");
            setEditRec(null);
            setDrawerOpen(true);
          }}
        >
          New User
        </button>
      </div>

      <FilterBar
        defaultStatus={status}
        onChange={({ q: nq, status: ns }) => {
          setQ(nq);
          setStatus(ns);
        }}
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-full">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2 hidden sm:table-cell">Email</th>
                <th className="px-3 py-2 hidden sm:table-cell">Role</th>
                <th className="px-3 py-2 hidden sm:table-cell">Status</th>
                <th className="px-3 py-2 hidden md:table-cell">Location</th>
                <th className="px-3 py-2 hidden md:table-cell">Last Active</th>
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
                      <div className="font-medium">{r.name}</div>
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell">
                      {r.email}
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell capitalize">
                      {r.role}
                    </td>
                    <td className="px-3 py-2 hidden sm:table-cell capitalize">
                      {r.status}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {r.location || "—"}
                    </td>
                    <td className="px-3 py-2 hidden md:table-cell">
                      {new Date(r.last_active).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1 justify-end flex-wrap">
                        {r.status === "pending" && (
                          <button
                            className="btn-ghost"
                            onClick={() => onAction(r.id, "approve")}
                          >
                            Approve
                          </button>
                        )}
                        {r.status !== "suspended" && (
                          <button
                            className="btn-ghost"
                            onClick={() => onAction(r.id, "suspend")}
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          className="btn-ghost"
                          onClick={() => {
                            setDrawerMode("edit");
                            setEditRec(r);
                            setDrawerOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-ghost"
                          onClick={() => setConfirm({ id: r.id, name: r.name })}
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

      <UserDrawer
        open={drawerOpen}
        mode={drawerMode}
        role={role}
        record={editRec}
        onClose={() => {
          setDrawerOpen(false);
          setEditRec(null);
        }}
        onSubmit={drawerMode === "edit" ? onEdit : onCreate}
      />

      <ConfirmDialog
        open={!!confirm}
        title="Delete user?"
        message={`This will permanently remove "${confirm?.name}".`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => onDelete(confirm.id)}
      />
    </div>
  );
}
