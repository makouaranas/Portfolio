export interface SkillBrief {
  id: number;
  name: string;
  category: string;
}

export interface Skill {
  id: number;
  name: string;
  icon_svg: string | null;
  category: string;
  description: string | null;
  proficiency: number;
  certificate_url: string | null;
  project_count: number;
}

export interface ProjectImage {
  id: number;
  image_url: string;
  display_order: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  short_description: string | null;
  date: string | null;
  live_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  skills: SkillBrief[];
  images: ProjectImage[];
}

export interface ContactPlatform {
  id: number;
  platform: string;
  label: string | null;
  icon: string | null;
  url: string;
  display_order: number;
}

export interface About {
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

export interface ContactMessageInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessageAck {
  ok: boolean;
  id: number;
}
