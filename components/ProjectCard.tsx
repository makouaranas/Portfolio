type Props = {
  title: string;
  description: string;
  link?: string;
};

export default function ProjectCard({ title, description, link }: Props) {
  return (
    <article className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      {link && (
        <a href={link} className="inline-block mt-4 text-sm text-blue-600 dark:text-blue-400">
          View project →
        </a>
      )}
    </article>
  );
}
