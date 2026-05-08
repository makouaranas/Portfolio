"use client";

import {
  faDocker,
  faGithub,
  faLinux,
  faNodeJs,
  faOpenai,
  faPostgresql,
  faPython,
  faReact,
  faTailwindCss,
  faTypescript,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBezierCurve,
  faBolt,
  faBrain,
  faCode,
  faCodeBranch,
  faDatabase,
  faDiagramProject,
  faMicrochip,
  faRobot,
  faServer,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-common-types";

import type { Skill } from "../lib/types";

type SkillIconProps = {
  skill: Pick<Skill, "name" | "category">;
  className?: string;
};

function iconForSkill(skill: Pick<Skill, "name" | "category">): IconDefinition {
  const name = skill.name.toLowerCase();
  const category = skill.category.toLowerCase();

  if (name.includes("react") || name.includes("next")) return faReact;
  if (name.includes("typescript")) return faTypescript;
  if (name.includes("tailwind")) return faTailwindCss;
  if (name.includes("framer")) return faBezierCurve;
  if (name.includes("python") || name.includes("fastapi")) return faPython;
  if (name.includes("node")) return faNodeJs;
  if (name.includes("postgres")) return faPostgresql;
  if (name.includes("rest") || name.includes("graphql")) return faDiagramProject;
  if (name.includes("llm") || name.includes("ai")) return faOpenai;
  if (name.includes("rpa") || name.includes("automation")) return faRobot;
  if (name.includes("electrical")) return faBolt;
  if (name.includes("embedded") || name.includes("iot")) return faMicrochip;
  if (name.includes("git")) return faGithub;
  if (name.includes("docker")) return faDocker;
  if (name.includes("linux") || name.includes("nginx")) return faLinux;
  if (name.includes("ci") || name.includes("cd")) return faCodeBranch;

  if (category.includes("frontend")) return faReact;
  if (category.includes("backend")) return faServer;
  if (category.includes("ai")) return faBrain;
  if (category.includes("electrical")) return faBolt;
  if (category.includes("tools")) return faCodeBranch;

  return faCode;
}

export default function SkillIcon({ skill, className = "h-7 w-7" }: SkillIconProps) {
  const icon = iconForSkill(skill);
  const [width, height, , , svgPathData] = icon.icon;
  const paths = Array.isArray(svgPathData) ? svgPathData : [svgPathData];

  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
    >
      {paths.map((d, index) => (
        <path
          key={index}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={20}
        />
      ))}
    </svg>
  );
}
