"use client";

import { useEffect, useRef, useState } from "react";

/* ───────── Data ───────── */
const NAV_LINKS = ["About", "Skills", "Projects", "Contact"];

const SKILL_CATEGORIES = [
  {
    title: "Frontend",
    icon: "🎨",
    skills: [
      { name: "React / Next.js",    level: 92 },
      { name: "TypeScript",         level: 88 },
      { name: "Tailwind CSS",       level: 95 },
      { name: "Framer Motion",      level: 80 },
    ],
  },
  {
    title: "Backend",
    icon: "⚙️",
    skills: [
      { name: "Node.js",            level: 85 },
      { name: "Python / FastAPI",   level: 78 },
      { name: "PostgreSQL",         level: 82 },
      { name: "REST & GraphQL",     level: 80 },
    ],
  },
  {
    title: "Tools & Other",
    icon: "🛠",
    skills: [
      { name: "Git & GitHub",       level: 90 },
      { name: "Docker",             level: 72 },
      { name: "Figma",              level: 76 },
      { name: "CI / CD",            level: 70 },
    ],
  },
];

const PROJECTS = [
  {
    title: "SaaS Dashboard",
    desc: "A real-time analytics dashboard built with Next.js, Recharts, and Supabase. Features dark mode, role-based access, and PDF export.",
    tags: ["Next.js", "TypeScript", "Supabase", "Recharts"],
    image: "https://picsum.photos/seed/saas-dash/800/500.jpg",
    link: "#",
  },
  {
    title: "E-Commerce Store",
    desc: "Full-stack e-commerce with Stripe payments, cart persistence, and an admin panel for inventory management.",
    tags: ["React", "Node.js", "Stripe", "PostgreSQL"],
    image: "https://picsum.photos/seed/ecom-store/800/500.jpg",
    link: "#",
  },
  {
    title: "AI Chat Interface",
    desc: "A conversational UI that streams responses from OpenAI's API with markdown rendering and conversation history.",
    tags: ["Next.js", "OpenAI", "Tailwind", "Vercel AI SDK"],
    image: "https://picsum.photos/seed/ai-chat-ui/800/500.jpg",
    link: "#",
  },
  {
    title: "Portfolio Generator",
    desc: "A CLI tool that scaffolds beautiful portfolio sites from a JSON config file. Supports multiple themes.",
    tags: ["Node.js", "CLI", "Handlebars", "Shell"],
    image: "https://picsum.photos/seed/port-gen/800/500.jpg",
    link: "#",
  },
];

const STATS = [
  { value: "3+",  label: "Years Experience" },
  { value: "30+", label: "Projects Completed" },
  { value: "15+", label: "Happy Clients" },
  { value: "∞",   label: "Cups of Coffee" },
];

/* ───────── Components ───────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#020202]/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-lg font-bold tracking-tight">
          <span className="text-yellow-400">{"<"}</span>
          MAKOUAR Anas
          <span className="text-yellow-400">{"/>"}</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="text-sm text-neutral-400 hover:text-white transition-colors duration-300"
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-semibold px-5 py-2 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-300 hover:scale-105 glow-yellow"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 flex flex-col gap-4 bg-[#020202]/95 backdrop-blur-xl border-b border-white/5">
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="text-neutral-400 hover:text-white transition-colors py-1"
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-yellow-400 text-black text-center w-fit"
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg" />

      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Spinning ring decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] border border-white/[0.03] rounded-full animate-spin-slow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[550px] md:h-[550px] border border-white/[0.04] rounded-full animate-spin-slow pointer-events-none" style={{ animationDirection: "reverse", animationDuration: "30s" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Text side */}
        <div className="flex-1 text-center lg:text-left">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-yellow-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Available for work
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-[1.05] animate-fade-up delay-100">
            Hi, I&apos;m{" "}
            <span className="text-yellow-400">Your Name</span>
            <br />
            <span className="text-neutral-500">I build things for the web.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-up delay-300">
            A full-stack developer who loves crafting clean, performant, and
            visually stunning digital experiences that people actually enjoy using.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up delay-500">
            <a
              href="#projects"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-yellow-400 text-black font-semibold text-sm overflow-hidden transition-all duration-300 hover:scale-105 glow-yellow"
            >
              <span className="relative z-10">View My Work</span>
              <svg className="relative z-10 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/10 text-white font-semibold text-sm hover:border-white/25 hover:bg-white/5 transition-all duration-300"
            >
              Get In Touch
            </a>
          </div>
        </div>

        {/* Photo side */}
        <div className="flex-shrink-0 animate-scale-in delay-300">
          <div className="relative">
            {/* Pulse ring behind photo */}
            <div className="absolute inset-0 rounded-full border border-yellow-400/20 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full border border-yellow-400/10 animate-pulse-ring" style={{ animationDelay: "0.8s" }} />

            {/* Photo container */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-2 border-white/10 glow-yellow">
              {/* Replace this src with your actual photo */}
              <img
                src="https://picsum.photos/seed/your-face/600/600.jpg"
                alt="Your Name"
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202]/40 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-2 -right-2 bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-2.5 glow-sm animate-float">
              <span className="text-xs font-medium text-neutral-400">Based in</span>
              <p className="text-sm font-semibold text-white">Your City 🌍</p>
            </div>

            {/* Floating tech badge */}
            <div className="absolute -top-2 -left-2 bg-[#0a0a0a] border border-white/10 rounded-2xl px-4 py-2.5 glow-sm animate-float" style={{ animationDelay: "1.5s" }}>
              <span className="text-xs font-medium text-neutral-400">Stack</span>
              <p className="text-sm font-semibold text-yellow-400">React · Node</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-1000">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-600">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-yellow-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="relative py-16 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center stat-item">
              <p className="text-3xl sm:text-4xl font-medium tracking-tighter text-yellow-400">{s.value}</p>
              <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="relative py-28 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Photo */}
          <div className="flex-shrink-0 about-photo">
            <div className="relative w-72 h-96 md:w-80 md:h-[420px] rounded-3xl overflow-hidden border border-white/10 group">
              <img
                src="https://picsum.photos/seed/about-photo/600/800.jpg"
                alt="About me"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />

              {/* Decorative corners */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-yellow-400/50 rounded-tl-lg" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-yellow-400/50 rounded-br-lg" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 about-text">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">About Me</span>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter leading-[1.1]">
              Turning ideas into{" "}
              <span className="text-neutral-500">real experiences</span>
            </h2>
            <p className="mt-6 text-neutral-400 leading-relaxed">
              I&apos;m a passionate full-stack developer with over 3 years of experience
              building web applications. I specialize in React, Next.js, and Node.js
              ecosystems, and I care deeply about clean code, accessibility, and
              pixel-perfect design.
            </p>
            <p className="mt-4 text-neutral-400 leading-relaxed">
              When I&apos;m not coding, you can find me exploring new technologies,
              contributing to open-source projects, or enjoying a good cup of coffee
              while sketching UI ideas.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: "Name", value: "Your Name" },
                { label: "Email", value: "hello@you.dev" },
                { label: "Location", value: "Your City" },
                { label: "Status", value: "Open to work" },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <p className="text-xs text-neutral-600 uppercase tracking-wider">{item.label}</p>
                  <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-yellow-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">Skills</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter">
            My <span className="text-neutral-500">toolkit</span>
          </h2>
          <p className="mt-4 text-neutral-400">
            Technologies and tools I use to bring products to life.
          </p>
        </div>

        {/* Skill Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {SKILL_CATEGORIES.map((cat, ci) => (
            <div
              key={ci}
              className="group p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.04]"
              style={{ animationDelay: `${ci * 150}ms` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-lg font-semibold tracking-tight">{cat.title}</h3>
              </div>

              <div className="space-y-5">
                {cat.skills.map((skill, si) => (
                  <div key={si}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-neutral-300">{skill.name}</span>
                      <span className="text-xs font-mono text-neutral-500">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 skill-bar"
                        style={
                          visible
                            ? { "--bar-w": `${skill.level}%`, animationDelay: `${ci * 150 + si * 100}ms` } as React.CSSProperties
                            : { "--bar-w": "0%" } as React.CSSProperties
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech cloud */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {[
            "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Python",
            "Tailwind CSS", "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS",
            "Git", "Figma", "Linux", "GraphQL",
          ].map((tech, i) => (
            <span
              key={i}
              className="px-4 py-2 text-xs font-medium text-neutral-400 border border-white/5 rounded-full hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-300 cursor-default"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">Projects</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter">
            Selected <span className="text-neutral-500">works</span>
          </h2>
          <p className="mt-4 text-neutral-400">
            A few things I&apos;ve built that I&apos;m proud of.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {PROJECTS.map((p, i) => (
            <a
              key={i}
              href={p.link}
              className={`group relative rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 project-card ${
                visible ? "animate-fade-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent" />
                <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/5 transition-colors duration-500" />

                {/* Arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-[#0a0a0a]">
                <h3 className="text-lg font-semibold tracking-tight group-hover:text-yellow-400 transition-colors duration-300">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed line-clamp-2">
                  {p.desc}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((tag, ti) => (
                    <span
                      key={ti}
                      className="px-3 py-1 text-[10px] font-medium tracking-wider uppercase text-neutral-500 bg-white/[0.03] border border-white/5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className={visible ? "animate-fade-up" : "opacity-0"}>
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-yellow-400">Contact</span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter">
            Let&apos;s work <span className="text-neutral-500">together</span>
          </h2>
          <p className="mt-4 text-neutral-400 max-w-lg mx-auto">
            Have a project in mind or just want to say hi? I&apos;d love to hear from you.
            Drop me a message and I&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact card */}
        <div
          className={`mt-12 p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md ${
            visible ? "animate-fade-up delay-200" : "opacity-0"
          }`}
        >
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { icon: "📧", label: "Email", value: "hello@you.dev" },
              { icon: "📍", label: "Location", value: "Your City" },
              { icon: "🕐", label: "Response", value: "Within 24h" },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-2 text-xs text-neutral-600 uppercase tracking-wider">{item.label}</p>
                <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4">
            {[
              { name: "GitHub",   href: "#" },
              { name: "LinkedIn", href: "#" },
              { name: "Twitter",  href: "#" },
              { name: "Dribbble", href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-sm text-neutral-400 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-300"
              >
                {s.name}
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Big CTA */}
        <div className={`mt-12 ${visible ? "animate-fade-up delay-400" : "opacity-0"}`}>
          <a
            href="mailto:hello@you.dev"
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all duration-300 hover:scale-105 glow-yellow"
          >
            <span>Say Hello</span>
            <svg className="w-4 h-4 transition-transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-neutral-600">
          © {new Date().getFullYear()} MAKOUAR Anas. Built with Next.js & Tailwind.
        </p>
        <p className="text-xs text-neutral-700">
          Designed & developed with 💛
        </p>
      </div>
    </footer>
  );
}

/* ───────── Page ───────── */
export default function Home() {
  useEffect(() => {
    /* Intersection observer for generic scroll-reveal */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("animate-fade-up");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll(".stat-item, .about-photo, .about-text").forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}