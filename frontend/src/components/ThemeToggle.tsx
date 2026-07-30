import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode">
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}
