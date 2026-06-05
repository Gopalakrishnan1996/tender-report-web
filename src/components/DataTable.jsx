import { columnLabel } from "../i18n.js";

function isUrl(value) {
  return typeof value === "string" && /^https?:\/\//.test(value);
}

export default function DataTable({ rows, columns, t }) {
  if (!rows.length) {
    return <div className="state state--empty">{t.noRecords}</div>;
  }

  return (
    <section className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{columnLabel(t, col)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => {
                const value = row[col];
                return (
                  <td key={col}>
                    {isUrl(value) ? (
                      <a href={value} target="_blank" rel="noreferrer">
                        {value}
                      </a>
                    ) : (
                      String(value ?? "")
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
