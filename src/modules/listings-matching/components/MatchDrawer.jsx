import React from "react";
import Drawer from "./Drawer.jsx";

export default function MatchDrawer({ open, record = null, onClose }) {
  if (!record) return null;
  return (
    <Drawer open={open} onClose={onClose} title="Match Details">
      <div className="space-y-2 text-sm">
        <Row k="Caregiver" v={record.caregiver_name} />
        <Row k="Employer" v={record.employer_name} />
        <Row k="Listing ID" v={record.listing_id} />
        <Row k="Score" v={`${record.score}`} />
        <Row k="Created" v={new Date(record.created_at).toLocaleString()} />
      </div>
      <div className="mt-4 text-xs text-muted">
        This is a read-only peek for admins.
      </div>
    </Drawer>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-muted">{k}</div>
      <div className="font-medium">{v}</div>
    </div>
  );
}
