// Dashboard view: charts built from the keyword-coverage data in the report.
//   * Records by platform (horizontal bar chart)
//   * Records by search key x platform (heatmap)

export const COVERAGE_KEYS = ["keyword_coverage_matrix", "keyword_coverage_long"];

const PLATFORM_LABEL = {
  vergabemarktplatz_brandenburg: "Brandenburg",
  evergabe_sachsen: "Sachsen",
  evergabe_online: "eVergabe Online",
  vergabe_niedersachsen: "Niedersachsen",
  evergabe_nrw: "NRW",
  vergabe_rlp: "Rheinland-Pfalz",
  ausschreibungen_landbw: "Baden-Württemberg",
  deutsche_evergabe: "Deutsche eVergabe",
  simap_ch: "simap.ch",
  ted_europa: "TED Europa",
  vergabe_hessen: "Hessen",
};
const PLATFORM_SHORT = {
  vergabemarktplatz_brandenburg: "BB",
  evergabe_sachsen: "SN",
  evergabe_online: "EO",
  vergabe_niedersachsen: "NI",
  evergabe_nrw: "NRW",
  vergabe_rlp: "RLP",
  ausschreibungen_landbw: "BW",
  deutsche_evergabe: "DEvg",
  simap_ch: "SIMAP",
  ted_europa: "TED",
  vergabe_hessen: "HE",
};

function Card({ label, value }) {
  return (
    <div className="dash__card">
      <div className="dash__card-value">{value}</div>
      <div className="dash__card-label">{label}</div>
    </div>
  );
}

export default function Dashboard({ report, t }) {
  const platforms = Object.keys(report).filter((k) => !COVERAGE_KEYS.includes(k));

  // Records per platform.
  const totals = platforms.map((p) => ({
    key: p,
    label: PLATFORM_LABEL[p] || p,
    count: Number(report[p]["records (deduped)"]) || 0,
  }));
  const maxTotal = Math.max(1, ...totals.map((d) => d.count));
  const grandTotal = totals.reduce((s, d) => s + d.count, 0);
  const sortedTotals = [...totals].sort((a, b) => b.count - a.count);

  // Coverage matrix (drop the TOTAL row).
  const matrix = (report.keyword_coverage_matrix?.data || []).filter(
    (r) => r["search key"] !== "TOTAL (17 keys)"
  );
  const keysWithData = matrix.filter((r) => Number(r.total) > 0).length;
  const maxCell = Math.max(
    1,
    ...matrix.flatMap((r) => platforms.map((p) => Number(r[p]) || 0))
  );

  return (
    <div className="dash">
      <div className="dash__cards">
        <Card label={t.platforms} value={platforms.length} />
        <Card label={t.totalRecords} value={grandTotal.toLocaleString()} />
        <Card label={t.searchKeysLabel} value={matrix.length} />
        <Card label={t.keysWithData} value={`${keysWithData}/${matrix.length}`} />
      </div>

      {/* Records by platform — bar chart */}
      <section className="dash__panel">
        <h2 className="dash__title">{t.recordsByPlatform}</h2>
        <div className="bars">
          {sortedTotals.map((d) => (
            <div className="bar-row" key={d.key}>
              <span className="bar-row__label" title={d.label}>{d.label}</span>
              <div className="bar-row__track">
                <div
                  className={`bar-row__fill${d.count === 0 ? " is-zero" : ""}`}
                  style={{ width: `${d.count ? Math.max(3, (d.count / maxTotal) * 100) : 0}%` }}
                />
              </div>
              <span className="bar-row__value">{d.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Records by search key x platform — heatmap */}
      <section className="dash__panel">
        <h2 className="dash__title">{t.recordsByKey}</h2>
        <div className="heatmap-wrap">
          <table className="heatmap">
            <thead>
              <tr>
                <th className="heatmap__corner">{t.searchKeyCol}</th>
                {platforms.map((p) => (
                  <th key={p} title={PLATFORM_LABEL[p] || p}>{PLATFORM_SHORT[p] || p}</th>
                ))}
                <th>Σ</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((r) => (
                <tr key={r["search key"]}>
                  <td className="heatmap__key">{r["search key"]}</td>
                  {platforms.map((p) => {
                    const v = Number(r[p]) || 0;
                    const intensity = v
                      ? 0.15 + 0.85 * (Math.log(v + 1) / Math.log(maxCell + 1))
                      : 0;
                    return (
                      <td
                        key={p}
                        className="heatmap__cell"
                        title={`${PLATFORM_LABEL[p] || p} · ${r["search key"]}: ${v}`}
                        style={{
                          background: v ? `rgba(30,158,87,${intensity.toFixed(3)})` : "#f3f6f9",
                          color: intensity > 0.55 ? "#fff" : "#1a2b3c",
                        }}
                      >
                        {v || ""}
                      </td>
                    );
                  })}
                  <td className="heatmap__total">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="heatmap__legend">
          {platforms
            .map((p) => `${PLATFORM_SHORT[p] || p} = ${PLATFORM_LABEL[p] || p}`)
            .join("   ·   ")}
        </div>
      </section>
    </div>
  );
}
