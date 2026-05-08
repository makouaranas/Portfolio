"use client";

import { useEffect, useState } from "react";

import AdminShell from "../../../components/admin/AdminShell";
import { adminApi, type AdminStats } from "../../../lib/adminApi";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminApi
      .stats()
      .then((s) => !cancelled && setStats(s))
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load"));
    return () => {
      cancelled = true;
    };
  }, []);

  const cards: { label: string; value: string | number; href: string; sub?: string }[] = [
    { label: "Skills", value: stats?.skills ?? "—", href: "/admin/skills" },
    { label: "Projects", value: stats?.projects ?? "—", href: "/admin/projects" },
    {
      label: "Messages",
      value: stats?.messages_total ?? "—",
      href: "/admin/messages",
      sub:
        stats && stats.messages_unread > 0
          ? `${stats.messages_unread} unread`
          : undefined,
    },
    { label: "Contact platforms", value: stats?.contacts ?? "—", href: "/admin/contacts" },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Overview of your portfolio content">
      {error && <p className="text-sm text-red-400 mb-6">{error}</p>}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="rounded-3xl border p-5 transition-colors hover:border-yellow-400/50"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-medium tracking-tighter text-yellow-400">{c.value}</p>
            {c.sub && (
              <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                {c.sub}
              </p>
            )}
          </a>
        ))}
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Edit About / Hero", desc: "Bio, location, hero text, profile photo URL.", href: "/admin/about" },
          { label: "Manage Skills", desc: "Add, hide, edit, set proficiency, attach certificates.", href: "/admin/skills" },
          { label: "Manage Projects", desc: "Tags, gallery, live links, video embeds.", href: "/admin/projects" },
          { label: "Read Messages", desc: "Inbox of contact-form submissions.", href: "/admin/messages" },
          { label: "Edit Contacts", desc: "LinkedIn, GitHub, WhatsApp, email — visibility & order.", href: "/admin/contacts" },
        ].map((c) => (
          <a
            key={c.label}
            href={c.href}
            className="rounded-3xl border p-6 transition-colors hover:border-yellow-400/50"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <h3 className="text-base font-semibold tracking-tight">{c.label}</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              {c.desc}
            </p>
          </a>
        ))}
      </section>
    </AdminShell>
  );
}
