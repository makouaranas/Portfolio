"use client";

import type { Project } from "../lib/types";
import Modal from "./Modal";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return "";
  }
}

function isYouTube(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function isVimeo(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <Modal open={project !== null} onClose={onClose} labelledBy="project-modal-title">
      {project && (
        <div className="p-0">
          {project.thumbnail_url && (
            <div className="relative h-56 sm:h-72 overflow-hidden rounded-t-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.thumbnail_url}
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, var(--bg-soft), transparent 60%)" }}
              />
            </div>
          )}

          <div className="p-8">
            {project.date && (
              <p className="text-xs tracking-[0.2em] uppercase text-yellow-400">
                {formatDate(project.date)}
              </p>
            )}
            <h3 id="project-modal-title" className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight">
              {project.name}
            </h3>

            {project.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 text-[10px] font-medium tracking-wider uppercase border rounded-full"
                    style={{ background: "var(--card)", borderColor: "var(--border)", color: "var(--muted)" }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-6 leading-relaxed whitespace-pre-line" style={{ color: "var(--muted)" }}>
              {project.description}
            </p>

            {project.video_url && (() => {
              const yt = isYouTube(project.video_url);
              const vm = isVimeo(project.video_url);
              const embed = yt ?? vm;
              if (!embed) return null;
              return (
                <div
                  className="mt-6 aspect-video rounded-2xl overflow-hidden border"
                  style={{ borderColor: "var(--border)" }}
                >
                  <iframe
                    src={embed}
                    title={`${project.name} demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              );
            })()}

            {project.images.length > 1 && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {project.images.slice(1).map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={img.id}
                    src={img.image_url}
                    alt={`${project.name} screenshot`}
                    className="rounded-xl border"
                    style={{ borderColor: "var(--border)" }}
                  />
                ))}
              </div>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all duration-300 hover:scale-105 glow-yellow"
              >
                Visit Live
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
