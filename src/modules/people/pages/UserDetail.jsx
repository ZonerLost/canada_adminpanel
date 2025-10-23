import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  approveUser,
  getUserById,
  suspendUser,
  updateUser,
} from "../api/people.service.js";

export default function UserDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [rec, setRec] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getUserById(id);
        setRec(res.data);
      } catch {
        nav(-1);
      }
    })();
  }, [id, nav]);

  if (!rec)
    return (
      <div className="card p-6">
        <div className="skel h-6 w-40 mb-3" />
        <div className="skel h-4 w-full" />
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{rec.name}</h1>
          <div className="text-sm text-muted capitalize">
            {rec.role} • {rec.status}
          </div>
        </div>
        <div className="flex gap-2">
          {rec.status === "pending" && (
            <button
              className="btn-ghost"
              disabled={busy}
              onClick={() => act("approve")}
            >
              Approve
            </button>
          )}
          {rec.status !== "suspended" && (
            <button
              className="btn-ghost"
              disabled={busy}
              onClick={() => act("suspend")}
            >
              Suspend
            </button>
          )}
          <button className="btn" onClick={() => nav(-1)}>
            Back
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="font-semibold mb-2">Contact</div>
          <Info label="Email" value={rec.email} />
          <Info label="Phone" value={rec.phone || "—"} />
          <Info label="Locale" value={(rec.locale || "").toUpperCase()} />
          <Info label="Location" value={rec.location || "—"} />
          <Info label="Tier" value={rec.tier} />
          <Info
            label="Last Active"
            value={new Date(rec.last_active).toLocaleString()}
          />
        </div>

        <div className="card p-4">
          <div className="font-semibold mb-2">Profile</div>
          {rec.role === "caregiver" ? (
            <>
              <Info
                label="Experience"
                value={`${rec.experience_years ?? 0} years`}
              />
              <Info
                label="Languages"
                value={rec.languages?.join(", ") || "—"}
              />
              <Info
                label="Certifications"
                value={rec.certifications?.join(", ") || "—"}
              />
            </>
          ) : (
            <>
              <Info label="Company" value={rec.company || "—"} />
              <Info label="Openings" value={rec.openings ?? 0} />
            </>
          )}
          <Info label="Notes" value={rec.notes || "—"} />
        </div>

        <div className="card p-4">
          <div className="font-semibold mb-2">Admin</div>
          <button
            className="btn-ghost w-full justify-center mb-2"
            onClick={() =>
              quickEdit({ tier: rec.tier === "gold" ? "free" : "gold" })
            }
          >
            Toggle Tier (Now: {rec.tier})
          </button>
          <button
            className="btn-ghost w-full justify-center"
            onClick={() =>
              quickEdit({
                status: rec.status === "approved" ? "suspended" : "approved",
              })
            }
          >
            Toggle Status (Now: {rec.status})
          </button>
        </div>
      </div>
    </div>
  );

  async function act(kind) {
    setBusy(true);
    if (kind === "approve") await approveUser(rec.id);
    if (kind === "suspend") await suspendUser(rec.id);
    const refreshed = await getUserById(rec.id);
    setRec(refreshed.data);
    setBusy(false);
  }
  async function quickEdit(patch) {
    setBusy(true);
    await updateUser(rec.id, patch);
    const refreshed = await getUserById(rec.id);
    setRec(refreshed.data);
    setBusy(false);
  }
}

function Info({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <div className="text-sm text-muted">{label}</div>
      <div className="text-sm text-right">{String(value)}</div>
    </div>
  );
}
