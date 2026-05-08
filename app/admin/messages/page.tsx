"use client";

import { useEffect, useState } from "react";

import AdminShell from "../../../components/admin/AdminShell";
import Modal from "../../../components/Modal";
import { adminApi, type AdminMessage } from "../../../lib/adminApi";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [active, setActive] = useState<AdminMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      setMessages(await adminApi.listMessages(unreadOnly));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly]);

  const open = async (m: AdminMessage) => {
    setActive(m);
    if (!m.read) {
      try {
        const updated = await adminApi.markMessageRead(m.id, true);
        setMessages((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        setActive(updated);
      } catch {
        // tolerate failure of read flag
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await adminApi.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (active?.id === id) setActive(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <AdminShell title="Messages" subtitle="Inbound messages from the contact form">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          {messages.length} {unreadOnly ? "unread" : "total"}
        </p>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="accent-yellow-400"
          />
          Unread only
        </label>
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
          {messages.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm" style={{ color: "var(--muted)" }}>
              {unreadOnly ? "No unread messages." : "No messages yet."}
            </p>
          ) : (
            <ul>
              {messages.map((m) => (
                <li
                  key={m.id}
                  className="border-t first:border-t-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <button
                    type="button"
                    onClick={() => open(m)}
                    className="w-full text-left px-5 py-4 transition-colors hover:bg-[var(--card-2)]"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${m.read ? "bg-neutral-500" : "bg-yellow-400"}`}
                      />
                      <p
                        className={`flex-1 truncate ${m.read ? "" : "font-semibold"}`}
                      >
                        {m.subject}
                      </p>
                      <span className="text-xs flex-shrink-0" style={{ color: "var(--muted-2)" }}>
                        {formatDate(m.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 ml-5 text-sm truncate" style={{ color: "var(--muted)" }}>
                      {m.name} — {m.email}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Modal open={active !== null} onClose={() => setActive(null)} labelledBy="message-title">
        {active && (
          <div className="p-8">
            <p className="text-xs tracking-[0.2em] uppercase text-yellow-400">
              {formatDate(active.created_at)}
            </p>
            <h2 id="message-title" className="mt-1 text-2xl font-semibold tracking-tight">
              {active.subject}
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              From <span className="font-semibold">{active.name}</span> &lt;
              <a className="hover:text-yellow-400" href={`mailto:${active.email}`}>
                {active.email}
              </a>
              &gt;
            </p>

            <div
              className="mt-6 p-5 rounded-2xl border whitespace-pre-line text-sm leading-relaxed"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              {active.message}
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`mailto:${active.email}?subject=Re: ${encodeURIComponent(active.subject)}`}
                className="px-5 py-2.5 rounded-full bg-yellow-400 text-black font-semibold text-sm hover:scale-[1.02] transition-all"
              >
                Reply
              </a>
              <button
                type="button"
                onClick={() => handleDelete(active.id)}
                className="px-5 py-2.5 rounded-full border text-sm transition-colors hover:border-red-400/50 hover:text-red-400"
                style={{ borderColor: "var(--border)" }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminShell>
  );
}
