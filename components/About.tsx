"use client";

import type { About as AboutContent } from "../lib/types";
import Reveal from "./Reveal";

interface AboutProps {
  about: AboutContent | null;
}

export default function About({ about }: AboutProps) {
  const photo = about?.photo_url ?? "https://picsum.photos/seed/about-photo/600/800.jpg";
  const facts = [
    { label: "Name", value: about?.name ?? "MAKOUAR Anas" },
    { label: "Email", value: about?.email ?? "—" },
    { label: "Location", value: about?.location ?? "—" },
    { label: "Status", value: "Open to work" },
  ];

  return (
    <section id="about" className="relative py-28 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <Reveal variant="left" className="flex-shrink-0">
            <div
              className="relative w-72 h-96 md:w-80 md:h-[420px] rounded-3xl overflow-hidden border group"
              style={{ borderColor: "var(--border)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo}
                alt="About me"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
              />
              <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-yellow-400/50 rounded-tl-lg" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-yellow-400/50 rounded-br-lg" />
            </div>
          </Reveal>

          <div className="flex-1">
            <Reveal variant="right">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">About Me</span>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter leading-[1.1]">
                {about?.title ? (
                  <>
                    {about.title.split(" & ")[0]}
                    {about.title.includes(" & ") && (
                      <>
                        {" & "}
                        <span style={{ color: "var(--muted)" }}>{about.title.split(" & ")[1]}</span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Turning ideas into{" "}
                    <span style={{ color: "var(--muted)" }}>real experiences</span>
                  </>
                )}
              </h2>
            </Reveal>

            <Reveal variant="right" delay={150}>
              <p
                className="mt-6 leading-relaxed whitespace-pre-line"
                style={{ color: "var(--muted)" }}
              >
                {about?.bio ?? "Loading bio..."}
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {facts.map((item, i) => (
                <Reveal key={i} variant="up" delay={250 + i * 90}>
                  <div
                    className="p-4 rounded-2xl border h-full"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }}
                  >
                    <p className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium break-all">{item.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
