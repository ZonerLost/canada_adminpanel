export const fmtDateTime = (ts) =>
  new Date(ts).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
