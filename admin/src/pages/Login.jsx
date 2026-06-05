import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import logo from "../assets/images/web_logo.png";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

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
    <div className="flex min-h-screen items-center justify-center bg-[var(--admin-bg-deep)] px-4 py-6">
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-[var(--admin-border-amber)] bg-[var(--admin-card)] px-6 py-8 shadow-[0_14px_40px_rgba(0,0,0,0.35)] sm:max-w-md sm:px-10 sm:py-10"
      >
        <img src={logo} alt="Swift Sign" className="h-16 w-auto sm:h-20" />

        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Admin Login
        </h1>

        <div className="flex w-full flex-col gap-4 sm:gap-5">
          <input
            type="text"
            name="email"
            placeholder="ID or Email"
            required
            value={form.email}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-100 bg-transparent p-2.5 text-white placeholder:text-gray-300 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 bg-transparent p-2.5 text-white placeholder:text-gray-300 focus:outline-none"
          />
        </div>

        {error ? (
          <p className="w-full rounded-lg border border-red-300/50 bg-red-500/15 px-3 py-2 text-center text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-[var(--admin-primary)] px-10 py-3 text-base font-semibold text-black transition-transform duration-200 hover:scale-105 hover:bg-[var(--admin-primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
