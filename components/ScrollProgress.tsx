"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
      setProgress(pct);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="scroll-progress-rail fixed right-5 top-24 bottom-24 z-[55] w-px hidden md:block pointer-events-none"
      aria-hidden="true"
    >
      {/* Track — barely visible */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: "var(--border)" }}
      />

      {/* Filled portion — grows as user scrolls */}
      <div
        className="absolute top-0 left-0 right-0 rounded-full"
        style={{
          height: `${progress}%`,
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--accent) 60%, transparent) 40%, var(--accent))",
          transition: "height 90ms linear",
        }}
      />

      {/* Leading dot — glowing handle at the current position */}
      <div
        className="scroll-progress-dot absolute"
        style={{
          top: `${progress}%`,
          right: "-3px",
          width: "7px",
          height: "7px",
          borderRadius: "999px",
          transform: "translateY(-50%)",
          background: "var(--accent)",
          boxShadow:
            "0 0 0 1px color-mix(in oklab, var(--accent) 40%, transparent), 0 0 10px var(--accent), 0 0 20px color-mix(in oklab, var(--accent) 50%, transparent)",
          transition: "top 90ms linear",
        }}
      />
    </div>
  );
}
