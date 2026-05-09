"use client";

import {
  faBehance,
  faDiscord,
  faDribbble,
  faGithub,
  faInstagram,
  faLinkedinIn,
  faMedium,
  faStackOverflow,
  faTelegram,
  faWhatsapp,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faGlobe,
  faLink,
  faPaperPlane,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-common-types";

/* Map a "platform" key to a sensible fallback icon. Lowercase, partial match. */
const FALLBACKS: Array<[string, IconDefinition]> = [
  ["github", faGithub],
  ["linkedin", faLinkedinIn],
  ["whatsapp", faWhatsapp],
  ["telegram", faTelegram],
  ["instagram", faInstagram],
  ["discord", faDiscord],
  ["youtube", faYoutube],
  ["medium", faMedium],
  ["stackoverflow", faStackOverflow],
  ["stack-overflow", faStackOverflow],
  ["dribbble", faDribbble],
  ["behance", faBehance],
  ["x.com", faXTwitter],
  ["twitter", faXTwitter],
  ["mail", faEnvelope],
  ["email", faEnvelope],
  ["gmail", faEnvelope],
  ["outlook", faEnvelope],
  ["phone", faPhone],
  ["tel", faPhone],
  ["call", faPhone],
  ["website", faGlobe],
  ["portfolio", faGlobe],
  ["blog", faGlobe],
  ["site", faGlobe],
  ["telegram-plane", faPaperPlane],
];

function pickFallback(platform: string): IconDefinition {
  const key = platform.toLowerCase().trim();
  for (const [match, icon] of FALLBACKS) {
    if (key.includes(match)) return icon;
  }
  return faLink;
}

/* Strip width/height/xmlns:* on the root <svg> so CSS sizing wins, and
   force currentColor on the root if no explicit color is set. The admin is
   trusted (only the owner can post), so we render the SVG as-is otherwise. */
function prepareUserSvg(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.toLowerCase().startsWith("<svg")) return trimmed;
  return trimmed
    .replace(/\s(width|height)="[^"]*"/gi, "")
    .replace(/<svg([^>]*)>/i, (m, attrs) => {
      const hasFill = /\sfill="/i.test(attrs);
      const hasColor = /\scolor="/i.test(attrs);
      const extra = hasFill || hasColor ? "" : ' fill="currentColor"';
      return `<svg${attrs} width="100%" height="100%"${extra}>`;
    });
}

interface ContactPlatformIconProps {
  platform: string;
  customSvg?: string | null;
  className?: string;
}

export default function ContactPlatformIcon({
  platform,
  customSvg,
  className = "h-5 w-5",
}: ContactPlatformIconProps) {
  if (customSvg && customSvg.trim()) {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex items-center justify-center ${className}`}
        dangerouslySetInnerHTML={{ __html: prepareUserSvg(customSvg) }}
      />
    );
  }

  const icon = pickFallback(platform);
  const [width, height, , , svgPathData] = icon.icon;
  const paths = Array.isArray(svgPathData) ? svgPathData : [svgPathData];

  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
