"use client";

import { useEffect, useState, useRef } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    let rafId: number;
    let target = 0;
    let current = 0;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateTarget = () => {
      // Don't fight the user's drag
      if (isDragging.current) return;
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      target = total > 0 ? (h.scrollTop / total) * 100 : 0;
    };

    const tick = () => {
      // Direct 1:1 follow while dragging for zero latency, otherwise smooth lerp
      if (isDragging.current) {
        current = target;
        setProgress(current);
      } else {
        current = lerp(current, target, 0.08);
        if (Math.abs(target - current) > 0.05) {
          setProgress(current);
        } else if (current !== target) {
          current = target;
          setProgress(current);
        }
      }
      
      rafId = requestAnimationFrame(tick);
    };

    updateTarget();
    rafId = requestAnimationFrame(tick);

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      
      // If the user let go of the mouse button outside the window, cancel the drag
      if (e.buttons === 0) {
        isDragging.current = false;
        updateTarget();
        return;
      }

      e.preventDefault(); // Prevent text selection
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const relativeY = Math.max(0, Math.min(e.clientY - top, height));
      const percentage = relativeY / height;
      
      // Update target so tick loop moves the dot
      target = percentage * 100;
      
      // Scroll the actual page, using 'instant' to override any global smooth scrolling
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      window.scrollTo({
        top: total * percentage,
        behavior: "instant"
      });
    };

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        // Snap the target to actual scroll position once dragging ends
        updateTarget();
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed right-4 top-[20%] bottom-[20%] z-[55] w-6 hidden lg:flex justify-center cursor-pointer group"
      aria-hidden="true"
      onPointerDown={(e) => {
        isDragging.current = true;
        // Trigger initial jump
        const { top, height } = e.currentTarget.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(e.clientY - top, height)) / height;
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        window.scrollTo({
          top: total * percentage,
          behavior: "instant"
        });
      }}
    >
      {/* Subtle track background fading at edges */}
      <div className="absolute top-0 bottom-0 w-[1px] rounded-full bg-gradient-to-b from-transparent via-[var(--border-strong)] to-transparent opacity-50" />

      {/* Colored progress line */}
      <div
        className="absolute top-0 w-[1px] rounded-full"
        style={{
          height: `${progress}%`,
          background: "var(--accent)",
        }}
      />

      {/* Clean dot at the tip - scaled up on hover/drag for better grip */}
      <div
        className="absolute flex items-center justify-center transition-transform group-hover:scale-150 duration-200"
        style={{
          top: `${progress}%`,
          transform: "translateY(-50%)",
        }}
      >
        <div className="relative flex items-center justify-center cursor-grab active:cursor-grabbing">
          {/* Inner core dot */}
          <div className="relative w-2 h-2 rounded-full bg-[var(--accent)] z-10" />
          {/* Tiny center highlight */}
          <div className="absolute w-0.5 h-0.5 rounded-[1px] bg-white z-20" />
        </div>
      </div>
    </div>
  );
}
