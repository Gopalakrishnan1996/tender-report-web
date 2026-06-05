import { LANGUAGES } from "../i18n.js";

export default function LanguageSwitch({ lang, onChange, t }) {
  return (
    <div className="lang" role="group" aria-label={t.language}>
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          className={`lang__btn${l.code === lang ? " is-active" : ""}`}
          onClick={() => onChange(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
