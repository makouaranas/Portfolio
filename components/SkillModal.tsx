"use client";

import type { Skill } from "../lib/types";
import Modal from "./Modal";
import SkillIcon from "./SkillIcon";

interface SkillModalProps {
  skill: Skill | null;
  onClose: () => void;
}

function proficiencyLabel(value: number): string {
  if (value >= 90) return "Expert";
  if (value >= 80) return "Advanced";
  if (value >= 70) return "Strong";
  return "Developing";
}

export default function SkillModal({ skill, onClose }: SkillModalProps) {
  return (
    <Modal open={skill !== null} onClose={onClose} labelledBy="skill-modal-title">
      {skill && (
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border text-yellow-400"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <SkillIcon skill={skill} className="h-9 w-9" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium tracking-[0.22em] uppercase text-yellow-400">
                {skill.category}
              </p>
              <h3 id="skill-modal-title" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {skill.name}
              </h3>
            </div>
          </div>

          {skill.description && (
            <p className="mt-7 leading-relaxed" style={{ color: "var(--muted)" }}>
              {skill.description}
            </p>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div
              className="rounded-lg border p-4"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>
                Level
              </p>
              <p className="mt-2 text-sm font-semibold">{proficiencyLabel(skill.proficiency)}</p>
              <p className="mt-1 text-xs font-mono text-yellow-400">{skill.proficiency}%</p>
            </div>
            <div
              className="rounded-lg border p-4"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>
                Projects
              </p>
              <p className="mt-2 text-sm font-semibold">
                {skill.project_count} project{skill.project_count === 1 ? "" : "s"}
              </p>
            </div>
            <div
              className="rounded-lg border p-4"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>
                Category
              </p>
              <p className="mt-2 text-sm font-semibold">{skill.category}</p>
            </div>
          </div>

          {skill.certificate_url && (
            <a
              href={skill.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 glow-yellow"
            >
              View Certificate
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          )}
        </div>
      )}
    </Modal>
  );
}
