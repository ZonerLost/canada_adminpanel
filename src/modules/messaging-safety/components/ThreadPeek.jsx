import React, { useEffect, useState, useCallback } from "react";
import Drawer from "./Drawer.jsx";
import { getThread, postAdminNote } from "../api/messaging.service.js";

export default function ThreadPeek({ open, conversationId, onClose }) {
  const [data, setData] = useState(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await getThread(conversationId);
    setData(res.data);
  }, [conversationId]);

  useEffect(() => {
    if (open && conversationId) load();
  }, [open, conversationId, load]);

  async function send() {
    if (!note.trim()) return;
    setBusy(true);
    await postAdminNote(conversationId, note.trim());
    setNote("");
    await load();
    setBusy(false);
  }

  return (
    <Drawer open={open} onClose={onClose} title="Conversation" wide>
      {!data ? (
        <div className="skel h-6 w-40 mb-3" />
      ) : (
        <div className="space-y-3">
          <div
            className="rounded-xl border p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-medium">{data.conversation.subject}</div>
            <div className="text-xs text-muted">
              {data.conversation.a_user} ↔ {data.conversation.b_user}
            </div>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-auto pr-1">
            {data.messages.map((m) => (
              <div
                key={m.id}
                className="border rounded-xl p-2"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="text-xs text-muted flex items-center justify-between">
                  <span>{m.from}</span>
                  <span>{new Date(m.ts).toLocaleString()}</span>
                </div>
                <div className="mt-1 text-sm">{m.text}</div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-[1fr_auto] gap-2">
            <input
              className="input"
              placeholder="Add admin note to thread…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              className="btn"
              onClick={send}
              disabled={busy || !note.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
