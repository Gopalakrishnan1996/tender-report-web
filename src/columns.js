// Columns shown in the table per platform (lowercased data field names).
export const PLATFORM_COLUMNS = {
  evergabe_sachsen: ["searchkey", "published", "deadline", "detailurl"],
  evergabe_online: ["searchkey", "published", "deadline", "detailurl"],
  vergabe_niedersachsen: ["searchkey", "published", "deadline", "detailurl"],
  evergabe_nrw: ["searchkey", "published", "deadline", "detailurl"],
  deutsche_evergabe: ["searchkey", "published", "deadline", "detailurl"],

  ausschreibungen_landbw: ["searchkey", "published", "publishuntil", "detailurl"],
  vergabe_rlp: ["searchkey", "published", "publishuntil", "detailurl"],

  simap_ch: ["searchkey", "published", "detailurl"],

  ted_europa: ["searchkey", "published", "pub", "detailurl"],

  vergabe_hessen: ["searchkey", "deadline", "detailurl"],

  vergabemarktplatz_brandenburg: [
    "searchtext",
    "publishingdate",
    "publishuntildate",
    "relevantdate",
    "projecturl",
  ],
};

// Resolve the column list for a platform; fall back to all keys in the data.
export function columnsFor(platformKey, rows) {
  if (PLATFORM_COLUMNS[platformKey]) return PLATFORM_COLUMNS[platformKey];
  return rows && rows[0] ? Object.keys(rows[0]) : [];
}
