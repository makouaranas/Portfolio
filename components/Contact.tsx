"use client";

import { useEffect, useRef, useState } from "react";

import type { About, ContactPlatform } from "../lib/types";
import ContactForm from "./ContactForm";

interface ContactProps {
  about: About | null;
  contacts: ContactPlatform[];
}

function platformLabel(p: ContactPlatform): string {
  return p.label ?? p.platform.charAt(0).toUpperCase() + p.platform.slice(1);
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

  return (
    <section id="contact" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className={`text-center ${visible ? "animate-fade-up" : "opacity-0"}`}>
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">Contact</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter">
            Let&apos;s work <span style={{ color: "var(--muted)" }}>together</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto" style={{ color: "var(--muted)" }}>
            Have a project in mind, or just want to say hi? Drop me a message — I usually reply within a day.
          </p>
        </div>

        <div
          className={`mt-12 p-8 rounded-3xl border backdrop-blur-md ${visible ? "animate-fade-up delay-200" : "opacity-0"}`}
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <ContactForm />

          {contacts.length > 0 && (
            <div
              className="mt-8 pt-8 border-t flex flex-wrap justify-center gap-3"
              style={{ borderColor: "var(--border)" }}
            >
              {contacts.map((c) => (
                <a
                  key={c.id}
                  href={c.url}
                  target={c.url.startsWith("http") ? "_blank" : undefined}
                  rel={c.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm transition-all duration-300 hover:border-yellow-400/30 hover:text-yellow-400"
                  style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                >
                  {platformLabel(c)}
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>

        {about?.email && (
          <div className={`mt-10 text-center ${visible ? "animate-fade-up delay-400" : "opacity-0"}`}>
            <a
              href={`mailto:${about.email}`}
              className="text-sm transition-colors hover:text-yellow-400"
              style={{ color: "var(--muted)" }}
            >
              Or email me directly: <span className="font-medium">{about.email}</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
