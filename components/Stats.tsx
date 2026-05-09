"use client";

import CountUp from "./CountUp";
import Reveal from "./Reveal";

interface StatsProps {
  yearsExperience: number;
  projectsCount: number;
  skillsCount: number;
}

interface StatItem {
  to: number | null;
  display: string | null;
  suffix: string;
  label: string;
}

export default function Stats({ yearsExperience, projectsCount, skillsCount }: StatsProps) {
  const items: StatItem[] = [
    { to: yearsExperience, display: yearsExperience > 0 ? null : "—", suffix: "+", label: "Years Experience" },
    { to: projectsCount, display: projectsCount > 0 ? null : "—", suffix: "+", label: "Projects Shipped" },
    { to: skillsCount, display: skillsCount > 0 ? null : "—", suffix: "+", label: "Tools & Tech" },
    { to: null, display: "∞", suffix: "", label: "Cups of Coffee" },
  ];

  return (
    <section className="relative py-16 border-y" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((s, i) => (
            <Reveal key={i} variant="up" delay={i * 100} className="text-center">
              <p className="text-3xl sm:text-4xl font-medium tracking-tighter text-yellow-400">
                {s.display !== null ? (
                  s.display
                ) : (
                  <CountUp to={s.to ?? 0} suffix={s.suffix} />
                )}
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
