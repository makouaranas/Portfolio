"use client";

import { useEffect, useRef, useState } from "react";

import type { Project } from "../lib/types";
import ProjectModal from "./ProjectModal";
import Reveal from "./Reveal";

interface ProjectsProps {
  projects: Project[];
  loading: boolean;
}

export default function Projects({ projects, loading }: ProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative py-28">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">Projects</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter">
            Selected <span style={{ color: "var(--muted)" }}>works</span>
          </h2>
          <p className="mt-4" style={{ color: "var(--muted)" }}>
            Click a card for the full story.
          </p>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {loading
            ? [0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-3xl border animate-shimmer"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}
                />
              ))
            : projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p)}
                  className={`group relative text-left rounded-3xl overflow-hidden border transition-all duration-500 ${
                    visible ? "animate-fade-up" : "opacity-0"
                  }`}
                  style={{
                    borderColor: "var(--border)",
                    animationDelay: `${i * 150}ms`,
                  }}
                >
                  <div className="relative h-56 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.thumbnail_url ?? "https://picsum.photos/seed/" + p.id + "/800/500.jpg"}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, var(--bg), color-mix(in oklab, var(--bg) 50%, transparent), transparent)" }}
                    />
                    <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/5 transition-colors duration-500" />
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  </div>

                  <div className="p-6" style={{ background: "var(--bg-soft)" }}>
                    <h3 className="text-lg font-semibold tracking-tight group-hover:text-yellow-400 transition-colors duration-300">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>
                      {p.short_description ?? p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.skills.slice(0, 4).map((s) => (
                        <span
                          key={s.id}
                          className="px-3 py-1 text-[10px] font-medium tracking-wider uppercase border rounded-full"
                          style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--muted)" }}
                        >
                          {s.name}
                        </span>
                      ))}
                      {p.skills.length > 4 && (
                        <span
                          className="px-3 py-1 text-[10px] font-medium tracking-wider uppercase border rounded-full"
                          style={{ borderColor: "var(--border)", color: "var(--muted-2)" }}
                        >
                          +{p.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
        </div>
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
