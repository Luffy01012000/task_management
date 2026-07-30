import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <header style={styles.header}>
      <h1 style={styles.logo}>Taskflow</h1>
      <div style={styles.right}>
        <span
          className="mono"
          style={styles.user}>
          {user?.name}
        </span>
        <ThemeToggle />
        <button
          className="btn btn-secondary"
          onClick={logout}>
          Log out
        </button>
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 28px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10
  },
  logo: { fontSize: 22 },
  right: { display: 'flex', alignItems: 'center', gap: 14 },
  user: { fontSize: 13, color: 'var(--text-muted)' }
}
