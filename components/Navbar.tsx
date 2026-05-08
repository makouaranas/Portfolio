"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = ["About", "Skills", "Projects", "Contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl border-b"
          : "border-b border-transparent"
      }`}
      style={
        scrolled
          ? { background: "color-mix(in oklab, var(--bg) 80%, transparent)", borderColor: "var(--border)" }
          : undefined
      }
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#"
          className="text-lg font-bold tracking-tight transition-transform duration-300 hover:scale-[1.02]"
        >
          <span className="text-yellow-400">{"<"}</span>
          MAKOUAR Anas
          <span className="text-yellow-400">{"/>"}</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-sm transition-colors duration-300 hover:text-yellow-400"
              style={{ color: "var(--muted)" }}
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-semibold px-5 py-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-300 hover:scale-105 glow-yellow"
          >
            Hire Me
          </a>
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
              style={{ background: "var(--fg)" }}
            />
            <span
              className={`block w-5 h-0.5 transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`}
              style={{ background: "var(--fg)" }}
            />
            <span
              className={`block w-5 h-0.5 transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
              style={{ background: "var(--fg)" }}
            />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="px-6 pb-6 flex flex-col gap-4 backdrop-blur-xl border-b"
          style={{
            background: "color-mix(in oklab, var(--bg) 92%, transparent)",
            borderColor: "var(--border)",
          }}
        >
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="transition-colors py-1 hover:text-yellow-400"
              style={{ color: "var(--muted)" }}
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-yellow-400 text-black text-center w-fit"
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
}
