// Minimal email backend for tender-report-web.
//
// Exposes POST /api/send-report which emails the given platform's CSV report
// (as an attachment) to the globally configured recipient list.
//
// Run:  npm run server   (from tender-report-web/)
import http from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import nodemailer from "nodemailer";

// --- Config (loaded from tender-report-web/.env) ----------------------------
// Load .env from the project root (one level up from this server/ folder).
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(join(__dirname, "..", ".env"));
} catch (err) {
  console.warn("Could not load .env:", err.message);
}

// Recipient list — the report for the selected platform is sent to these.
const email_ids = (process.env.EMAIL_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Transport selection:
//   * If RESEND_API_KEY is set, send via the Resend HTTP API. Use this in
//     production (Render's free tier blocks outbound SMTP).
//   * Otherwise fall back to Gmail SMTP (works locally).
const RESEND_API_KEY = process.env.RESEND_API_KEY;
// From address for Resend. "onboarding@resend.dev" works with no domain setup
// (Resend then only delivers to your own account email).
const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

// Sender (Gmail SMTP) credentials — only needed for the local SMTP fallback.
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const SENDER_PASSWORD = process.env.SENDER_PASSWORD;

// Cloud hosts (Render/Railway) inject PORT; fall back to local default.
const PORT = process.env.PORT || process.env.EMAIL_SERVER_PORT || 3001;

const useResend = Boolean(RESEND_API_KEY);

if (email_ids.length === 0 || (!useResend && (!SENDER_EMAIL || !SENDER_PASSWORD))) {
  console.error(
    "Missing email config. Set EMAIL_IDS plus either RESEND_API_KEY (HTTP) " +
      "or SENDER_EMAIL + SENDER_PASSWORD (SMTP) in the environment / .env"
  );
  process.exit(1);
}
// ----------------------------------------------------------------------------

// SMTP fallback transport (Gmail). Only built when Resend is not configured.
// Port 587 (STARTTLS) with generous timeouts for first outbound connection.
const transporter = useResend
  ? null
  : nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: SENDER_EMAIL, pass: SENDER_PASSWORD },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

// Send the report email via whichever transport is configured.
async function sendReportEmail({ subject, text, filename, csv }) {
  // Prepend BOM so Excel reads UTF-8 (umlauts) correctly.
  const body = "﻿" + csv;

  if (useResend) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: email_ids,
        subject,
        text,
        attachments: [
          { filename, content: Buffer.from(body, "utf-8").toString("base64") },
        ],
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || `Resend HTTP ${res.status}`);
    }
    return data.id;
  }

  const info = await transporter.sendMail({
    from: SENDER_EMAIL,
    to: email_ids.join(", "),
    subject,
    text,
    attachments: [{ filename, content: body, contentType: "text/csv; charset=utf-8" }],
  });
  return info.messageId;
}

// --- Per-platform email content ---------------------------------------------
// Friendly display names + source site, keyed by the report's platform key.
const PLATFORMS = {
  vergabemarktplatz_brandenburg: { label: "Vergabemarktplatz Brandenburg", site: "service.brandenburg.de" },
  evergabe_sachsen:              { label: "eVergabe Sachsen",              site: "evergabe.sachsen.de" },
  evergabe_online:               { label: "eVergabe Online",              site: "evergabe-online.de" },
  vergabe_niedersachsen:         { label: "Vergabe Niedersachsen",        site: "vergabe.niedersachsen.de" },
  evergabe_nrw:                  { label: "eVergabe NRW",                 site: "evergabe.nrw.de" },
  vergabe_rlp:                   { label: "Vergabe Rheinland-Pfalz",      site: "vergabe.rlp.de" },
  ausschreibungen_landbw:        { label: "Ausschreibungen Baden-Württemberg", site: "ausschreibungen.landbw.de" },
  deutsche_evergabe:             { label: "Deutsche eVergabe",            site: "deutsche-evergabe.de" },
  simap_ch:                      { label: "simap.ch (Switzerland)",       site: "simap.ch" },
  ted_europa:                    { label: "TED Europa",                   site: "ted.europa.eu" },
  vergabe_hessen:                { label: "Vergabe Hessen",               site: "vergabe.hessen.de" },
};

function platformMeta(key) {
  return PLATFORMS[key] || { label: key || "Tender platform", site: "" };
}

function buildSubject(key, recordCount) {
  const { label } = platformMeta(key);
  const date = new Date().toISOString().slice(0, 10);
  const count = Number.isFinite(recordCount) ? `${recordCount} record(s) — ` : "";
  return `Tender Report — ${label} — ${count}${date}`;
}

function buildMessage(key, recordCount) {
  const { label, site } = platformMeta(key);
  const date = new Date().toLocaleString();
  const countLine = Number.isFinite(recordCount)
    ? `Matching tenders: ${recordCount}`
    : "Matching tenders: see attached report";
  return [
    `Hello,`,
    ``,
    `Please find attached the latest tender search report for ${label}` +
      (site ? ` (${site}).` : "."),
    ``,
    countLine,
    `Generated: ${date}`,
    ``,
    `The attached CSV lists every matching tender for this platform with`,
    `publication dates, deadlines and detail links.`,
    ``,
    `Regards,`,
    `Tender Report Bot`,
  ].join("\n");
}
// ----------------------------------------------------------------------------

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 25 * 1024 * 1024) reject(new Error("Payload too large"));
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") return sendJson(res, 204, {});

  // Health check (used by cloud hosts to confirm the service is up).
  if (req.method === "GET" && (req.url === "/" || req.url === "/api/health")) {
    return sendJson(res, 200, { ok: true, service: "tender-report-email", recipients: email_ids });
  }

  if (req.method === "POST" && req.url === "/api/send-report") {
    try {
      const { platform, csv, filename, recordCount } = JSON.parse(await readBody(req));
      if (!csv) return sendJson(res, 400, { ok: false, error: "Missing csv" });

      const name = platform || "tender";
      const count = Number(recordCount);
      const messageId = await sendReportEmail({
        subject: buildSubject(name, count),
        text: buildMessage(name, count),
        filename: filename || `${name}.csv`,
        csv,
      });

      console.log(`Sent "${name}" report to ${email_ids.join(", ")} (${messageId})`);
      return sendJson(res, 200, { ok: true, recipients: email_ids, messageId });
    } catch (err) {
      console.error("send-report failed:", err.message);
      return sendJson(res, 500, { ok: false, error: err.message });
    }
  }

  sendJson(res, 404, { ok: false, error: "Not found" });
});

server.listen(PORT, () => {
  const via = useResend ? `Resend HTTP API (from ${EMAIL_FROM})` : "Gmail SMTP";
  console.log(`Email server on http://localhost:${PORT} via ${via} -> ${email_ids.join(", ")}`);
});
