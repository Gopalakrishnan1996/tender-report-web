# Tender Search Report — Web App

A React (Vite) viewer for `tender_search_report.json`. No login.

## Layout
- **Header:** "Tender Search Report".
- **Left menu:** one item per top-level JSON key (underscores shown as spaces).
- **Center top panel:** Api url, Method, Sample Payload / Params, Headers / Token,
  Records (deduped) for the selected platform.
- **Center table:** the rows from `{key}.data`.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
```

## Updating the data
The app reads `public/tender_search_report.json`. After regenerating the report
(`python3 ../build_report_xlsx.py`), refresh the copy:

```bash
cp ../tender_search_report.json public/tender_search_report.json
```

## Hosting (GitHub Pages)
- **Live URL:** https://gopalakrishnan1996.github.io/tender-report-web/
- **Host:** GitHub Pages (free), served from the `gh-pages` branch.
- **Repo:** https://github.com/Gopalakrishnan1996/tender-report-web
- **Config:** `vite.config.js` sets `base: "/tender-report-web/"` — this must
  match the repo name, or assets 404 on Pages.

### Publish a new version (manual steps for next time)
From this folder (`poc/tender-report-web`):

```bash
# 1. (only if the data changed) refresh the JSON the app serves
cp ../tender_search_report.json public/tender_search_report.json

# 2. commit your source changes to the main branch
git add -A
git commit -m "Update report"
git push

# 3. build + publish the static site to the gh-pages branch
npm run deploy
```

`npm run deploy` runs `vite build` then pushes `dist/` to the `gh-pages`
branch via the `gh-pages` package. The live site updates ~1–2 minutes later.

> Note: GitHub Pages is **public** — the site and `tender_search_report.json`
> (API URLs, payloads, token-handling notes) are readable by anyone with the URL.
