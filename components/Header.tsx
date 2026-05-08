export default function Header() {
  return (
    <header className="w-full flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Your Name</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Frontend Developer</p>
      </div>

      <nav className="space-x-4">
        <a href="#projects" className="text-sm text-zinc-700 dark:text-zinc-300">Projects</a>
        <a href="#about" className="text-sm text-zinc-700 dark:text-zinc-300">About</a>
        <a href="#contact" className="text-sm text-zinc-700 dark:text-zinc-300">Contact</a>
      </nav>
    </header>
  );
}
