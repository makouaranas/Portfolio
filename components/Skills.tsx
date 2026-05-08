"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Skill } from "../lib/types";
import SkillModal from "./SkillModal";

interface SkillsProps {
  skills: Skill[];
  loading: boolean;
}

export default function Skills({ skills, loading }: SkillsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<Skill | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of skills) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return Array.from(map.entries());
  }, [skills]);

  return (
    <section id="skills" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">Skills</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter">
            My <span style={{ color: "var(--muted)" }}>toolkit</span>
          </h2>
          <p className="mt-4" style={{ color: "var(--muted)" }}>
            Tap a card to view details. Categories grouped below.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="p-6 rounded-3xl border h-64 animate-shimmer"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {grouped.map(([category, group], ci) => (
              <div
                key={category}
                className="p-6 rounded-3xl border transition-all duration-500 hover:bg-[var(--card-2)]"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  animationDelay: `${ci * 150}ms`,
                }}
              >
                <h3 className="text-lg font-semibold tracking-tight mb-6">{category}</h3>
                <div className="space-y-5">
                  {group.map((skill, si) => (
                    <button
                      key={skill.id}
                      type="button"
                      onDoubleClick={() => setActive(skill)}
                      onClick={() => setActive(skill)}
                      className="w-full text-left group"
                      title="Click to view details"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm group-hover:text-yellow-400 transition-colors">
                          {skill.name}
                        </span>
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--muted-2)" }}
                        >
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--card-2)" }}
                      >
                        <div
                          className={`h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 skill-bar ${visible ? "skill-bar--visible" : ""}`}
                          style={{
                            ["--bar-w" as string]: `${skill.proficiency}%`,
                            transitionDelay: `${ci * 150 + si * 100}ms`,
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && skills.length > 0 && (
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {skills.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s)}
                className="px-4 py-2 text-xs font-medium border rounded-full transition-all duration-300 hover:border-yellow-400/30 hover:text-yellow-400"
                style={{ color: "var(--muted)", borderColor: "var(--border)" }}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <SkillModal skill={active} onClose={() => setActive(null)} />
    </section>
  );
}
