"use client";

import { useEffect, useRef, useState } from "react";

import type { Skill } from "../lib/types";
import SkillIcon from "./SkillIcon";
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

  return (
    <section id="skills" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">Skills</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter">
            Technical <span style={{ color: "var(--muted)" }}>toolkit</span>
          </h2>
        </div>

        {loading ? (
          <div className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-4 sm:gap-5">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className="h-[4.5rem] w-[4.5rem] rounded-full border animate-shimmer sm:h-20 sm:w-20"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-16 flex max-w-4xl flex-wrap items-center justify-center gap-4 sm:gap-5 md:gap-6">
            {skills.map((skill, i) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => setActive(skill)}
                className={`skill-icon-button ${visible ? "skill-icon-button--visible" : ""}`}
                style={{ ["--reveal-delay" as string]: `${i * 28}ms` }}
                aria-label={`View ${skill.name} details`}
              >
                <SkillIcon skill={skill} className="h-8 w-8 sm:h-9 sm:w-9" />
                <span className="sr-only">View {skill.name} details</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <SkillModal skill={active} onClose={() => setActive(null)} />
    </section>
  );
}
