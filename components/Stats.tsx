"use client";

interface StatsProps {
  yearsExperience: number;
  projectsCount: number;
  skillsCount: number;
}

export default function Stats({ yearsExperience, projectsCount, skillsCount }: StatsProps) {
  const items = [
    { value: yearsExperience > 0 ? `${yearsExperience}+` : "—", label: "Years Experience" },
    { value: projectsCount > 0 ? `${projectsCount}+` : "—", label: "Projects Shipped" },
    { value: skillsCount > 0 ? `${skillsCount}+` : "—", label: "Tools & Tech" },
    { value: "∞", label: "Cups of Coffee" },
  ];
  return (
    <section className="relative py-16 border-y" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl sm:text-4xl font-medium tracking-tighter text-yellow-400">{s.value}</p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
