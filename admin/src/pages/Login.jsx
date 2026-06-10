import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import logo from "../assets/images/web_logo.png";

export default function Login() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { token, login } = useAuth();

  const [form, setForm]           = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]         = useState(
    location.state?.deactivated
      ? "Your account has been deactivated. Please contact the administrator."
      : "",
  );
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (token) return <Navigate to={redirectTo} replace />;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg-deep)] px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md">

        {/* Card */}
        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center gap-6 rounded-2xl border border-[var(--admin-border-amber)] bg-[var(--admin-card)] px-6 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] sm:px-10 sm:py-10"
        >
          {/* Logo + brand */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#496348] via-[#5a7a5a] to-[#C7A66B] shadow-[0_8px_24px_rgba(73,99,72,0.45)] sm:h-24 sm:w-24">
              <img src={logo} alt="Swift Sign" className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--admin-muted)]">Admin Panel</p>
              <h1 className="mt-0.5 text-2xl font-bold text-white sm:text-3xl">Swift Sign</h1>
            </div>
          </div>

          {/* Divider */}
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-[var(--admin-border)]" />
            <span className="text-xs text-[var(--admin-muted)]">Sign in to continue</span>
            <div className="h-px flex-1 bg-[var(--admin-border)]" />
          </div>

          {/* Fields */}
          <div className="flex w-full flex-col gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--admin-muted)]">
                Email or Username
              </label>
              <input
                type="text"
                name="email"
                placeholder="admin@example.com"
                required
                autoComplete="username"
                value={form.email}
                onChange={onChange}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[var(--admin-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--admin-muted)]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={onChange}
                  className="w-full rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-white/30 transition-colors focus:border-[var(--admin-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} text-sm`} />
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex w-full items-start gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3.5 py-3">
              <span className="pi pi-exclamation-triangle mt-0.5 flex-shrink-0 text-sm text-red-400" />
              <p className="text-sm leading-snug text-red-200">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[var(--admin-primary)] py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(73,99,72,0.4)] transition-all duration-200 hover:bg-[var(--admin-primary-strong)] hover:shadow-[0_6px_20px_rgba(73,99,72,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="pi pi-spin pi-spinner text-sm" />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-[var(--admin-muted)]">
          Swift Sign Food &mdash; Secure Admin Access
        </p>
      </div>
    </div>
  );
}
