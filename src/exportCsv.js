import { columnLabel } from "./i18n.js";

function escapeCell(value) {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function row(cells) {
  return cells.map(escapeCell).join(",");
}

// Build a CSV of the table only (header + data rows) for the current platform,
// with column headers in the selected language.
export function buildCsv({ data, columns, t }) {
  const lines = [];

  lines.push(row(columns.map((c) => columnLabel(t, c))));
  for (const record of data.data || []) {
    lines.push(row(columns.map((c) => record[c])));
  }

  return lines.join("\r\n");
}

export function downloadCsv(filename, csv) {
  // Prepend BOM so Excel reads UTF-8 (umlauts) correctly.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
