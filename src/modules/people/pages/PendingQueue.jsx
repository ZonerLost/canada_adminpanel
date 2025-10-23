import React from "react";
import UsersListBase from "./_UsersListBase.jsx";
export default function PendingQueue() {
  // We reuse base and let the filter bar control status; to emphasize pending, you can default status in FilterBar if desired.
  return <UsersListBase role={""} title="Pending Approval" />;
}
