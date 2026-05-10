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
    hero_phrases: list[str] | None = None


class ContactMessageIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)


class ContactMessageAck(BaseModel):
    ok: bool = True
    id: int


# ---- Admin schemas ---------------------------------------------------------

class SkillAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    icon_svg: str | None
    category: str
    description: str | None
    proficiency: int
    certificate_url: str | None
    visible: bool
    display_order: int
    project_count: int = 0


class SkillIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    icon_svg: str | None = None
    category: str = Field(min_length=1, max_length=50)
    description: str | None = None
    proficiency: int = Field(ge=0, le=100, default=0)
    certificate_url: str | None = None
    visible: bool = True
    display_order: int = 0


class ProjectImageIn(BaseModel):
    image_url: str = Field(min_length=1, max_length=500)
    display_order: int = 0


class ProjectAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    short_description: str | None
    date: datetime | None
    live_url: str | None
    video_url: str | None
    thumbnail_url: str | None
    visible: bool
    display_order: int
    skills: list[SkillBrief]
    images: list[ProjectImageOut]


class ProjectIn(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    short_description: str | None = None
    date: datetime | None = None
    live_url: str | None = None
    video_url: str | None = None
    thumbnail_url: str | None = None
    visible: bool = True
    display_order: int = 0
    skill_ids: list[int] = Field(default_factory=list)


class ContactPlatformIn(BaseModel):
    platform: str = Field(min_length=1, max_length=60)
    label: str | None = None
    icon: str | None = None
    url: str = Field(min_length=1, max_length=500)
    display_order: int = 0
    visible: bool = True


class ContactPlatformAdminOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    platform: str
    label: str | None
    icon: str | None
    url: str
    display_order: int
    visible: bool


class MessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    subject: str
    message: str
    read: bool
    created_at: datetime


class AboutIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    title: str = Field(min_length=1, max_length=200)
    hero_description: str = ""
    bio: str = ""
    location: str | None = None
    email: str | None = None
    photo_url: str | None = None
    years_experience: int = Field(ge=0, default=0)
    seo_title: str | None = None
    seo_description: str | None = None
    # Each phrase max 40 chars, list max 10 items
    hero_phrases: list[str] | None = Field(None, max_length=10)


class StatsOut(BaseModel):
    skills: int
    projects: int
    contacts: int
    messages_total: int
    messages_unread: int


class UploadOut(BaseModel):
    url: str
    filename: str
    size: int
    content_type: str

