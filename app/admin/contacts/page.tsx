"use client";

import { useEffect, useState } from "react";

import AdminShell from "../../../components/admin/AdminShell";
import Modal from "../../../components/Modal";
import {
  adminApi,
  type AdminContactPlatform,
  type ContactPlatformInput,
} from "../../../lib/adminApi";

const inputCls =
  "w-full px-4 py-3 rounded-xl border bg-transparent text-sm transition-colors focus:outline-none focus:border-yellow-400/60";

const empty: ContactPlatformInput = {
  platform: "",
  label: "",
  icon: "",
  url: "",
  display_order: 0,
  visible: true,
};

function toInput(c: AdminContactPlatform): ContactPlatformInput {
  return {
    platform: c.platform,
    label: c.label ?? "",
    icon: c.icon ?? "",
    url: c.url,
    display_order: c.display_order,
    visible: c.visible,
  };
}

export default function AdminContactsPage() {
  const [items, setItems] = useState<AdminContactPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id: number | null; values: ContactPlatformInput } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      setItems(await adminApi.listContacts());
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
      const cleaned: ContactPlatformInput = {
        ...editing.values,
        label: editing.values.label || null,
        icon: editing.values.icon || null,
      };
      if (editing.id == null) {
        await adminApi.createContact(cleaned);
      } else {
        await adminApi.updateContact(editing.id, cleaned);
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
    if (!window.confirm("Delete this contact platform?")) return;
    try {
      await adminApi.deleteContact(id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <AdminShell title="Contact Platforms" subtitle="Links shown in the public contact section">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {items.length} total · {items.filter((c) => c.visible).length} visible
        </p>
        <button
          type="button"
          onClick={() => setEditing({ id: null, values: { ...empty } })}
          className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-semibold text-sm transition-all hover:scale-[1.02]"
        >
          + New platform
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
              <tr className="text-left" style={{ background: "var(--card-2)", color: "var(--muted-2)" }}>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Platform</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Label</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">URL</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Order</th>
                <th className="px-5 py-3 text-xs uppercase tracking-wider">Visible</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-5 py-3 font-medium">{c.platform}</td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>
                    {c.label ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:underline truncate inline-block max-w-[260px]"
                    >
                      {c.url}
                    </a>
                  </td>
                  <td className="px-5 py-3" style={{ color: "var(--muted)" }}>
                    {c.display_order}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${c.visible ? "bg-green-500" : "bg-neutral-500"}`}
                    />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => setEditing({ id: c.id, values: toInput(c) })}
                      className="text-xs px-3 py-1.5 rounded-full border mr-2 transition-colors hover:border-yellow-400/50 hover:text-yellow-400"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-red-400/50 hover:text-red-400"
                      style={{ borderColor: "var(--border)" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: "var(--muted)" }}>
                    No contact platforms yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={editing !== null} onClose={() => setEditing(null)} labelledBy="contact-form-title">
        {editing && (
          <form onSubmit={handleSubmit} className="p-8 space-y-4">
            <h2 id="contact-form-title" className="text-xl font-semibold tracking-tight">
              {editing.id == null ? "Add platform" : "Edit platform"}
            </h2>

            <Field label="Platform key (e.g. github, linkedin)">
              <input
                required
                type="text"
                value={editing.values.platform}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    values: { ...editing.values, platform: e.target.value.toLowerCase() },
                  })
                }
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>

            <Field label="Label (optional, shown to users)">
              <input
                type="text"
                value={editing.values.label ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, values: { ...editing.values, label: e.target.value } })
                }
                className={inputCls}
                style={fieldStyle()}
              />
            </Field>

            <Field label="URL">
              <input
                required
                type="url"
                placeholder="https://github.com/yourname"
                value={editing.values.url}
                onChange={(e) =>
                  setEditing({ ...editing, values: { ...editing.values, url: e.target.value } })
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

            <Field label="Icon SVG (optional)">
              <textarea
                rows={3}
                placeholder="<svg ...>...</svg>"
                value={editing.values.icon ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, values: { ...editing.values, icon: e.target.value } })
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
