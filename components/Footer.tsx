"use client";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t py-8" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs" style={{ color: "var(--muted-2)" }}>
          © {year} MAKOUAR Anas. Built with Next.js & FastAPI.
        </p>
        <p className="text-xs" style={{ color: "var(--muted-2)" }}>
          Designed & developed with care.
        </p>
      </div>
    </footer>
  );
}
