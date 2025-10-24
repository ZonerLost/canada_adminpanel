import React from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  function submit(e) {
    e.preventDefault();
    navigate("/");
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-hero-gradient">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Illustration / brand panel */}
        <div
          className="hidden md:flex flex-col justify-center gap-4 p-8 rounded-xl login-illustration"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,165,233,0.06), rgba(99,102,241,0.03))",
            border: "1px solid var(--border)",
          }}
        >
          <div className="text-3xl font-semibold">CuidadoLatino</div>
          <p className="text-sm text-muted max-w-md">
            Admin portal — secure access to the platform. Manage content,
            campaigns, users and settings from a single dashboard.
          </p>
          <div className="mt-6">{/* Small illustrative SVG */}</div>
        </div>

        {/* Login card */}
        <div className="flex items-center justify-center">
          <form
            onSubmit={submit}
            className="w-full max-w-md card p-6 login-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-semibold">Welcome back</div>
                <div className="text-xs text-muted">
                  Sign in to continue to CuidadoLatino
                </div>
              </div>
              <div className="text-sm text-muted">
                Need an account?{" "}
                <button
                  type="button"
                  className="text-primary font-medium"
                  onClick={() => alert("Signup flow not implemented")}
                >
                  Sign up
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-muted">Email</label>
              <input
                className="input"
                placeholder="you@company.com"
                type="email"
                required
              />

              <label className="text-xs text-muted">Password</label>
              <input
                className="input"
                placeholder="••••••••"
                type="password"
                required
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="h-4 w-4" />
                  <span className="text-sm text-muted">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-muted"
                  onClick={() => alert("Password reset not implemented")}
                >
                  Forgot?
                </button>
              </div>

              <button className="btn w-full mt-2" type="submit">
                Sign in
              </button>

              <div className="flex items-center gap-3 my-2">
                <div
                  className="flex-1 h-px"
                  style={{ background: "var(--border)" }}
                />
              </div>

              <div className="flex gap-2"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
