import React, { useEffect, useState } from "react";
import Drawer from "./Drawer.jsx";
import { formatMoney, refundSubscription } from "../api/billing.service.js";

export default function RefundDialog({ open, record, onClose, onDone }) {
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (record) setAmount(record.last_charge_amount || 0);
  }, [record]);

  if (!record) return null;
  const max = record.last_charge_amount || 0;

  async function submit() {
    setBusy(true);
    await refundSubscription(record.id, Math.min(amount, max), reason);
    setBusy(false);
    onDone?.();
    onClose?.();
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Refund • ${record.user_name}`}
      wide
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <div className="text-sm text-muted">Amount</div>
          <input
            className="input mt-1"
            type="number"
            min={0}
            max={max}
            step={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value || 0))}
          />
          <div className="text-xs text-muted mt-1">
            Max: {formatMoney(max, record.currency)}
          </div>
        </label>
        <label className="block">
          <div className="text-sm text-muted">Reason</div>
          <input
            className="input mt-1"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Customer request, service issue…"
          />
        </label>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button className="btn-ghost" onClick={onClose}>
          Cancel
        </button>
        <button className="btn" disabled={busy || amount <= 0} onClick={submit}>
          {busy
            ? "Processing…"
            : `Refund ${formatMoney(amount, record.currency)}`}
        </button>
      </div>
    </Drawer>
  );
}
