import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    title: "Project One",
    description: "A short description of project one.",
    link: "#",
  },
  {
    title: "Project Two",
    description: "A short description of project two.",
    link: "#",
  },
  {
    title: "Project Three",
    description: "A short description of project three.",
    link: "#",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Header />

        <section className="mt-8">
          <h2 className="text-4xl font-bold">Hi, I'm Your Name</h2>
          <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
            I'm a developer who builds simple, useful web apps. Here are a few
            projects I've worked on.
          </p>
        </section>

        <section id="projects" className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.title} title={p.title} description={p.description} link={p.link} />
          ))}
        </section>

        <section id="about" className="mt-12">
          <h3 className="text-2xl font-semibold">About</h3>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300">
            A short bio goes here. Replace with your own text and links to your
            social profiles or resume.
          </p>
        </section>

        <footer id="contact" className="mt-12 py-8 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-sm">Contact — your@email.com</p>
        </footer>
      </main>
    </div>
  );
}
