from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SkillBrief(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    category: str


class SkillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    icon_svg: str | None
    category: str
    description: str | None
    proficiency: int
    certificate_url: str | None
    project_count: int = 0


class ProjectImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    image_url: str
    display_order: int


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    short_description: str | None
    date: datetime | None
    live_url: str | None
    video_url: str | None
    thumbnail_url: str | None
    skills: list[SkillBrief]
    images: list[ProjectImageOut]


class ContactPlatformOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    platform: str
    label: str | None
    icon: str | None
    url: str
    display_order: int


class AboutOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    title: str
    hero_description: str
    bio: str
    location: str | None
    email: str | None
    photo_url: str | None
    years_experience: int
    seo_title: str | None
    seo_description: str | None


class ContactMessageIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)


class ContactMessageAck(BaseModel):
    ok: bool = True
    id: int
