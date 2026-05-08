"use client";

import type { Skill } from "../lib/types";
import Modal from "./Modal";

interface SkillModalProps {
  skill: Skill | null;
  onClose: () => void;
}

export default function SkillModal({ skill, onClose }: SkillModalProps) {
  return (
    <Modal open={skill !== null} onClose={onClose} labelledBy="skill-modal-title">
      {skill && (
        <div className="p-8">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl border text-yellow-400"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
              dangerouslySetInnerHTML={
                skill.icon_svg ? { __html: skill.icon_svg } : undefined
              }
            >
              {!skill.icon_svg && (
                <span className="text-xl font-semibold">{skill.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs tracking-[0.2em] uppercase text-yellow-400">{skill.category}</p>
              <h3 id="skill-modal-title" className="mt-1 text-2xl font-semibold tracking-tight">
                {skill.name}
              </h3>
            </div>
          </div>

          {skill.description && (
            <p className="mt-6 leading-relaxed" style={{ color: "var(--muted)" }}>
              {skill.description}
            </p>
          )}

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs tracking-wider uppercase" style={{ color: "var(--muted-2)" }}>
                Proficiency
              </span>
              <span className="text-sm font-mono text-yellow-400">{skill.proficiency}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--card-2)" }}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                style={{ width: `${skill.proficiency}%`, transition: "width 0.6s ease" }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div
              className="p-4 rounded-2xl border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>Used in</p>
              <p className="mt-1 text-sm font-semibold">
                {skill.project_count} project{skill.project_count === 1 ? "" : "s"}
              </p>
            </div>
            <div
              className="p-4 rounded-2xl border"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>Category</p>
              <p className="mt-1 text-sm font-semibold">{skill.category}</p>
            </div>
          </div>

          {skill.certificate_url && (
            <a
              href={skill.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all duration-300 hover:scale-105 glow-yellow"
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
