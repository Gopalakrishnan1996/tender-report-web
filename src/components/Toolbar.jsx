import { useEffect, useRef, useState } from "react";
import { buildCsv, downloadCsv } from "../exportCsv.js";

export default function Toolbar({ platformKey, data, columns, t, lang }) {
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }
  const timerRef = useRef(null);

  // Show a toast that auto-hides after 3 seconds.
  function showToast(type, msg) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ type, msg });
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  function handleExport() {
    const csv = buildCsv({ data, columns, t });
    downloadCsv(`${platformKey}.csv`, csv);
  }

  async function handleSendEmail() {
    if (sending) return;
    setSending(true);
    try {
      const csv = buildCsv({ data, columns, t });
      // In dev this is "" (Vite proxies /api). In production set VITE_API_BASE
      // to the hosted email-server URL so the deployed site can reach it.
      const apiBase = import.meta.env.VITE_API_BASE || "";
      const res = await fetch(`${apiBase}/api/send-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platformKey,
          filename: `${platformKey}.csv`,
          recordCount: data["records (deduped)"] ?? (data.data || []).length,
          csv,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.ok) {
        throw new Error(result.error || `HTTP ${res.status}`);
      }
      const to = (result.recipients || []).join(", ");
      showToast("success", `${t.emailSent} ${to}`);
    } catch (err) {
      showToast("error", `${t.emailFailed}: ${err.message}`);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="toolbar">
      <button className="btn btn--primary" onClick={handleExport}>
        {t.export}
      </button>
      <button className="btn btn--ghost" onClick={handleSendEmail} disabled={sending}>
        {sending ? t.emailSending : t.sendEmail}
      </button>

      {toast && (
        <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
