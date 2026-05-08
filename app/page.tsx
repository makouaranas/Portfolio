"use client";

import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import Stats from "../components/Stats";
import { api } from "../lib/api";
import { useFetch } from "../lib/useFetch";

export default function Home() {
  const aboutQuery = useFetch(api.about, []);
  const skillsQuery = useFetch(api.skills, []);
  const projectsQuery = useFetch(api.projects, []);
  const contactsQuery = useFetch(api.contacts, []);

  const about = aboutQuery.data;
  const skills = skillsQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const contacts = contactsQuery.data ?? [];

  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero about={about} loading={aboutQuery.loading} />
      <Stats
        yearsExperience={about?.years_experience ?? 0}
        projectsCount={projects.length}
        skillsCount={skills.length}
      />
      <About about={about} />
      <Skills skills={skills} loading={skillsQuery.loading} />
      <Projects projects={projects} loading={projectsQuery.loading} />
      <Contact about={about} contacts={contacts} />
      <Footer />
    </main>
  );
}
