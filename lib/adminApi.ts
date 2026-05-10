const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "/api";

export interface LoginChallenge {
  step: "verify_2fa" | "setup_2fa";
  challenge_token: string;
}

export interface TotpSetup {
  secret: string;
  otpauth_url: string;
  qr_code_data_url: string;
}

export interface AdminMe {
  id: number;
  email: string;
  last_login_at: string | null;
}

export interface AdminStats {
  skills: number;
  projects: number;
  contacts: number;
  messages_total: number;
  messages_unread: number;
}

export interface SkillBrief {
  id: number;
  name: string;
  category: string;
}

export interface AdminSkill {
  id: number;
  name: string;
  icon_svg: string | null;
  category: string;
  description: string | null;
  proficiency: number;
  certificate_url: string | null;
  visible: boolean;
  display_order: number;
  project_count: number;
}

export interface SkillInput {
  name: string;
  icon_svg?: string | null;
  category: string;
  description?: string | null;
  proficiency: number;
  certificate_url?: string | null;
  visible: boolean;
  display_order: number;
}

export interface ProjectImage {
  id: number;
  image_url: string;
  display_order: number;
}

export interface AdminProject {
  id: number;
  name: string;
  description: string;
  short_description: string | null;
  date: string | null;
  live_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  visible: boolean;
  display_order: number;
  skills: SkillBrief[];
  images: ProjectImage[];
}

export interface ProjectInput {
  name: string;
  description: string;
  short_description?: string | null;
  date?: string | null;
  live_url?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  visible: boolean;
  display_order: number;
  skill_ids: number[];
}

export interface AdminContactPlatform {
  id: number;
  platform: string;
  label: string | null;
  icon: string | null;
  url: string;
  display_order: number;
  visible: boolean;
}

export interface ContactPlatformInput {
  platform: string;
  label?: string | null;
  icon?: string | null;
  url: string;
  display_order: number;
  visible: boolean;
}

export interface AdminMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface AboutContent {
  name: string;
  title: string;
  hero_description: string;
  bio: string;
  location: string | null;
  email: string | null;
  photo_url: string | null;
  years_experience: number;
  seo_title: string | null;
  seo_description: string | null;
  hero_phrases: string[] | null;
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  content_type: string;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...((init.headers as Record<string, string>) ?? {}),
  };
  if (init.body && !(init.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });
  if (!res.ok) {
    let detail = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (typeof data?.detail === "string") detail = data.detail;
    } catch {
      // body may not be JSON
    }
    const err = new Error(detail) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    request<LoginChallenge>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  setup2fa: (challenge_token: string) =>
    request<TotpSetup>("/auth/2fa/setup", {
      method: "POST",
      body: JSON.stringify({ challenge_token }),
    }),
  verify2fa: (challenge_token: string, code: string) =>
    request<AdminMe>("/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify({ challenge_token, code }),
    }),
  logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  me: () => request<AdminMe>("/auth/me"),

  // Stats
  stats: () => request<AdminStats>("/admin/stats"),

  // Skills
  listSkills: () => request<AdminSkill[]>("/admin/skills"),
  createSkill: (input: SkillInput) =>
    request<AdminSkill>("/admin/skills", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateSkill: (id: number, input: SkillInput) =>
    request<AdminSkill>(`/admin/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deleteSkill: (id: number) =>
    request<void>(`/admin/skills/${id}`, { method: "DELETE" }),

  // Projects
  listProjects: () => request<AdminProject[]>("/admin/projects"),
  createProject: (input: ProjectInput) =>
    request<AdminProject>("/admin/projects", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateProject: (id: number, input: ProjectInput) =>
    request<AdminProject>(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deleteProject: (id: number) =>
    request<void>(`/admin/projects/${id}`, { method: "DELETE" }),
  addProjectImage: (projectId: number, image_url: string, display_order = 0) =>
    request<ProjectImage>(`/admin/projects/${projectId}/images`, {
      method: "POST",
      body: JSON.stringify({ image_url, display_order }),
    }),
  deleteProjectImage: (imageId: number) =>
    request<void>(`/admin/projects/images/${imageId}`, { method: "DELETE" }),

  // Contacts
  listContacts: () => request<AdminContactPlatform[]>("/admin/contacts"),
  createContact: (input: ContactPlatformInput) =>
    request<AdminContactPlatform>("/admin/contacts", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  updateContact: (id: number, input: ContactPlatformInput) =>
    request<AdminContactPlatform>(`/admin/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  deleteContact: (id: number) =>
    request<void>(`/admin/contacts/${id}`, { method: "DELETE" }),

  // Messages
  listMessages: (unreadOnly = false) => {
    const q = unreadOnly ? "?unread_only=true" : "";
    return request<AdminMessage[]>(`/admin/messages${q}`);
  },
  getMessage: (id: number) => request<AdminMessage>(`/admin/messages/${id}`),
  markMessageRead: (id: number, read = true) =>
    request<AdminMessage>(`/admin/messages/${id}/read?read=${read}`, {
      method: "PATCH",
    }),
  deleteMessage: (id: number) =>
    request<void>(`/admin/messages/${id}`, { method: "DELETE" }),

  // About
  getAbout: () => request<AboutContent>("/admin/about"),
  updateAbout: (input: AboutContent) =>
    request<AboutContent>("/admin/about", {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  // Uploads
  uploadImage: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return request<UploadResult>("/admin/uploads", {
      method: "POST",
      body: fd,
    });
  },
};
