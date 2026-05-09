"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

import { useReveal } from "../lib/useReveal";

type Variant = "up" | "down" | "left" | "right" | "fade" | "scale";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: Variant;
  threshold?: number;
  as?: ElementType;
  style?: CSSProperties;
}

const initialTransform: Record<Variant, string> = {
  up: "translateY(40px)",
  down: "translateY(-40px)",
  left: "translateX(-40px)",
  right: "translateX(40px)",
  fade: "none",
  scale: "scale(0.94)",
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 800,
  variant = "up",
  threshold = 0.15,
  as: Tag = "div",
  style,
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>({ threshold });

  const merged: CSSProperties = {
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms ease ${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : initialTransform[variant],
    filter: visible ? "blur(0)" : "blur(6px)",
    willChange: "opacity, transform, filter",
    ...style,
  };

  return <Tag ref={ref} className={className} style={merged}>{children}</Tag>;
}
