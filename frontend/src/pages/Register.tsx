import { type CSSProperties, type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { registerRequest } from '../api/auth.api'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from '../components/ThemeToggle'
import { flattenZodErrors, registerSchema } from '../utils/validation'
import { extractErrorMessage } from '../hooks/useTasks'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = registerSchema.safeParse({ name, email, password })
    if (!result.success) {
      setErrors(flattenZodErrors(result.error))
      return
    }
    setErrors({})
    setLoading(true)
    try {
      const res = await registerRequest(result.data)
      login(res.token, res.user)
      toast.success(`Welcome, ${res.user.name}`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <ThemeToggle />
      </div>
      <div
        className="card"
        style={styles.card}>
        <h1 style={styles.heading}>Create account</h1>
        <p
          style={{
            color: 'var(--text-muted)',
            marginTop: 6,
            marginBottom: 28
          }}>
          A few seconds and you're organized.
        </p>
        <form
          onSubmit={onSubmit}
          noValidate>
          <div style={styles.field}>
            <label
              className="mono"
              style={styles.label}
              htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div style={styles.field}>
            <label
              className="mono"
              style={styles.label}
              htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>
          <div style={styles.field}>
            <label
              className="mono"
              style={styles.label}
              htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                marginTop: 6
              }}>
              8+ characters, upper &amp; lowercase, a number, and a special
              character.
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p style={{ marginTop: 20, fontSize: 14 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'var(--bg)'
  },
  topBar: { position: 'absolute', top: 20, right: 24 },
  card: { width: '100%', maxWidth: 400, padding: '36px 32px' },
  heading: { fontSize: 32 },
  field: { marginBottom: 16 },
  label: {
    display: 'block',
    fontSize: 12,
    marginBottom: 6,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  }
}
