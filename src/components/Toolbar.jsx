import { buildCsv, downloadCsv } from "../exportCsv.js";

export default function Toolbar({ platformKey, data, columns, t, lang }) {
  function handleExport() {
    const csv = buildCsv({ data, columns, t });
    downloadCsv(`${platformKey}.csv`, csv);
  }

  return (
    <div className="toolbar">
      <button className="btn btn--primary" onClick={handleExport}>
        {t.export}
      </button>
      <button className="btn btn--ghost" onClick={() => {}}>
        {t.sendEmail}
      </button>
    </div>
  );
}
