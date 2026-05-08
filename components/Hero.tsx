"use client";

import type { About } from "../lib/types";
import Typewriter from "./Typewriter";

interface HeroProps {
  about: About | null;
  loading: boolean;
}

export default function Hero({ about, loading }: HeroProps) {
  const photo = about?.photo_url ?? "https://picsum.photos/seed/your-face/600/600.jpg";
  const description =
    about?.hero_description ??
    "I build performant, beautifully-crafted web apps and bring an electrical engineering mindset to every system I design.";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] border rounded-full animate-spin-slow pointer-events-none"
           style={{ borderColor: "var(--border)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[550px] md:h-[550px] border rounded-full animate-spin-slow pointer-events-none"
           style={{ borderColor: "var(--border)", animationDirection: "reverse", animationDuration: "30s" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center lg:text-left">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-yellow-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Available for work
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-[1.05] animate-fade-up delay-100">
            Hi, I&apos;m{" "}
            <span className="text-yellow-400">{about?.name ?? "MAKOUAR Anas"}</span>
            <br />
            <span style={{ color: "var(--muted)" }}>
              <Typewriter
                words={[
                  "I build things for the web.",
                  "I design clean, fast UIs.",
                  "I ship real systems, end to end.",
                  "Electrical Engineer × Full Stack.",
                ]}
              />
            </span>
          </h1>

          <p
            className="mt-6 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-up delay-300"
            style={{ color: "var(--muted)" }}
          >
            {loading ? "Loading..." : description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up delay-500">
            <a
              href="#projects"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-yellow-400 text-black font-semibold text-sm overflow-hidden transition-all duration-300 hover:scale-105 glow-yellow"
            >
              <span className="relative z-10">View Projects</span>
              <svg className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border font-semibold text-sm transition-all duration-300 hover:bg-[var(--card-2)]"
              style={{ borderColor: "var(--border)", color: "var(--fg)" }}
            >
              Contact Me
            </a>
          </div>
        </div>

        <div className="flex-shrink-0 animate-scale-in delay-300">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border border-yellow-400/20 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full border border-yellow-400/10 animate-pulse-ring" style={{ animationDelay: "0.8s" }} />

            <div
              className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 glow-yellow"
              style={{ borderColor: "var(--border-strong)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={about?.name ?? "Profile"} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {about?.location ? (
              <div
                className="absolute -bottom-2 -right-2 rounded-2xl px-4 py-2.5 glow-sm animate-float"
                style={{ background: "var(--bg-soft)", border: "1px solid var(--border)" }}
              >
                <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Based in</span>
                <p className="text-sm font-semibold">{about.location}</p>
              </div>
            ) : null}

            <div
              className="absolute -top-2 -left-2 rounded-2xl px-4 py-2.5 glow-sm animate-float"
              style={{ background: "var(--bg-soft)", border: "1px solid var(--border)", animationDelay: "1.5s" }}
            >
              <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>Stack</span>
              <p className="text-sm font-semibold text-yellow-400">React · FastAPI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-1000">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--muted-2)" }}>Scroll</span>
          <div
            className="w-5 h-8 rounded-full border flex items-start justify-center p-1"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="w-1 h-2 rounded-full bg-yellow-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
