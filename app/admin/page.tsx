"use client";

import { useEffect, useState } from "react";

import { adminApi, type LoginChallenge, type TotpSetup } from "../../lib/adminApi";
import ThemeToggle from "../../components/ThemeToggle";

type Stage =
  | { kind: "loading-session" }
  | { kind: "credentials" }
  | { kind: "setup-2fa"; challengeToken: string; setup: TotpSetup }
  | { kind: "verify-2fa"; challengeToken: string }
  | { kind: "redirecting" };

const inputCls =
  "w-full px-4 py-3 rounded-xl border bg-transparent text-sm transition-colors focus:outline-none focus:border-yellow-400/60";

export default function AdminLoginPage() {
  const [stage, setStage] = useState<Stage>({ kind: "loading-session" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await adminApi.me();
        if (!cancelled) {
          setStage({ kind: "redirecting" });
          window.location.replace("/admin/dashboard");
        }
      } catch {
        if (!cancelled) setStage({ kind: "credentials" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const challenge: LoginChallenge = await adminApi.login(email, password);
      if (challenge.step === "setup_2fa") {
        const setup = await adminApi.setup2fa(challenge.challenge_token);
        setStage({ kind: "setup-2fa", challengeToken: challenge.challenge_token, setup });
      } else {
        setStage({ kind: "verify-2fa", challengeToken: challenge.challenge_token });
      }
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const challengeToken =
        stage.kind === "verify-2fa" || stage.kind === "setup-2fa"
          ? stage.challengeToken
          : "";
      await adminApi.verify2fa(challengeToken, code.trim());
      setStage({ kind: "redirecting" });
      window.location.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div
        className="relative z-10 w-full max-w-md rounded-3xl border p-8 backdrop-blur-md animate-modal-pop"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            Admin
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-medium tracking-tight">
            <span className="text-yellow-400">{"<"}</span>
            MAKOUAR Anas
            <span className="text-yellow-400">{"/>"}</span>
          </h1>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            Restricted area. All access is logged.
          </p>
        </div>

        {stage.kind === "loading-session" && (
          <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
            Checking session...
          </p>
        )}

        {stage.kind === "redirecting" && (
          <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
            Redirecting to dashboard...
          </p>
        )}

        {stage.kind === "credentials" && (
          <form onSubmit={handleCredentials} className="space-y-4">
            <div>
              <label
                className="text-xs uppercase tracking-wider"
                style={{ color: "var(--muted-2)" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                style={{ borderColor: "var(--border)", color: "var(--fg)" }}
              />
            </div>
            <div>
              <label
                className="text-xs uppercase tracking-wider"
                style={{ color: "var(--muted-2)" }}
              >
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                style={{ borderColor: "var(--border)", color: "var(--fg)" }}
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 glow-yellow"
            >
              {busy ? "Signing in..." : "Continue"}
            </button>
          </form>
        )}

        {stage.kind === "setup-2fa" && (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Scan this QR with Google Authenticator (or any TOTP app), then enter
                the 6-digit code below to enroll 2FA.
              </p>
            </div>
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stage.setup.qr_code_data_url}
                alt="2FA QR code"
                className="rounded-2xl border p-2"
                style={{ borderColor: "var(--border)", background: "white" }}
                width={220}
                height={220}
              />
            </div>
            <details
              className="rounded-xl border p-3 text-xs"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              <summary className="cursor-pointer">Can&apos;t scan? Show secret</summary>
              <p className="mt-2 break-all font-mono">{stage.setup.secret}</p>
            </details>
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label
                  className="text-xs uppercase tracking-wider"
                  style={{ color: "var(--muted-2)" }}
                >
                  6-digit code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className={`${inputCls} font-mono tracking-[0.4em] text-center text-lg`}
                  style={{ borderColor: "var(--border)", color: "var(--fg)" }}
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 glow-yellow"
              >
                {busy ? "Verifying..." : "Confirm & Sign in"}
              </button>
            </form>
          </div>
        )}

        {stage.kind === "verify-2fa" && (
          <form onSubmit={handleVerify} className="space-y-4">
            <p className="text-sm text-center" style={{ color: "var(--muted)" }}>
              Enter the 6-digit code from your authenticator app.
            </p>
            <div>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className={`${inputCls} font-mono tracking-[0.4em] text-center text-lg`}
                style={{ borderColor: "var(--border)", color: "var(--fg)" }}
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 glow-yellow"
            >
              {busy ? "Verifying..." : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStage({ kind: "credentials" });
                setError(null);
                setCode("");
              }}
              className="w-full text-xs"
              style={{ color: "var(--muted)" }}
            >
              Back to email & password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
