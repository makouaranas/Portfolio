"use client";

import { useEffect, useState } from "react";

import { adminApi, type AdminMe } from "../../lib/adminApi";
import ThemeToggle from "../ThemeToggle";

const NAV: { href: string; label: string }[] = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/contacts", label: "Contacts" },
];

interface AdminShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const [admin, setAdmin] = useState<AdminMe | null>(null);
  const [pending, setPending] = useState(true);
  const [path, setPath] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPath(window.location.pathname);
    let cancelled = false;
    (async () => {
      try {
        const me = await adminApi.me();
        if (!cancelled) {
          setAdmin(me);
          setPending(false);
        }
      } catch {
        window.location.replace("/admin");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await adminApi.logout();
    } finally {
      window.location.replace("/admin");
    }
  };

  if (pending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Checking session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky inset-y-0 left-0 z-40 w-64 border-r flex flex-col transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: "var(--bg-soft)", borderColor: "var(--border)" }}
      >
        <div className="px-6 h-16 flex items-center border-b" style={{ borderColor: "var(--border)" }}>
          <a href="/admin/dashboard" className="text-base font-bold tracking-tight">
            <span className="text-yellow-400">{"<"}</span>
            Admin
            <span className="text-yellow-400">{"/>"}</span>
          </a>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = path === item.href || path.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-yellow-400/10 text-yellow-400"
                    : "hover:bg-[var(--card-2)]"
                }`}
                style={!active ? { color: "var(--muted)" } : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <div
          className="p-4 border-t flex items-center justify-between gap-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0">
            <p className="text-xs" style={{ color: "var(--muted-2)" }}>
              Signed in
            </p>
            <p className="text-xs font-medium truncate" title={admin?.email}>
              {admin?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-yellow-400/50 hover:text-yellow-400"
            style={{ borderColor: "var(--border)" }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-20 border-b backdrop-blur-xl flex items-center justify-between gap-4 px-6 h-16"
          style={{
            background: "color-mix(in oklab, var(--bg) 80%, transparent)",
            borderColor: "var(--border)",
          }}
        >
          <button
            type="button"
            className="lg:hidden -ml-2 p-2"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold tracking-tight truncate">{title}</h1>
            {subtitle && (
              <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
                {subtitle}
              </p>
            )}
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 px-6 py-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
