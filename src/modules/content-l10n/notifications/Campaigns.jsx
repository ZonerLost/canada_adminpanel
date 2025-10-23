import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  cancelCampaign,
  listCampaigns,
  listTemplates,
  sendNow,
  upsertCampaign,
} from "../api/notifications.service.js";
import SkeletonRow from "../components/SkeletonRow.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import CampaignBuilder from "./components/CampaignBuilder.jsx";

export default function Campaigns() {
  const [rows, setRows] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [builder, setBuilder] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await listTemplates({ pageSize: 999 });
      setTemplates(t.items || t.data || []);
    })();
  }, []);

  const load = useCallback(
    async (p = page) => {
      const res = await listCampaigns({ status, q, page: p, pageSize: 10 });
      setRows(res.items);
      setPage(res.page);
      setPages(res.pages);
      setTotal(res.total);
    },
    [page, status, q]
  );

  useEffect(() => {
    load(1);
  }, [q, status, load]);

  const subtitle = useMemo(
    () => `${total.toLocaleString()} campaigns`,
    [total]
  );

  function startNew() {
    setBuilder(null);
    setBuilder({});
  }
  function startEdit(r) {
    setBuilder(r);
  }
  async function save(payload) {
    await upsertCampaign(
      builder?.id ? { ...payload, id: builder.id } : payload
    );
    setBuilder(null);
    await load();
  }
  async function onCancel(id) {
    setBusy(true);
    await cancelCampaign(id);
    setBusy(false);
    await load();
  }
  async function onSendNow(id) {
    setBusy(true);
    await sendNow(id);
    setBusy(false);
    await load();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Campaigns</h1>
          <div className="text-sm text-muted">{subtitle}</div>
        </div>
        <div className="flex gap-2">
          <input
            className="input w-64"
            placeholder="Search name/audience…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="canceled">Canceled</option>
          </select>
          <button className="btn" onClick={startNew}>
            New Campaign
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm min-w-[980px]">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Template</th>
                <th className="px-3 py-2">Audience</th>
                <th className="px-3 py-2">Schedule</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <>
                  <SkeletonRow cols={6} />
                  <SkeletonRow cols={6} />
                </>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-muted">
                    No campaigns.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.template_id}</td>
                    <td className="px-3 py-2">{r.audience}</td>
                    <td className="px-3 py-2">
                      {r.scheduled_at
                        ? new Date(r.scheduled_at).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2 capitalize">{r.status}</td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        {r.status === "draft" && (
                          <button
                            className="btn-ghost"
                            onClick={() => startEdit(r)}
                          >
                            Edit
                          </button>
                        )}
                        {r.status === "scheduled" && (
                          <button
                            className="btn-ghost"
                            disabled={busy}
                            onClick={() => onCancel(r.id)}
                          >
                            Cancel
                          </button>
                        )}
                        {r.status !== "sent" && (
                          <button
                            className="btn-ghost"
                            disabled={busy}
                            onClick={() => onSendNow(r.id)}
                          >
                            Send now
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

      <CampaignBuilder
        open={!!builder}
        record={builder && (builder.id ? builder : null)}
        templates={templates}
        onClose={() => setBuilder(null)}
        onSubmit={save}
      />
    </div>
  );
}
