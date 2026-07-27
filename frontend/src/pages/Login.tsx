import { type CSSProperties, type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginRequest } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "../components/ThemeToggle";
import { flattenZodErrors, loginSchema } from "../utils/validation";
import { extractErrorMessage } from "../hooks/useTasks";

export default function Login() {
  const [email, setEmail] = useState("demo@taskmanager.com");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setErrors(flattenZodErrors(result.error));
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await loginRequest(result.data);
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name}`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <ThemeToggle />
      </div>
      <div className="card" style={styles.card}>
        <h1 style={styles.heading}>Taskflow</h1>
        <p
          style={{ color: "var(--text-muted)", marginTop: 6, marginBottom: 28 }}
        >
          Sign in to see what needs doing today.
        </p>
        <form onSubmit={onSubmit} noValidate>
          <div style={styles.field}>
            <label className="mono" style={styles.label} htmlFor="email">
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
            <label className="mono" style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p style={{ marginTop: 20, fontSize: 14, color: "var(--text-muted)" }}>
          Demo account: demo@taskmanager.com / Demo@1234
        </p>
        <p style={{ marginTop: 8, fontSize: 14 }}>
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: "var(--bg)",
  },
  topBar: { position: "absolute", top: 20, right: 24 },
  card: { width: "100%", maxWidth: 400, padding: "36px 32px" },
  heading: { fontSize: 32 },
  field: { marginBottom: 16 },
  label: {
    display: "block",
    fontSize: 12,
    marginBottom: 6,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
};
