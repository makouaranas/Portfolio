"use client";

import { useEffect, useState } from "react";

import AdminShell from "../../../components/admin/AdminShell";
import Modal from "../../../components/Modal";
import {
  adminApi,
  type AdminProject,
  type AdminSkill,
  type ProjectInput,
} from "../../../lib/adminApi";

const inputCls =
  "w-full px-4 py-3 rounded-xl border bg-transparent text-sm transition-colors focus:outline-none focus:border-yellow-400/60";

const empty: ProjectInput = {
  name: "",
  description: "",
  short_description: "",
  date: null,
  live_url: "",
  video_url: "",
  thumbnail_url: "",
  visible: true,
  display_order: 0,
  skill_ids: [],
};

function toInput(p: AdminProject): ProjectInput {
  return {
    name: p.name,
    description: p.description,
    short_description: p.short_description ?? "",
    date: p.date,
    live_url: p.live_url ?? "",
    video_url: p.video_url ?? "",
    thumbnail_url: p.thumbnail_url ?? "",
    visible: p.visible,
    display_order: p.display_order,
    skill_ids: p.skills.map((s) => s.id),
  };
}

function fmtDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{
    id: number | null;
    values: ProjectInput;
    images: AdminProject["images"];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const [ps, sk] = await Promise.all([adminApi.listProjects(), adminApi.listSkills()]);
      setProjects(ps);
      setSkills(sk);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const startEdit = (p: AdminProject) =>
    setEditing({ id: p.id, values: toInput(p), images: p.images });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const cleaned: ProjectInput = {
        ...editing.values,
        short_description: editing.values.short_description || null,
        live_url: editing.values.live_url || null,
        video_url: editing.values.video_url || null,
        thumbnail_url: editing.values.thumbnail_url || null,
        date: editing.values.date || null,
      };
      let saved: AdminProject;
      if (editing.id == null) {
        saved = await adminApi.createProject(cleaned);
      } else {
        saved = await adminApi.updateProject(editing.id, cleaned);
      }
      // Keep modal open for image management after first create.
      setEditing({ id: saved.id, values: toInput(saved), images: saved.images });
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this project? Images will also be removed.")) return;
    try {
      await adminApi.deleteProject(id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!editing) return;
    const result = await adminApi.uploadImage(file);
    setEditing({
      ...editing,
      values: { ...editing.values, thumbnail_url: result.url },
    });
  };

  const handleGalleryUpload = async (file: File) => {
    if (!editing || editing.id == null) return;
    setGalleryUploading(true);
    try {
      const upload = await adminApi.uploadImage(file);
      const img = await adminApi.addProjectImage(editing.id, upload.url, editing.images.length);
      setEditing({ ...editing, images: [...editing.images, img] });
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleDeleteImage = async (imgId: number) => {
    if (!editing) return;
    await adminApi.deleteProjectImage(imgId);
    setEditing({ ...editing, images: editing.images.filter((i) => i.id !== imgId) });
  };

  const toggleSkill = (id: number) => {
    if (!editing) return;
    const has = editing.values.skill_ids.includes(id);
    setEditing({
      ...editing,
      values: {
        ...editing.values,
        skill_ids: has
          ? editing.values.skill_ids.filter((x) => x !== id)
          : [...editing.values.skill_ids, id],
      },
    });
  };

  return (
    <AdminShell title="Projects" subtitle="Featured work shown on the public portfolio">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {projects.length} total · {projects.filter((p) => p.visible).length} visible
        </p>
        <button
          type="button"
          onClick={() =>
            setEditing({ id: null, values: { ...empty }, images: [] })
          }
          className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all hover:scale-[1.02]"
        >
          + New project
        </button>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Loading...
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border overflow-hidden flex flex-col"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              {p.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.thumbnail_url}
                  alt={p.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 grid place-items-center text-xs" style={{ color: "var(--muted-2)" }}>
                  No thumbnail
                </div>
              )}
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold tracking-tight">{p.name}</h3>
                  <span
                    title={p.visible ? "Visible" : "Hidden"}
                    className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${p.visible ? "bg-green-500" : "bg-neutral-500"}`}
                  />
                </div>
                <p className="mt-2 text-xs line-clamp-2" style={{ color: "var(--muted)" }}>
                  {p.short_description ?? p.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full border"
                      style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                    >
                      {s.name}
                    </span>
                  ))}
                  {p.skills.length > 3 && (
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>
                      +{p.skills.length - 3}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-yellow-400/50 hover:text-yellow-400"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-red-400/50 hover:text-red-400"
                    style={{ borderColor: "var(--border)" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="col-span-full text-center text-sm py-12" style={{ color: "var(--muted)" }}>
              No projects yet.
            </p>
          )}
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} labelledBy="project-form-title">
        {editing && (
          <div className="p-8 space-y-5">
            <h2 id="project-form-title" className="text-xl font-semibold tracking-tight">
              {editing.id == null ? "Add project" : "Edit project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Name">
                <input
                  required
                  type="text"
                  value={editing.values.name}
                  onChange={(e) =>
                    setEditing({ ...editing, values: { ...editing.values, name: e.target.value } })
                  }
                  className={inputCls}
                  style={fieldStyle()}
                />
              </Field>

              <Field label="Short description (one-liner shown on the card)">
                <input
                  type="text"
                  value={editing.values.short_description ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      values: { ...editing.values, short_description: e.target.value },
                    })
                  }
                  className={inputCls}
                  style={fieldStyle()}
                />
              </Field>

              <Field label="Description">
                <textarea
                  required
                  rows={5}
                  value={editing.values.description}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      values: { ...editing.values, description: e.target.value },
                    })
                  }
                  className={`${inputCls} resize-y`}
                  style={fieldStyle()}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Date">
                  <input
                    type="date"
                    value={fmtDateInput(editing.values.date)}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        values: {
                          ...editing.values,
                          date: e.target.value
                            ? new Date(e.target.value + "T00:00:00Z").toISOString()
                            : null,
                        },
                      })
                    }
                    className={inputCls}
                    style={fieldStyle()}
                  />
                </Field>
                <Field label="Live URL">
                  <input
                    type="url"
                    value={editing.values.live_url ?? ""}
                    onChange={(e) =>
                      setEditing({ ...editing, values: { ...editing.values, live_url: e.target.value } })
                    }
                    className={inputCls}
                    style={fieldStyle()}
                  />
                </Field>
                <Field label="Display order">
                  <input
                    type="number"
                    value={editing.values.display_order}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        values: { ...editing.values, display_order: Number(e.target.value) || 0 },
                      })
                    }
                    className={inputCls}
                    style={fieldStyle()}
                  />
                </Field>
              </div>

              <Field label="Demo video URL (YouTube / Vimeo)">
                <input
                  type="url"
                  value={editing.values.video_url ?? ""}
                  onChange={(e) =>
                    setEditing({ ...editing, values: { ...editing.values, video_url: e.target.value } })
                  }
                  className={inputCls}
                  style={fieldStyle()}
                />
              </Field>

              <Field label="Thumbnail">
                <div className="flex flex-wrap items-center gap-3">
                  {editing.values.thumbnail_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editing.values.thumbnail_url}
                      alt="Thumbnail"
                      className="h-16 w-24 rounded-xl object-cover border"
                      style={{ borderColor: "var(--border)" }}
                    />
                  )}
                  <input
                    type="text"
                    placeholder="https://..."
                    value={editing.values.thumbnail_url ?? ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        values: { ...editing.values, thumbnail_url: e.target.value },
                      })
                    }
                    className={`${inputCls} flex-1 min-w-[200px]`}
                    style={fieldStyle()}
                  />
                  <UploadButton onUpload={handleThumbnailUpload} />
                </div>
              </Field>

              <Field label="Skills used">
                <div
                  className="rounded-xl border p-3 max-h-48 overflow-y-auto flex flex-wrap gap-2"
                  style={{ borderColor: "var(--border)" }}
                >
                  {skills.map((s) => {
                    const active = editing.values.skill_ids.includes(s.id);
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => toggleSkill(s.id)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          active
                            ? "bg-yellow-400 text-black border-yellow-400"
                            : "hover:border-yellow-400/50"
                        }`}
                        style={!active ? { borderColor: "var(--border)" } : undefined}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                  {skills.length === 0 && (
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      No skills yet — add some on the Skills page first.
                    </p>
                  )}
                </div>
              </Field>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.values.visible}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      values: { ...editing.values, visible: e.target.checked },
                    })
                  }
                  className="accent-yellow-400"
                />
                Visible on public portfolio
              </label>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {saving ? "Saving..." : editing.id == null ? "Create" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Close
                </button>
              </div>
            </form>

            {editing.id != null && (
              <div className="pt-6 border-t" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-sm font-semibold tracking-tight">Gallery</h3>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Images shown in the project modal on the public site.
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {editing.images.map((img) => (
                    <div
                      key={img.id}
                      className="relative h-20 w-32 rounded-xl overflow-hidden border group"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        aria-label="Remove image"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <UploadButton
                    label={galleryUploading ? "Uploading..." : "+ Add image"}
                    onUpload={handleGalleryUpload}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}

function fieldStyle(): React.CSSProperties {
  return { borderColor: "var(--border)", color: "var(--fg)" };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider" style={{ color: "var(--muted-2)" }}>
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function UploadButton({
  onUpload,
  label = "Upload",
}: {
  onUpload: (f: File) => Promise<void>;
  label?: string;
}) {
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
        {busy ? "Uploading..." : label}
      </span>
      {error && <span className="ml-3 text-xs text-red-400">{error}</span>}
    </label>
  );
}
