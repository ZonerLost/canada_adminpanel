import React, { useEffect, useState } from "react";
import Drawer from "./Drawer.jsx";
import {
  publishListing,
  unpublishListing,
  closeListing,
} from "../api/listings.service.js";

export default function ListingDrawer({
  open,
  mode = "create",
  record = null,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(makeInitial(mode, record));
  const isEdit = mode === "edit";

  useEffect(() => {
    setForm(makeInitial(mode, record));
  }, [open, mode, record]);

  function change(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function submit(e) {
    e?.preventDefault?.();
    onSubmit?.(sanitize(form));
  }

  async function doPublish() {
    if (!isEdit || !form?.id) return;
    if (!confirm("Publish this listing (go live)?")) return;
    const res = await publishListing(form.id);
    if (res?.ok) {
      onSubmit?.(res.data);
      onClose?.();
    }
  }

  async function doUnpublish() {
    if (!isEdit || !form?.id) return;
    if (!confirm("Unpublish this listing (save as draft)?")) return;
    const res = await unpublishListing(form.id);
    if (res?.ok) {
      onSubmit?.(res.data);
      onClose?.();
    }
  }

  async function doClose() {
    if (!isEdit || !form?.id) return;
    if (!confirm("Close this listing (no longer accepting applicants)?"))
      return;
    const res = await closeListing(form.id);
    if (res?.ok) {
      onSubmit?.(res.data);
      onClose?.();
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Listing" : "New Listing"}
      wide
    >
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <div className="text-sm text-muted">Title</div>
          <input
            className="input mt-1"
            value={form.title}
            onChange={(e) => change("title", e.target.value)}
            required
          />
        </label>
        <label className="block">
          <div className="text-sm text-muted">Employer</div>
          <input
            className="input mt-1"
            value={form.employer_name}
            onChange={(e) => change("employer_name", e.target.value)}
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <div className="text-sm text-muted">Location</div>
          <input
            className="input mt-1"
            value={form.location}
            onChange={(e) => change("location", e.target.value)}
            required
          />
        </label>

        <label className="block sm:col-span-2">
          <div className="text-sm text-muted">Description</div>
          <textarea
            className="input mt-1"
            rows={4}
            value={form.description}
            onChange={(e) => change("description", e.target.value)}
          />
        </label>

        <label className="block">
          <div className="text-sm text-muted">Openings</div>
          <input
            className="input mt-1"
            type="number"
            min="1"
            value={form.openings}
            onChange={(e) => change("openings", +e.target.value)}
          />
        </label>
        <label className="block">
          <div className="text-sm text-muted">Visibility</div>
          <select
            className="input mt-1"
            value={form.visibility}
            onChange={(e) => change("visibility", e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </label>

        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          {isEdit && (
            <>
              {form?.status === "closed" ? null : (
                <>
                  {form?.status !== "live" ? (
                    <button
                      type="button"
                      className="btn-ghost text-emerald-500"
                      onClick={doPublish}
                    >
                      Publish
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-ghost text-amber-500"
                      onClick={doUnpublish}
                    >
                      Unpublish
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-ghost text-rose-500"
                    onClick={doClose}
                  >
                    Close
                  </button>
                </>
              )}
            </>
          )}
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" type="submit">
            {isEdit ? "Save Changes" : "Create Listing"}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

function makeInitial(mode, record) {
  if (mode === "edit" && record) return { ...record };
  return {
    title: "",
    employer_name: "",
    location: "",
    description: "",
    openings: 1,
    visibility: "public",
  };
}
function sanitize(f) {
  return { ...f };
}
