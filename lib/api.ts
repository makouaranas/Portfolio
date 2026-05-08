import type {
  About,
  ContactMessageAck,
  ContactMessageInput,
  ContactPlatform,
  Project,
  Skill,
} from "./types";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")) || "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  about: () => get<About>("/about"),
  skills: () => get<Skill[]>("/skills"),
  projects: () => get<Project[]>("/projects"),
  contacts: () => get<ContactPlatform[]>("/contacts"),
  sendContact: async (input: ContactMessageInput): Promise<ContactMessageAck> => {
    const res = await fetch(`${API_BASE}/contact/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      let detail = "Failed to send message";
      try {
        const data = await res.json();
        if (typeof data?.detail === "string") detail = data.detail;
      } catch {
        // fall through
      }
      throw new Error(detail);
    }
    return res.json() as Promise<ContactMessageAck>;
  },
};
