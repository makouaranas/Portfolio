"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  const trackCls =
    "theme-slider relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-500";

  const sideIconCls =
    "absolute top-1/2 inline-flex h-3 w-3 items-center justify-center transition-opacity duration-500";

  const thumbX = isDark ? "0" : "22px";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={trackCls + " " + className}
    >
      <span
        aria-hidden="true"
        className={sideIconCls + (isDark ? " opacity-0" : " opacity-50")}
        style={{ left: "8px", transform: "translateY(-50%)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>

      <span
        aria-hidden="true"
        className={sideIconCls + (!isDark ? " opacity-0" : " opacity-50")}
        style={{ right: "8px", transform: "translateY(-50%)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </span>

      <span
        aria-hidden="true"
        className="theme-slider-thumb absolute top-1/2 h-5 w-5 rounded-full flex items-center justify-center transition-transform duration-500"
        style={{
          left: "3px",
          transform: `translateY(-50%) translateX(${thumbX})`,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={"absolute h-3 w-3 transition-all duration-500 " + (isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50")}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={"absolute h-3 w-3 transition-all duration-500 " + (!isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50")}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </span>
    </button>
  );
}
