"use client";

import { useEffect, useRef, useState } from "react";

import type { About, ContactPlatform } from "../lib/types";
import ContactForm from "./ContactForm";
import ContactPlatformIcon from "./ContactPlatformIcon";

interface ContactProps {
  about: About | null;
  contacts: ContactPlatform[];
}

function platformLabel(p: ContactPlatform): string {
  return p.label ?? p.platform.charAt(0).toUpperCase() + p.platform.slice(1);
}

/* Show a clean readable handle below the platform name.
   - mailto:foo@bar.com  → foo@bar.com
   - tel:+212600000000   → +212 6 00 00 00 00 (kept as-is, just stripped of "tel:")
   - https://github.com/me/projects → github.com/me */
function prettyHandle(p: ContactPlatform): string {
  const url = p.url.trim();
  if (url.toLowerCase().startsWith("mailto:")) return url.slice(7);
  if (url.toLowerCase().startsWith("tel:")) return url.slice(4);
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname.replace(/\/$/, "");
    return path && path !== "" ? `${host}${path}` : host;
  } catch {
    return url;
  }
}

export default function Contact({ about, contacts }: ContactProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const sortedContacts = [...contacts].sort((a, b) => a.display_order - b.display_order);

  return (
    <section id="contact" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* ─── Header ────────────────────────────────────────────── */}
        <div className={`text-center ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">
            Contact
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter">
            Let&apos;s work <span style={{ color: "var(--muted)" }}>together</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ color: "var(--muted)" }}>
            Have a project in mind, or just want to say hi? Pick the channel that suits you — I usually reply within a day.
          </p>
        </div>

        {/* ─── Minimal icon row ──────────────────────────────────── */}
        {sortedContacts.length > 0 && (
          <div
            className={`mt-12 flex flex-wrap items-center justify-center gap-7 sm:gap-9 ${
              visible ? "animate-fade-up delay-200" : "opacity-0"
            }`}
          >
            {sortedContacts.map((c) => {
              const external = c.url.startsWith("http");
              return (
                <a
                  key={c.id}
                  href={c.url}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="contact-icon-link group relative inline-flex items-center justify-center transition-all duration-500"
                  aria-label={`${platformLabel(c)} — ${prettyHandle(c)}`}
                  title={platformLabel(c)}
                >
                  <ContactPlatformIcon
                    platform={c.platform}
                    customSvg={c.icon}
                    className="h-6 w-6 sm:h-[26px] sm:w-[26px] transition-transform duration-500"
                  />
                </a>
              );
            })}
          </div>
        )}

        {/* ─── Divider ────────────────────────────────────────────── */}
        <div
          className={`mt-16 mb-10 flex items-center gap-4 ${
            visible ? "animate-fade-up delay-400" : "opacity-0"
          }`}
        >
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--border-strong), transparent)",
            }}
          />
          <span
            className="text-[10px] font-medium tracking-[0.25em] uppercase"
            style={{ color: "var(--muted-2)" }}
          >
            Or send a message
          </span>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--border-strong), transparent)",
            }}
          />
        </div>

        {/* ─── Form card ──────────────────────────────────────────── */}
        <div
          className={`p-8 rounded-3xl border backdrop-blur-md max-w-3xl mx-auto ${
            visible ? "animate-fade-up delay-500" : "opacity-0"
          }`}
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <ContactForm />
        </div>

        {about?.email && (
          <div
            className={`mt-10 text-center ${visible ? "animate-fade-up delay-700" : "opacity-0"}`}
          >
            <a
              href={`mailto:${about.email}`}
              className="text-sm transition-colors hover:text-yellow-400"
              style={{ color: "var(--muted)" }}
            >
              Or email me directly:{" "}
              <span className="font-medium">{about.email}</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
