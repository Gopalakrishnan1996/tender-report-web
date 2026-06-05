// Convert a JSON key ("evergabe_online") into a display label ("Evergabe Online").
function toDisplayName(key) {
  return key
    .split("_")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function Sidebar({ items, selected, onSelect, title }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__title">{title}</div>
      <nav>
        {items.map((key) => (
          <button
            key={key}
            className={`sidebar__item${key === selected ? " is-active" : ""}`}
            onClick={() => onSelect(key)}
            title={key}
          >
            {toDisplayName(key)}
          </button>
        ))}
      </nav>
    </aside>
  );
}
