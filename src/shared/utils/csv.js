export function toCSV(rows = [], columns = []) {
  const head = columns
    .map((c) => `"${(c.header || c.key).replace(/"/g, '""')}"`)
    .join(",");
  const body = rows
    .map((r) =>
      columns
        .map((c) => {
          const v = c.key ? r[c.key] : c.render?.(r) ?? "";
          return `"${String(v ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");
  return [head, body].join("\n");
}

export function downloadCSV(filename, rows, columns) {
  const csv = "\uFEFF" + toCSV(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
