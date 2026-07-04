import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const { token, user } = await api.login(form.username, form.password);
      auth.setSession(token, user);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (err) {
      setErrorMsg(
        err?.response?.status === 401
          ? "Wrong username or password."
          : "Could not reach the server. Try again."
      );
      setStatus("error");
    }
  };

  return (
    <div
      className="min-h-[100dvh] relative flex items-center justify-center px-4 bg-[var(--paper)] grain-soft overflow-hidden"
      style={{ cursor: "auto" }}
    >
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      <div className="relative w-full max-w-[420px] z-[2]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--muted)] hover:text-[var(--ink)] transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to the site
        </Link>

        <div className="bg-[#fbfaf6] border border-[var(--line-2)] rounded-[18px] p-8 sm:p-10 shadow-[0_18px_60px_rgba(0,0,0,0.10)]">
          <div className="mb-8">
            <div className="w-9 h-9 rounded-full bg-[var(--ink)] flex items-center justify-center mb-5">
              <span
                className="font-display italic text-[var(--paper)] text-[16px] leading-none mt-[1px]"
                style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}
              >
                g
              </span>
            </div>
            <p className="eyebrow">GoG · OS</p>
            <h1 className="headline mt-2" style={{ fontSize: 38 }}>
              The <em>studio door.</em>
            </h1>
            <p className="text-[var(--muted)] text-sm mt-3">
              The dashboard is for the four of us. Sign in to continue.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4" data-testid="login-form">
            <div className="grid gap-1.5">
              <label htmlFor="login-username" className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">
                Username
              </label>
              <input
                id="login-username"
                data-testid="login-username"
                className="dash-input"
                required
                autoFocus
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="login-password" className="font-mono text-[10px] uppercase text-[var(--muted)] tracking-widest">
                Password
              </label>
              <input
                id="login-password"
                data-testid="login-password"
                className="dash-input"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>

            {status === "error" && (
              <p className="text-[13.5px] font-medium text-[#a03d2a]" role="alert">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              data-testid="login-submit"
              className="dash-btn w-full flex items-center justify-center gap-2 !py-3"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center font-mono text-[10px] tracking-[0.25em] uppercase text-[var(--muted)]">
          Private — team access only
        </p>
      </div>
    </div>
  );
}
