import React from "react";
import { createPortal } from "react-dom";

export default function ConfirmDialog({
  open,
  title = "Confirm",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return createPortal(
    <>
      <div className="fixed inset-0 z-50 bg-black/40" onClick={onCancel} />
      <div className="fixed inset-0 z-50 grid place-items-center p-4">
        <div className="card p-5 w-full max-w-sm">
          <div className="font-semibold mb-1">{title}</div>
          <div className="text-sm text-muted">{message}</div>
          <div className="mt-4 flex justify-end gap-2">
            <button className="btn-ghost" onClick={onCancel}>
              {cancelLabel}
            </button>
            <button className="btn" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
