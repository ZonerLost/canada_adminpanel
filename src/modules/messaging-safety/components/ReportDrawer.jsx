import React, { useCallback, useEffect, useState } from "react";
import Drawer from "./Drawer.jsx";
import {
  actOnReport,
  getReport,
  suspendUser,
} from "../api/messaging.service.js";

export default function ReportDrawer({ open, reportId, onClose, onChanged }) {
  const [rec, setRec] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await getReport(reportId);
    setRec(res.data);
  }, [reportId]);

  useEffect(() => {
    if (open && reportId) load();
  }, [open, reportId, load]);

  async function act(action) {
    setBusy(true);
    await actOnReport(reportId, action, note);
    setBusy(false);
    onChanged?.();
    onClose?.();
  }

  async function suspend() {
    setBusy(true);
    await suspendUser(rec.target_user);
    await act("close");
  }

  if (!rec) return null;

  return (
    <Drawer open={open} onClose={onClose} title="Report details" wide>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="card p-3">
          <Row k="Type" v={rec.type} />
          <Row k="Status" v={rec.status} />
          <Row k="Reported by" v={rec.reported_by} />
          <Row k="Target user" v={rec.target_user} />
          <Row k="Conversation ID" v={rec.conversation_id} />
          <Row k="Created" v={new Date(rec.created_at).toLocaleString()} />
        </div>
        <div className="card p-3">
          <div className="text-sm text-muted mb-1">Reporter note</div>
          <div className="text-sm">{rec.note || "—"}</div>
          <div className="mt-4">
            <div className="text-sm text-muted mb-1">Admin note</div>
            <textarea
              className="input w-full"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 justify-end">
        {rec.status === "open" && (
          <button
            className="btn-ghost"
            onClick={() => act("close")}
            disabled={busy}
          >
            Close
          </button>
        )}
        {rec.status !== "open" && (
          <button
            className="btn-ghost"
            onClick={() => act("reopen")}
            disabled={busy}
          >
            Reopen
          </button>
        )}
        <button className="btn-ghost" onClick={suspend} disabled={busy}>
          Suspend user
        </button>
        <button className="btn" onClick={onClose}>
          Done
        </button>
      </div>
    </Drawer>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="text-sm text-muted">{k}</div>
      <div className="text-sm font-medium">{String(v)}</div>
    </div>
  );
}
