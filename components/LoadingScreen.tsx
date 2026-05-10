"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Constants ──────────────────────────────────────────────────────────── */
const GOLD = "#facc15";
const G = (a: number) => `rgba(250,204,21,${a})`;

// Pointy-top regular hexagon, r=48, centered at SVG (100,100)
const HEX_R = 48;
const HEX_VERTICES = Array.from({ length: 6 }, (_, i) => {
  const a = ((i * 60 - 90) * Math.PI) / 180;
  return [100 + HEX_R * Math.cos(a), 100 + HEX_R * Math.sin(a)] as [number, number];
});
const HEX_PATH = `M ${HEX_VERTICES.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L ")} Z`;

const STATUSES = [
  "Initializing runtime",
  "Loading modules",
  "Building components",
  "Rendering interface",
  "Calibrating display",
  "Almost ready",
];

/* ─── Corner bracket ─────────────────────────────────────────────────────── */
function CornerBracket({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const W = 40, H = 40, sw = 1, r = sw / 2;
  const paths: Record<string, string> = {
    tl: `M${W},${r} H${r} V${H}`,
    tr: `M0,${r} H${W - r} V${H}`,
    bl: `M${W},${H - r} H${r} V0`,
    br: `M0,${H - r} H${W - r} V0`,
  };
  const corners: Record<string, [number, number]> = {
    tl: [r, r], tr: [W - r, r], bl: [r, H - r], br: [W - r, H - r],
  };
  const placement: Record<string, React.CSSProperties> = {
    tl: { top: 22, left: 22 }, tr: { top: 22, right: 22 },
    bl: { bottom: 22, left: 22 }, br: { bottom: 22, right: 22 },
  };
  const [cx, cy] = corners[pos];

  return (
    <div
      style={{
        position: "absolute",
        ...placement[pos],
        opacity: 0,
        animation: "ls-fadeIn 0.6s ease 0.15s forwards",
      }}
    >
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        {/* L-bracket */}
        <path d={paths[pos]} fill="none" stroke={G(0.4)} strokeWidth={sw} />
        {/* Corner dot */}
        <circle cx={cx} cy={cy} r={1.5} fill={G(0.55)} />
        {/* Tick marks along the two arms */}
        {[8, 16, 24].map((offset) => {
          const horizontal = pos.includes("l")
            ? [[cx + offset, cy - 3], [cx + offset, cy]]
            : [[cx - offset, cy - 3], [cx - offset, cy]];
          const vertical = pos.includes("t")
            ? [[cx - 3, cy + offset], [cx, cy + offset]]
            : [[cx + 3, cy - offset], [cx, cy - offset]]; // fixed for br/bl
          const vt = pos.includes("t")
            ? [[cx - 3, cy + offset], [cx, cy + offset]]
            : [[cx - 3, cy - offset], [cx, cy - offset]];
          return (
            <g key={offset}>
              <line
                x1={horizontal[0][0]} y1={horizontal[0][1]}
                x2={horizontal[1][0]} y2={horizontal[1][1]}
                stroke={G(0.25)} strokeWidth="0.5"
              />
              <line
                x1={vt[0][0]} y1={vt[0][1]}
                x2={vt[1][0]} y2={vt[1][1]}
                stroke={G(0.25)} strokeWidth="0.5"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Main loading screen ────────────────────────────────────────────────── */
export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  const [hexDrawn, setHexDrawn] = useState(false);
  const [activeVerts, setActiveVerts] = useState<Set<number>>(new Set());
  const doneRef = useRef(false);

  useEffect(() => {
    // Draw hex after a brief moment
    const t1 = setTimeout(() => setHexDrawn(true), 50);

    // Stagger vertex dots
    HEX_VERTICES.forEach((_, i) =>
      setTimeout(() => setActiveVerts((s) => new Set([...s, i])), 150 + i * 40),
    );

    // Ellipsis
    const dotsTimer = setInterval(() => setDotCount((d) => (d % 3) + 1), 380);

    // Status text
    const statusTimer = setInterval(
      () => setStatusIdx((i) => Math.min(i + 1, STATUSES.length - 1)),
      680,
    );

    // Progress — starts eager, slows near 99
    let p = 0;
    const progressTimer = setInterval(() => {
      const spd = p < 30 ? 1.8 : p < 60 ? 1.1 : p < 82 ? 0.45 : p < 94 ? 0.15 : 0.04;
      p = Math.min(p + spd, 99);
      setProgress(p);
    }, 28);

    // Finish on load (min 0.5 s)
    const MIN = 500;
    const t0 = Date.now();
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      const wait = Math.max(0, MIN - (Date.now() - t0));
      setTimeout(() => {
        clearInterval(progressTimer);
        setProgress(100);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onDone, 350); // Even shorter fade-out exit
        }, 150); // Even shorter flash before exit
      }, wait);
    };

    if (typeof window !== "undefined") {
      if (document.readyState === "complete") finish();
      else window.addEventListener("load", finish, { once: true });
    }

    return () => {
      clearTimeout(t1);
      clearInterval(dotsTimer);
      clearInterval(statusTimer);
      clearInterval(progressTimer);
    };
  }, [onDone]);

  const dotStr = ".".repeat(dotCount);

  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes ls-spinCW    { to { transform: rotate(360deg); } }
        @keyframes ls-spinCCW   { to { transform: rotate(-360deg); } }
        @keyframes ls-pulse {
          0%,100% { opacity:1; transform:translate(-50%,-50%) scale(1); }
          50%     { opacity:0.55; transform:translate(-50%,-50%) scale(1.18); }
        }
        @keyframes ls-scan {
          0%          { top:0%;   opacity:0; }
          4%          { opacity:0.55; }
          90%         { opacity:0.45; }
          100%        { top:100%; opacity:0; }
        }
        @keyframes ls-fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes ls-fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes ls-dotGlow {
          0%,100% { filter:drop-shadow(0 0 2px ${G(0.7)}); }
          50%     { filter:drop-shadow(0 0 7px ${G(1)}); }
        }
        @keyframes ls-centerPulse {
          0%,100% { filter:drop-shadow(0 0 3px ${G(0.8)}); }
          50%     { filter:drop-shadow(0 0 10px ${G(1)}); }
        }
        @keyframes ls-shimmer {
          0%   { transform:translateX(-200%); }
          100% { transform:translateX(200%); }
        }
        @keyframes ls-blink {
          0%,49% { opacity:1; } 50%,100% { opacity:0.15; }
        }
        @keyframes ls-exit {
          0%   { opacity:1; transform:scale(1); filter:blur(0px); }
          100% { opacity:0; transform:scale(1.05); filter:blur(10px); }
        }
        @keyframes ls-glitch {
          0%,88%,100% { transform:translate(0,0); clip-path:none; }
          90%  { transform:translate(-2px, 0); clip-path:polygon(0 15%,100% 15%,100% 35%,0 35%); }
          92%  { transform:translate( 2px, 0); clip-path:polygon(0 55%,100% 55%,100% 75%,0 75%); }
          94%  { transform:translate( 0,   0); clip-path:none; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#020202",
          animation: exiting ? "ls-exit 0.9s cubic-bezier(0.4,0,1,1) forwards" : undefined,
          userSelect: "none",
          overflow: "hidden",
        }}
      >
        {/* ── Grid background ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px)," +
              "linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(ellipse 65% 65% at 50% 50%, black 0%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 65% 65% at 50% 50%, black 0%, transparent 100%)",
          }}
        />

        {/* ── Radial golden glow ── */}
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            left: "50%",
            top: "50%",
            background:
              "radial-gradient(circle, rgba(250,204,21,0.08) 0%, transparent 65%)",
            animation: "ls-pulse 4s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* ── Scanline ── */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: 1,
            background: `linear-gradient(to right,
              transparent 0%,
              ${G(0.15)} 20%,
              ${G(0.45)} 50%,
              ${G(0.15)} 80%,
              transparent 100%)`,
            animation: "ls-scan 5s linear infinite",
            pointerEvents: "none",
          }}
        />

        {/* ── Corner brackets ── */}
        <CornerBracket pos="tl" />
        <CornerBracket pos="tr" />
        <CornerBracket pos="bl" />
        <CornerBracket pos="br" />

        {/* ── Central SVG ─────────────────────────────────────────────────── */}
        <svg
          viewBox="0 0 200 200"
          width={230}
          height={230}
          style={{ overflow: "visible", display: "block" }}
        >
          {/* Outermost dashed ring — slow CW */}
          <circle
            cx="100" cy="100" r="90"
            fill="none" stroke={G(0.18)} strokeWidth="0.7" strokeDasharray="2 8"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "ls-spinCW 70s linear infinite",
            }}
          />

          {/* 24 tick marks around outer ring */}
          {Array.from({ length: 24 }, (_, i) => {
            const a = ((i * 15 - 90) * Math.PI) / 180;
            const major = i % 6 === 0;
            const med   = i % 3 === 0;
            const r1 = 90;
            const r2 = major ? 82 : med ? 85.5 : 87.5;
            return (
              <line
                key={i}
                x1={(100 + r1 * Math.cos(a)).toFixed(2)}
                y1={(100 + r1 * Math.sin(a)).toFixed(2)}
                x2={(100 + r2 * Math.cos(a)).toFixed(2)}
                y2={(100 + r2 * Math.sin(a)).toFixed(2)}
                stroke={G(major ? 0.5 : med ? 0.3 : 0.18)}
                strokeWidth={major ? "1" : "0.5"}
              />
            );
          })}

          {/* Bold sweeping arc — fast CCW */}
          <circle
            cx="100" cy="100" r="75"
            fill="none" stroke={G(0.75)} strokeWidth="1.6"
            strokeDasharray="55 416" strokeLinecap="round"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "ls-spinCCW 7s linear infinite",
            }}
          />
          {/* Faint trailing arc */}
          <circle
            cx="100" cy="100" r="75"
            fill="none" stroke={G(0.28)} strokeWidth="0.9"
            strokeDasharray="28 443" strokeLinecap="round"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "ls-spinCCW 7s linear infinite",
              animationDelay: "-3.5s",
            }}
          />

          {/* Middle dashed ring — medium CW */}
          <circle
            cx="100" cy="100" r="60"
            fill="none" stroke={G(0.14)} strokeWidth="0.5" strokeDasharray="5 14"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "ls-spinCW 35s linear infinite",
            }}
          />

          {/* Hexagon — stroke draw on mount */}
          <path
            d={HEX_PATH}
            fill="none"
            stroke={GOLD}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: hexDrawn ? 0 : 1,
              transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s",
            }}
          />

          {/* Vertex dots — appear one by one */}
          {HEX_VERTICES.map(([x, y], i) => (
            <g
              key={i}
              style={{
                opacity: activeVerts.has(i) ? 1 : 0,
                transition: "opacity 0.35s ease",
              }}
            >
              {/* Halo ring */}
              <circle cx={x} cy={y} r="5.5" fill="#020202" stroke={G(0.9)} strokeWidth="1" />
              {/* Inner dot — blinking */}
              <circle
                cx={x}
                cy={y}
                r="2"
                fill={GOLD}
                style={{
                  animation: activeVerts.has(i)
                    ? `ls-blink 1.8s steps(2) ${i * 0.3}s infinite`
                    : "none",
                }}
              />
            </g>
          ))}

          {/* Radial spoke lines (hex center → inner circle, short segments) */}
          {HEX_VERTICES.map(([x, y], i) => {
            const dx = x - 100, dy = y - 100;
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = dx / len, ny = dy / len;
            return (
              <line
                key={i}
                x1={(100 + nx * 17).toFixed(2)} y1={(100 + ny * 17).toFixed(2)}
                x2={(100 + nx * 27).toFixed(2)} y2={(100 + ny * 27).toFixed(2)}
                stroke={G(0.45)} strokeWidth="0.7"
                style={{
                  opacity: hexDrawn ? 1 : 0,
                  transition: `opacity 0.4s ease ${0.95 + i * 0.07}s`,
                }}
              />
            );
          })}

          {/* Inner spinning dashed ring */}
          <circle
            cx="100" cy="100" r="22"
            fill="none" stroke={G(0.28)} strokeWidth="0.6" strokeDasharray="4.5 4.5"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animation: "ls-spinCCW 4.5s linear infinite",
            }}
          />

          {/* Inner circle — drawn in */}
          <circle
            cx="100" cy="100" r="14"
            fill="none" stroke={G(0.55)} strokeWidth="1"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: hexDrawn ? 0 : 1,
              transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1) 1.35s",
            }}
          />

          {/* Crosshair lines */}
          {[
            [100, 87, 100, 93],
            [100, 107, 100, 113],
            [87, 100, 93, 100],
            [107, 100, 113, 100],
          ].map(([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={G(0.5)} strokeWidth="0.8"
              style={{
                opacity: hexDrawn ? 1 : 0,
                transition: `opacity 0.3s ease ${1.45 + i * 0.06}s`,
              }}
            />
          ))}

          {/* Center dot */}
          <circle
            cx="100" cy="100" r="2.8"
            fill={GOLD}
            style={{
              opacity: hexDrawn ? 1 : 0,
              transition: "opacity 0.5s ease 1.7s",
              animation: hexDrawn ? "ls-centerPulse 2.2s ease-in-out infinite" : "none",
            }}
          />

          {/* ── Progress arc on outer ring ── */}
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke={GOLD}
            strokeWidth="1.8"
            strokeLinecap="round"
            pathLength="100"
            style={{
              strokeDasharray: 100,
              strokeDashoffset: 100 - progress,
              transform: "rotate(-90deg)",
              transformOrigin: "100px 100px",
              transition: "stroke-dashoffset 0.15s ease",
              opacity: 0.75,
            }}
          />
        </svg>
        {/* ── / SVG ── */}

        {/* ── Name ── */}
        <div
          style={{
            marginTop: 6,
            textAlign: "center",
            animation: "ls-fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s both",
          }}
        >
          {/* Glitch wrapper */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              style={{
                fontFamily: "var(--font-geist-mono, monospace)",
                fontSize: 11,
                letterSpacing: "0.42em",
                color: GOLD,
                textTransform: "uppercase",
                animation: "ls-glitch 6s ease-in-out infinite 2.5s",
              }}
            >
              MAKOUAR&nbsp;ANAS
            </div>
            {/* Ghost glitch layer */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                fontFamily: "var(--font-geist-mono, monospace)",
                fontSize: 11,
                letterSpacing: "0.42em",
                color: G(0.45),
                textTransform: "uppercase",
                animation: "ls-glitch 6s ease-in-out infinite 2.65s",
                pointerEvents: "none",
              }}
            >
              MAKOUAR&nbsp;ANAS
            </div>
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 9,
              letterSpacing: "0.24em",
              color: "rgba(163,163,163,0.65)",
              textTransform: "uppercase",
            }}
          >
            Full-Stack Engineer
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div
          style={{
            marginTop: 26,
            width: 230,
            animation: "ls-fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.7s both",
          }}
        >
          {/* Track */}
          <div
            style={{
              position: "relative",
              height: 2,
              background: G(0.1),
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {/* Shimmer on track */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                borderRadius: 1,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg, transparent, ${G(0.25)}, transparent)`,
                  animation: "ls-shimmer 2.8s ease-in-out infinite",
                }}
              />
            </div>

            {/* Fill */}
            <div
              style={{
                position: "relative",
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(to right, ${G(0.45)}, ${GOLD})`,
                borderRadius: 1,
                transition: "width 0.1s ease",
              }}
            >
              {/* Glowing tip */}
              {progress > 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: -1,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: GOLD,
                    boxShadow: `0 0 8px 3px ${G(0.75)}`,
                  }}
                />
              )}
            </div>
          </div>

          {/* Status + percentage */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              fontFamily: "var(--font-geist-mono, monospace)",
              fontSize: 9,
              color: "rgba(115,115,115,0.9)",
              letterSpacing: "0.04em",
            }}
          >
            <span>
              {STATUSES[statusIdx]}
              {dotStr}
            </span>
            <span>{String(Math.floor(progress)).padStart(3, "0")}%</span>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "0 28px",
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(115,115,115,0.3)",
            letterSpacing: "0.09em",
            animation: "ls-fadeIn 1.2s ease 0.5s both",
          }}
        >
          <span>SYS&nbsp;//&nbsp;v2.0.0</span>
          <span>◈&nbsp;SIGNAL&nbsp;LOCKED</span>
          <span>2026.05.10</span>
        </div>
      </div>
    </>
  );
}
