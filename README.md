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
