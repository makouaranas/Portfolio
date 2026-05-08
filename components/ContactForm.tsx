"use client";

import { useState } from "react";

import { api } from "../lib/api";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

interface FieldErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: { name: string; email: string; subject: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Required";
  if (!values.email.trim()) errors.email = "Required";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "Invalid email";
  if (!values.subject.trim()) errors.subject = "Required";
  if (!values.message.trim()) errors.message = "Required";
  else if (values.message.trim().length < 10) errors.message = "Tell me a bit more (10+ chars)";
  return errors;
}

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(values);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setStatus({ kind: "submitting" });
    try {
      await api.sendContact(values);
      setStatus({ kind: "success" });
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border bg-transparent text-sm transition-colors focus:outline-none focus:border-yellow-400/60";
  const inputStyle = { borderColor: "var(--border)", color: "var(--fg)" } as const;

  return (
    <form
      onSubmit={handleSubmit}
      className="text-left grid gap-4 sm:grid-cols-2"
      noValidate
    >
      <div>
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>Name</label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          className={inputClass}
          style={inputStyle}
          autoComplete="name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
      </div>
      <div>
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>Email</label>
        <input
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          className={inputClass}
          style={inputStyle}
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>Subject</label>
        <input
          type="text"
          value={values.subject}
          onChange={(e) => setValues({ ...values, subject: e.target.value })}
          className={inputClass}
          style={inputStyle}
        />
        {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
      </div>
      <div className="sm:col-span-2">
        <label className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>Message</label>
        <textarea
          rows={5}
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
          className={`${inputClass} resize-y`}
          style={inputStyle}
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
      </div>

      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={status.kind === "submitting"}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 glow-yellow"
        >
          {status.kind === "submitting" ? "Sending..." : "Send Message"}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-7-7m7 7l-7 7" />
          </svg>
        </button>
        {status.kind === "success" && (
          <p className="text-sm text-green-400">Thanks — I&apos;ll get back to you shortly.</p>
        )}
        {status.kind === "error" && (
          <p className="text-sm text-red-400">{status.message}</p>
        )}
      </div>
    </form>
  );
}
