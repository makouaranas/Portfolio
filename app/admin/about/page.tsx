"use client";

import { useEffect, useState } from "react";

import AdminShell from "../../../components/admin/AdminShell";
import { adminApi, type AboutContent } from "../../../lib/adminApi";

const inputCls =
  "w-full px-4 py-3 rounded-xl border bg-transparent text-sm transition-colors focus:outline-none focus:border-yellow-400/60";

const PHRASE_MAX = 40;
const PHRASES_MAX_COUNT = 10;

const empty: AboutContent = {
  name: "",
  title: "",
  hero_description: "",
  bio: "",
  location: null,
  email: null,
  photo_url: null,
  years_experience: 0,
  seo_title: null,
  seo_description: null,
  hero_phrases: null,
};

export default function AdminAboutPage() {
  const [values, setValues] = useState<AboutContent>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; message: string } | null>(null);
  const [newPhrase, setNewPhrase] = useState("");

  const phrases = values.hero_phrases ?? [];
  const addPhrase = () => {
    const trimmed = newPhrase.trim();
    if (!trimmed || trimmed.length > PHRASE_MAX || phrases.length >= PHRASES_MAX_COUNT) return;
    setValues((v) => ({ ...v, hero_phrases: [...phrases, trimmed] }));
    setNewPhrase("");
  };
  const removePhrase = (i: number) =>
    setValues((v) => ({ ...v, hero_phrases: phrases.filter((_, idx) => idx !== i) }));

  useEffect(() => {
    let cancelled = false;
    adminApi
      .getAbout()
      .then((a) => {
        if (!cancelled) {
          setValues(a);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setStatus({ kind: "err", message: e instanceof Error ? e.message : "Failed to load" });
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePhotoUpload = async (file: File) => {
    const result = await adminApi.uploadImage(file);
    setValues((v) => ({ ...v, photo_url: result.url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const updated = await adminApi.updateAbout(values);
      setValues(updated);
      setStatus({ kind: "ok", message: "Saved." });
    } catch (err) {
      setStatus({ kind: "err", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="About / Hero" subtitle="Content shown on the public landing page">
      {loading ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Loading...
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                type="text"
                required
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>
            <Field label="Title">
              <input
                type="text"
                required
                value={values.title}
                onChange={(e) => setValues({ ...values, title: e.target.value })}
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>
          </div>

          <Field label="Hero description">
            <textarea
              rows={3}
              value={values.hero_description}
              onChange={(e) => setValues({ ...values, hero_description: e.target.value })}
              className={`${inputCls} resize-y`}
              style={fieldStyle()}
            />
          </Field>

          {/* ── Typewriter phrases ─────────────────────────────────────── */}
          <div
            className="rounded-2xl border p-5 space-y-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-400">
                  Typewriter phrases
                </p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                  These cycle in the hero heading. Max&nbsp;{PHRASE_MAX}&nbsp;characters each,
                  up to&nbsp;{PHRASES_MAX_COUNT}&nbsp;phrases.
                </p>
              </div>
              <span
                className="shrink-0 text-xs font-mono px-2 py-0.5 rounded-full border"
                style={{
                  borderColor: "var(--border)",
                  color: phrases.length >= PHRASES_MAX_COUNT ? "#f87171" : "var(--muted-2)",
                }}
              >
                {phrases.length}/{PHRASES_MAX_COUNT}
              </span>
            </div>

            {/* Current phrases list */}
            {phrases.length > 0 ? (
              <ul className="space-y-2">
                {phrases.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border"
                    style={{ borderColor: "var(--border)", background: "var(--card)" }}
                  >
                    <span className="text-sm flex-1 font-mono truncate">{p}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-xs font-mono"
                        style={{
                          color: p.length > PHRASE_MAX * 0.85 ? "#fbbf24" : "var(--muted-2)",
                        }}
                      >
                        {p.length}/{PHRASE_MAX}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePhrase(i)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-colors hover:bg-red-500/15 hover:text-red-400"
                        style={{ color: "var(--muted-2)" }}
                        aria-label="Remove phrase"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs italic" style={{ color: "var(--muted-2)" }}>
                No phrases yet — the hero will use the built-in defaults.
              </p>
            )}

            {/* Add new phrase */}
            {phrases.length < PHRASES_MAX_COUNT && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Add a phrase…"
                      value={newPhrase}
                      maxLength={PHRASE_MAX}
                      onChange={(e) => setNewPhrase(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhrase())}
                      className={inputCls}
                      style={fieldStyle()}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addPhrase}
                    disabled={!newPhrase.trim() || newPhrase.trim().length > PHRASE_MAX}
                    className="px-4 py-2 rounded-xl text-sm font-semibold bg-yellow-400 text-black transition-all hover:bg-yellow-300 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>

                {/* Char counter + bar */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ background: "var(--border)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-150"
                      style={{
                        width: `${Math.min((newPhrase.length / PHRASE_MAX) * 100, 100)}%`,
                        background:
                          newPhrase.length > PHRASE_MAX
                            ? "#f87171"
                            : newPhrase.length > PHRASE_MAX * 0.85
                              ? "#fbbf24"
                              : "var(--accent)",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-mono shrink-0"
                    style={{
                      color:
                        newPhrase.length > PHRASE_MAX
                          ? "#f87171"
                          : newPhrase.length > PHRASE_MAX * 0.85
                            ? "#fbbf24"
                            : "var(--muted-2)",
                    }}
                  >
                    {newPhrase.length}/{PHRASE_MAX}
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* ── / Typewriter phrases ───────────────────────────────────── */}

          <Field label="Bio">
            <textarea
              rows={6}
              value={values.bio}
              onChange={(e) => setValues({ ...values, bio: e.target.value })}
              className={`${inputCls} resize-y`}
              style={fieldStyle()}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Location">
              <input
                type="text"
                value={values.location ?? ""}
                onChange={(e) =>
                  setValues({ ...values, location: e.target.value || null })
                }
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={values.email ?? ""}
                onChange={(e) => setValues({ ...values, email: e.target.value || null })}
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>
            <Field label="Years experience">
              <input
                type="number"
                min={0}
                value={values.years_experience}
                onChange={(e) =>
                  setValues({ ...values, years_experience: Number(e.target.value) || 0 })
                }
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>
          </div>

          <Field label="Profile photo">
            <div className="flex flex-wrap items-center gap-4">
              {values.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={values.photo_url}
                  alt="Profile"
                  className="h-20 w-20 rounded-2xl object-cover border"
                  style={{ borderColor: "var(--border)" }}
                />
              )}
              <input
                type="text"
                placeholder="https://..."
                value={values.photo_url ?? ""}
                onChange={(e) =>
                  setValues({ ...values, photo_url: e.target.value || null })
                }
                className={`${inputCls} flex-1 min-w-[200px]`}
                style={fieldStyle()}
              />
              <UploadButton onUpload={handlePhotoUpload} />
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="SEO title">
              <input
                type="text"
                value={values.seo_title ?? ""}
                onChange={(e) =>
                  setValues({ ...values, seo_title: e.target.value || null })
                }
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>
            <Field label="SEO description">
              <input
                type="text"
                value={values.seo_description ?? ""}
                onChange={(e) =>
                  setValues({ ...values, seo_description: e.target.value || null })
                }
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 glow-yellow"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            {status && (
              <p className={`text-sm ${status.kind === "ok" ? "text-green-400" : "text-red-400"}`}>
                {status.message}
              </p>
            )}
          </div>
        </form>
      )}
    </AdminShell>
  );
}

function fieldStyle(): React.CSSProperties {
  return { borderColor: "var(--border)", color: "var(--fg)" };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="text-xs uppercase tracking-wider"
        style={{ color: "var(--muted-2)" }}
      >
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function UploadButton({ onUpload }: { onUpload: (f: File) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <label className="cursor-pointer">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          setError(null);
          try {
            await onUpload(file);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
      <span
        className="inline-flex items-center px-4 py-2 text-xs font-medium border rounded-full transition-colors hover:border-yellow-400/50 hover:text-yellow-400"
        style={{ borderColor: "var(--border)" }}
      >
        {busy ? "Uploading..." : "Upload"}
      </span>
      {error && <span className="ml-3 text-xs text-red-400">{error}</span>}
    </label>
  );
}
