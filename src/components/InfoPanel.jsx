import { infoLabel } from "../i18n.js";

// Info-panel fields in display order (keyed by raw JSON field).
const FIELDS = [
  "api url",
  "method",
  "sample payload / params",
  "headers / token",
  "records (deduped)",
];

export default function InfoPanel({ data, t }) {
  return (
    <section className="info">
      <dl className="info__grid">
        {FIELDS.map((field) => (
          <div className="info__row" key={field}>
            <dt className="info__label">{infoLabel(t, field)}</dt>
            <dd className="info__value">{String(data[field] ?? "")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
