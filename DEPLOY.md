# Deploying tender-report-web + email backend

The site is a static GitHub Pages app; the **Send Email** button needs the Node
email server, which GitHub Pages can't run. So we host the backend separately
(Render free tier) and point the published frontend at it.

## 1. Get a Gmail App Password (one-time)

The Gmail account rejects plain passwords. Create an App Password:

1. Google Account for `pgopalakrishnan1996@gmail.com` → **Security**.
2. Enable **2-Step Verification**.
3. **Security → App passwords** → app *Mail*, device *Other* ("tender-report").
4. Copy the **16-character** password — used as `SENDER_PASSWORD` below.

## 2. Deploy the email backend to Render

1. Push this repo to GitHub (already at
   `github.com/Gopalakrishnan1996/tender-report-web`).
2. Render.com → **New → Blueprint** → select this repo. It reads `render.yaml`
   and creates the `tender-report-email` web service.
3. In the service **Environment**, set:
   - `SENDER_EMAIL` = `pgopalakrishnan1996@gmail.com`
   - `SENDER_PASSWORD` = the 16-char App Password from step 1
   - `EMAIL_IDS` = `p.gkrish18@gmail.com` (comma-separated for more)
4. Deploy. Copy the public URL, e.g. `https://tender-report-email.onrender.com`.
5. Verify it's up: open `<url>/api/health` → `{"ok":true,...}`.

## 3. Point the frontend at the backend and publish

1. Put the backend URL in `.env.production`:
   ```
   VITE_API_BASE=https://tender-report-email.onrender.com
   ```
2. Publish the site:
   ```
   npm run deploy
   ```
   This builds with that API base and pushes `dist/` to the `gh-pages` branch.
3. Open the published site, select a platform, click **Send Email** — it should
   deliver the per-platform report to `EMAIL_IDS`.

## Local development

- `npm run server` starts the backend on :3001 (reads `.env`).
- `npm run dev` starts Vite on :5173 and proxies `/api` to the backend.
- Or use `../run_all.sh` to run the whole pipeline + both servers.
