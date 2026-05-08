"use client";

import { useEffect, useState } from "react";

import ThemeToggle from "../../../components/ThemeToggle";
import { adminApi, type AdminMe } from "../../../lib/adminApi";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<AdminMe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await adminApi.me();
        if (!cancelled) {
          setAdmin(me);
          setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-xl"
        style={{
          background: "color-mix(in oklab, var(--bg) 80%, transparent)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/admin/dashboard" className="text-lg font-bold tracking-tight">
            <span className="text-yellow-400">{"<"}</span>
            Admin
            <span className="text-yellow-400">{"/>"}</span>
          </a>
          <div className="flex items-center gap-3">
            <span
              className="hidden sm:inline text-xs"
              style={{ color: "var(--muted)" }}
            >
              {admin?.email}
            </span>
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-semibold px-4 py-2 rounded-full border transition-colors hover:border-yellow-400/50 hover:text-yellow-400"
              style={{ borderColor: "var(--border)" }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div>
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">
            Dashboard
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tighter">
            Welcome back<span style={{ color: "var(--muted)" }}>.</span>
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
            Signed in as <span className="font-semibold">{admin?.email}</span>.
          </p>
        </div>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Skills", desc: "Edit, add, hide skills shown on the public site." },
            { label: "Projects", desc: "Manage projects, gallery images, and tags." },
            { label: "About / Hero", desc: "Update bio, hero text, and metadata." },
            { label: "Messages", desc: "Read inbound contact form messages." },
            { label: "Contacts", desc: "Manage contact platforms (LinkedIn, Upwork, ...)." },
            { label: "Kanban", desc: "Personal task board: backlog → done." },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-3xl border p-6"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <h3 className="text-base font-semibold tracking-tight">{c.label}</h3>
              <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                {c.desc}
              </p>
              <p
                className="mt-4 text-[10px] uppercase tracking-wider"
                style={{ color: "var(--muted-2)" }}
              >
                Coming next slice
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
