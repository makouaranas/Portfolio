"use client";

import { useEffect, useState } from "react";

import AdminShell from "../../../components/admin/AdminShell";
import Modal from "../../../components/Modal";
import { adminApi, type AdminSkill, type SkillInput } from "../../../lib/adminApi";

const inputCls =
  "w-full px-4 py-3 rounded-xl border bg-transparent text-sm transition-colors focus:outline-none focus:border-yellow-400/60";

const empty: SkillInput = {
  name: "",
  category: "",
  description: "",
  proficiency: 0,
  certificate_url: "",
  visible: true,
  display_order: 0,
};

function toInput(s: AdminSkill): SkillInput {
  return {
    name: s.name,
    icon_svg: s.icon_svg ?? "",
    category: s.category,
    description: s.description ?? "",
    proficiency: s.proficiency,
    certificate_url: s.certificate_url ?? "",
    visible: s.visible,
    display_order: s.display_order,
  };
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id: number | null; values: SkillInput } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      setSkills(await adminApi.listSkills());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const cleaned: SkillInput = {
        ...editing.values,
        icon_svg: editing.values.icon_svg || null,
        description: editing.values.description || null,
        certificate_url: editing.values.certificate_url || null,
      };
      if (editing.id == null) {
        await adminApi.createSkill(cleaned);
      } else {
        await adminApi.updateSkill(editing.id, cleaned);
      }
      setEditing(null);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this skill? This cannot be undone.")) return;
    try {
      await adminApi.deleteSkill(id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <AdminShell title="Skills" subtitle="Manage the skills shown on your portfolio">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {skills.length} total · {skills.filter((s) => s.visible).length} visible
        </p>
        <button
          type="button"
          onClick={() => setEditing({ id: null, values: { ...empty } })}
          className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all hover:scale-[1.02]"
        >
          + New skill
        </button>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Loading...
        </p>
      ) : (
        <div
          className="rounded-3xl border overflow-hidden"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left"
                style={{ background: "var(--card-2)", color: "var(--muted-2)" }}
              >
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Level</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Used in</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Visible</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr
                  key={s.id}
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-5 py-3 font-medium">{s.name}</td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>
                    {s.category}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-yellow-400">{s.proficiency}%</span>
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>
                    {s.project_count}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${s.visible ? "bg-green-500" : "bg-neutral-500"}`}
                    />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing({ id: s.id, values: toInput(s) })}
                      className="text-xs px-3 py-1.5 rounded-full border mr-2 transition-colors hover:border-yellow-400/50 hover:text-yellow-400"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-red-400/50 hover:text-red-400"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {skills.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: "var(--muted)" }}>
                    No skills yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} labelledBy="skill-form-title">
        {editing && (
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <h2 id="skill-form-title" className="text-xl font-semibold tracking-tight">
              {editing.id == null ? "Add skill" : "Edit skill"}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
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
              <Field label="Category">
                <input
                  required
                  type="text"
                  placeholder="Frontend, Backend, AI..."
                  value={editing.values.category}
                  onChange={(e) =>
                    setEditing({ ...editing, values: { ...editing.values, category: e.target.value } })
                  }
                  className={inputCls}
                  style={fieldStyle()}
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={3}
                value={editing.values.description ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, values: { ...editing.values, description: e.target.value } })
                }
                className={`${inputCls} resize-y`}
                style={fieldStyle()}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Proficiency (0-100)">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editing.values.proficiency}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      values: { ...editing.values, proficiency: Number(e.target.value) || 0 },
                    })
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

            <Field label="Certificate URL (optional)">
              <input
                type="url"
                value={editing.values.certificate_url ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    values: { ...editing.values, certificate_url: e.target.value },
                  })
                }
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>

            <Field label="Icon SVG markup (optional)">
              <textarea
                rows={3}
                placeholder="<svg ...>...</svg>"
                value={editing.values.icon_svg ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, values: { ...editing.values, icon_svg: e.target.value } })
                }
                className={`${inputCls} font-mono resize-y`}
                style={fieldStyle()}
              />
            </Field>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={editing.values.visible}
                onChange={(e) =>
                  setEditing({ ...editing, values: { ...editing.values, visible: e.target.checked } })
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
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-sm"
                style={{ color: "var(--muted)" }}
              >
                Cancel
              </button>
            </div>
          </form>
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
