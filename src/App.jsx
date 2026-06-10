import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import DataTable from "./components/DataTable.jsx";
import Toolbar from "./components/Toolbar.jsx";
import LanguageSwitch from "./components/LanguageSwitch.jsx";
import Dashboard, { COVERAGE_KEYS } from "./components/Dashboard.jsx";
import { translations } from "./i18n.js";
import { columnsFor } from "./columns.js";

export default function App() {
  const [report, setReport] = useState(null);
  const [selected, setSelected] = useState("dashboard");
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en");

  const t = translations[lang];

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}tender_search_report.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setReport(data))
      .catch((err) => setError(err.message));
  }, []);

  // Platform list excludes the coverage datasets — those power the dashboard.
  const keys = useMemo(
    () => (report ? Object.keys(report).filter((k) => !COVERAGE_KEYS.includes(k)) : []),
    [report]
  );
  const isDashboard = selected === "dashboard";
  const current = report && !isDashboard ? report[selected] : null;
  const columns = current ? columnsFor(selected, current.data) : [];

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-header__dot" />
        <h1>{t.appTitle}</h1>
        <LanguageSwitch lang={lang} onChange={setLang} t={t} />
      </header>

      <div className="app-body">
        <Sidebar
          items={keys}
          selected={selected}
          onSelect={setSelected}
          title={t.platforms}
          dashboardLabel={t.dashboard}
        />

        <main className="content">
          {error && (
            <div className="state state--error">
              {t.loadError}: {error}
            </div>
          )}
          {!error && !report && <div className="state">{t.loading}</div>}
          {report && isDashboard && <Dashboard report={report} t={t} />}
          {current && (
            <>
              <Toolbar platformKey={selected} data={current} columns={columns} t={t} />
              <DataTable rows={current.data || []} columns={columns} t={t} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
