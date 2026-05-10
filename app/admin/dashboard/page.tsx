"use client";

import {
  faCode,
  faComments,
  faDiagramProject,
  faEnvelopeOpenText,
  faInbox,
  faPenNib,
  faShareNodes,
  faUserPen,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
import { useEffect, useState } from "react";

import AdminShell from "../../../components/admin/AdminShell";
import CountUp from "../../../components/CountUp";
import Reveal from "../../../components/Reveal";
import {
  adminApi,
  type AdminMessage,
  type AdminMe,
  type AdminStats,
} from "../../../lib/adminApi";

function FaIcon({ icon, className = "h-5 w-5" }: { icon: IconDefinition; className?: string }) {
  const [w, h, , , data] = icon.icon;
  const paths = Array.isArray(data) ? data : [data];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} fill="currentColor" className={className} aria-hidden="true">
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.round(diffMs / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

interface StatItem {
  label: string;
  value: number | null;
  href: string;
  icon: IconDefinition;
  sub?: string;
  highlight?: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [me, setMe] = useState<AdminMe | null>(null);
  const [recent, setRecent] = useState<AdminMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([adminApi.stats(), adminApi.me(), adminApi.listMessages(false)])
      .then(([s, m, msgs]) => {
        if (cancelled) return;
        setStats(s);
        setMe(m);
        setRecent(msgs.slice(0, 4));
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load"));
    return () => {
      cancelled = true;
    };
  }, []);

  const items: StatItem[] = [
    { label: "Skills", value: stats?.skills ?? null, href: "/admin/skills", icon: faCode, sub: "Tools & tech" },
    { label: "Projects", value: stats?.projects ?? null, href: "/admin/projects", icon: faDiagramProject, sub: "Published works" },
    {
      label: "Messages",
      value: stats?.messages_total ?? null,
      href: "/admin/messages",
      icon: faInbox,
      sub: stats && stats.messages_unread > 0 ? `${stats.messages_unread} unread` : "All caught up",
      highlight: !!(stats && stats.messages_unread > 0),
    },
    { label: "Contact platforms", value: stats?.contacts ?? null, href: "/admin/contacts", icon: faShareNodes, sub: "Public links" },
  ];

  const actions = [
    { label: "Edit About / Hero", desc: "Bio, location, hero text, profile photo URL.", href: "/admin/about", icon: faUserPen },
    { label: "Manage Skills", desc: "Add, hide, edit, set proficiency, attach certificates.", href: "/admin/skills", icon: faCode },
    { label: "Manage Projects", desc: "Tags, gallery, live links, video embeds.", href: "/admin/projects", icon: faPenNib },
    { label: "Read Messages", desc: "Inbox of contact-form submissions.", href: "/admin/messages", icon: faEnvelopeOpenText },
    { label: "Edit Contacts", desc: "LinkedIn, GitHub, WhatsApp, email — visibility & order.", href: "/admin/contacts", icon: faShareNodes },
  ];

  const userName = me?.email?.split("@")[0] ?? "there";

  return (
    <AdminShell title="Dashboard" subtitle="Overview of your portfolio content">
      {error && (
        <p className="mb-6 text-sm text-red-400">{error}</p>
      )}

      {/* ── Greeting ────────────────────────────────────────────── */}
      <Reveal variant="up">
        <div className="mb-14">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">
            {greeting()}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-medium tracking-tight">
            Welcome back, <span className="text-yellow-400">{userName}</span>.
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: "var(--muted)" }}>
            Here's what's happening across your portfolio today.
          </p>
        </div>
      </Reveal>

      {/* ── Stats — bare icons, no cards ────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
        {items.map((it, i) => (
          <Reveal key={it.label} variant="up" delay={i * 70}>
            <a href={it.href} className="admin-stat group flex flex-col gap-3 transition-colors">
              <FaIcon
                icon={it.icon}
                className="admin-stat-icon h-5 w-5 transition-all duration-300"
              />
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--muted-2)" }}>
                  {it.label}
                </p>
                <p className="mt-2 text-4xl font-medium tracking-tighter text-yellow-400 leading-none">
                  {it.value === null ? (
                    <span style={{ color: "var(--muted-2)" }}>—</span>
                  ) : (
                    <CountUp to={it.value} />
                  )}
                </p>
                {it.sub && (
                  <p
                    className={`mt-2 text-xs ${it.highlight ? "text-yellow-400 font-semibold" : ""}`}
                    style={it.highlight ? undefined : { color: "var(--muted)" }}
                  >
                    {it.highlight && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1.5 align-middle animate-pulse" />
                    )}
                    {it.sub}
                  </p>
                )}
              </div>
            </a>
          </Reveal>
        ))}
      </section>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div
        className="mt-16 mb-12 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--border-strong), transparent)",
        }}
      />

      {/* ── Recent messages + quick actions — flat, no cards ───── */}
      <div className="grid lg:grid-cols-3 gap-x-12 gap-y-12">
        {/* Recent messages */}
        <Reveal variant="up" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <FaIcon icon={faComments} className="h-3.5 w-3.5 text-yellow-400" />
              <h3 className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--muted-2)" }}>
                Recent messages
              </h3>
            </div>
            <a
              href="/admin/messages"
              className="text-xs transition-colors hover:text-yellow-400"
              style={{ color: "var(--muted)" }}
            >
              View all →
            </a>
          </div>

          {recent === null ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Loading…</p>
          ) : recent.length === 0 ? (
            <div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>No messages yet.</p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted-2)" }}>
                When visitors send the contact form, they'll show up here.
              </p>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
              {recent.map((m) => (
                <li key={m.id} style={{ borderColor: "var(--border)" }}>
                  <a
                    href="/admin/messages"
                    className="group flex items-start gap-4 py-4 transition-colors"
                  >
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold uppercase ${
                        m.read ? "" : "ring-1 ring-yellow-400/40"
                      }`}
                      style={{
                        background: "var(--card-2)",
                        color: "var(--fg)",
                      }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm font-medium truncate group-hover:text-yellow-400 transition-colors">
                          {m.name}
                          {!m.read && (
                            <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 align-middle animate-pulse" />
                          )}
                        </p>
                        <span
                          className="flex-shrink-0 text-[10px] uppercase tracking-wider"
                          style={{ color: "var(--muted-2)" }}
                        >
                          {timeAgo(m.created_at)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs truncate" style={{ color: "var(--muted)" }}>
                        {m.subject}
                      </p>
                      <p className="mt-1 text-xs line-clamp-1" style={{ color: "var(--muted-2)" }}>
                        {m.message}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        {/* Quick actions */}
        <Reveal variant="up" delay={120}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--muted-2)" }}>
              Quick actions
            </h3>
          </div>
          <ul className="space-y-1">
            {actions.map((a) => (
              <li key={a.label}>
                <a
                  href={a.href}
                  className="admin-action group flex items-center gap-3 py-2.5"
                >
                  <FaIcon
                    icon={a.icon}
                    className="admin-action-icon h-3.5 w-3.5 flex-shrink-0 transition-colors duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-yellow-400 transition-colors">
                      {a.label}
                    </p>
                  </div>
                  <svg
                    className="flex-shrink-0 w-3 h-3 opacity-30 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-yellow-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </AdminShell>
  );
}
