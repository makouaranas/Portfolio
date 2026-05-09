"use client";

import { useEffect, useMemo, useState } from "react";

interface TypewriterProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
}

export default function Typewriter({
  words,
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseMs = 1400,
  className = "",
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  // Reserve the visual footprint of the longest phrase so the layout below
  // never jumps as we type / delete shorter phrases.
  const longest = useMemo(
    () => words.reduce((acc, w) => (w.length > acc.length ? w : acc), ""),
    [words],
  );

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[index % words.length];
    let timer: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
      } else {
        timer = setTimeout(() => setPhase("deleting"), pauseMs);
      }
    } else if (phase === "deleting") {
      if (text.length > 0) {
        timer = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeed);
      } else {
        setIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, index, words, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span className={`typewriter ${className}`}>
      <span aria-hidden="true" className="typewriter-ghost">
        {longest}
      </span>
      <span className="cursor-blink typewriter-text" aria-live="polite">
        {text}
      </span>
    </span>
  );
}
