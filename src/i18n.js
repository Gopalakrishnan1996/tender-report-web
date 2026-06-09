export const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
];

export const translations = {
  en: {
    appTitle: "Tender Search Report",
    platforms: "Platforms",
    loading: "Loading report…",
    loadError: "Failed to load report",
    noRecords: "No records for this platform.",
    export: "Export",
    sendEmail: "Send Email",
    emailSending: "Sending…",
    emailSent: "Report emailed to",
    emailFailed: "Failed to send email",
    language: "Language",
    // Top info-panel field labels (keyed by raw JSON field).
    info: {
      "api url": "Api url",
      method: "Method",
      "sample payload / params": "Sample Payload / Params",
      "headers / token": "Headers / Token",
      "records (deduped)": "Records (deduped)",
    },
    // Table column headers (keyed by lowercased data field).
    columns: {
      searchkey: "Search Key",
      searchtext: "Search Text",
      published: "Published",
      publishingdate: "Published",
      deadline: "Deadline",
      publishuntil: "Publish Until",
      publishuntildate: "Publish Until",
      relevantdate: "Relevant Date",
      pub: "Publication No.",
      detailurl: "Detail URL",
      projecturl: "Project URL",
    },
  },
  de: {
    appTitle: "Ausschreibungs-Suchbericht",
    platforms: "Plattformen",
    loading: "Bericht wird geladen…",
    loadError: "Bericht konnte nicht geladen werden",
    noRecords: "Keine Einträge für diese Plattform.",
    export: "Exportieren",
    sendEmail: "E-Mail senden",
    emailSending: "Wird gesendet…",
    emailSent: "Bericht gesendet an",
    emailFailed: "E-Mail konnte nicht gesendet werden",
    language: "Sprache",
    info: {
      "api url": "API-URL",
      method: "Methode",
      "sample payload / params": "Beispiel-Payload / Parameter",
      "headers / token": "Header / Token",
      "records (deduped)": "Einträge (bereinigt)",
    },
    columns: {
      searchkey: "Suchbegriff",
      searchtext: "Suchbegriff",
      published: "Veröffentlicht",
      publishingdate: "Veröffentlicht",
      deadline: "Frist",
      publishuntil: "Veröffentlicht bis",
      publishuntildate: "Veröffentlicht bis",
      relevantdate: "Relevanzdatum",
      pub: "Veröffentlichungsnr.",
      detailurl: "Detail-URL",
      projecturl: "Projekt-URL",
    },
  },
};

// Field label for the top info panel.
export function infoLabel(t, field) {
  return t.info[field] ?? field;
}

// Column header label; falls back to a capitalized key if untranslated.
export function columnLabel(t, key) {
  return t.columns[key] ?? (key ? key[0].toUpperCase() + key.slice(1) : key);
}
