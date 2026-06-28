interface ThemeToggleProps {
  darkMode: boolean
  onChange: (checked: boolean) => void
}

export default function ThemeToggle({ darkMode, onChange }: ThemeToggleProps) {
  return (
    <div className="skin">
      <input
        type="checkbox"
        className="checkbox"
        id="checkbox"
        checked={darkMode}
        onChange={event => onChange(event.target.checked)}
      />
      <label htmlFor="checkbox" className="checkbox-label">
        <svg className="sun" width="20px" height="20px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 12L23 12M12 2V1M12 23V22M20 20L19 19M20 4L19 5M4 20L5 19M4 4L5 5M1 12L2 12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className="moon" width="20px" height="20px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
          <path d="M3 11.5066C3 16.7497 7.25034 21 12.4934 21C16.2209 21 19.4466 18.8518 21 15.7259C12.4934 15.7259 8.27411 11.5066 8.27411 3C5.14821 4.55344 3 7.77915 3 11.5066Z" stroke="#f1f5f9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </label>
    </div>
  )
}
