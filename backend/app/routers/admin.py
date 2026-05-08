"""Admin CRUD endpoints. All require an authenticated admin session."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from ..db import get_db
from ..models import (
    About,
    AdminUser,
    ContactPlatform,
    Message,
    Project,
    ProjectImage,
    Skill,
)
from ..schemas import (
    AboutIn,
    AboutOut,
    ContactPlatformAdminOut,
    ContactPlatformIn,
    MessageOut,
    ProjectAdminOut,
    ProjectImageIn,
    ProjectImageOut,
    ProjectIn,
    SkillAdminOut,
    SkillBrief,
    SkillIn,
    StatsOut,
)
from ..security import current_admin

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(current_admin)])


# ---- Stats -----------------------------------------------------------------

@router.get("/stats", response_model=StatsOut)
def get_stats(db: Session = Depends(get_db)) -> StatsOut:
    skills = db.scalar(select(func.count(Skill.id))) or 0
    projects = db.scalar(select(func.count(Project.id))) or 0
    contacts = db.scalar(select(func.count(ContactPlatform.id))) or 0
    msgs = db.scalar(select(func.count(Message.id))) or 0
    unread = db.scalar(select(func.count(Message.id)).where(Message.read.is_(False))) or 0
    return StatsOut(
        skills=skills,
        projects=projects,
        contacts=contacts,
        messages_total=msgs,
        messages_unread=unread,
    )


# ---- Skills ----------------------------------------------------------------

def _skill_to_admin(skill: Skill, project_count: int) -> SkillAdminOut:
    return SkillAdminOut(
        id=skill.id,
        name=skill.name,
        icon_svg=skill.icon_svg,
        category=skill.category,
        description=skill.description,
        proficiency=skill.proficiency,
        certificate_url=skill.certificate_url,
        visible=skill.visible,
        display_order=skill.display_order,
        project_count=project_count,
    )


@router.get("/skills", response_model=list[SkillAdminOut])
def admin_list_skills(db: Session = Depends(get_db)) -> list[SkillAdminOut]:
    rows = db.execute(
        select(Skill, func.count(Project.id))
        .outerjoin(Skill.projects)
        .group_by(Skill.id)
        .order_by(Skill.display_order, Skill.name)
    ).all()
    return [_skill_to_admin(s, int(c or 0)) for s, c in rows]


@router.post("/skills", response_model=SkillAdminOut, status_code=201)
def admin_create_skill(payload: SkillIn, db: Session = Depends(get_db)) -> SkillAdminOut:
    if db.scalar(select(Skill).where(Skill.name == payload.name)):
        raise HTTPException(status_code=409, detail="A skill with that name already exists")
    skill = Skill(**payload.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return _skill_to_admin(skill, 0)


@router.put("/skills/{skill_id}", response_model=SkillAdminOut)
def admin_update_skill(
    skill_id: int, payload: SkillIn, db: Session = Depends(get_db)
) -> SkillAdminOut:
    skill = db.get(Skill, skill_id)
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    if payload.name != skill.name and db.scalar(
        select(Skill).where(Skill.name == payload.name, Skill.id != skill_id)
    ):
        raise HTTPException(status_code=409, detail="A skill with that name already exists")
    for k, v in payload.model_dump().items():
        setattr(skill, k, v)
    db.commit()
    db.refresh(skill)
    count = len(skill.projects)
    return _skill_to_admin(skill, count)


@router.delete("/skills/{skill_id}", status_code=204)
def admin_delete_skill(skill_id: int, db: Session = Depends(get_db)) -> None:
    skill = db.get(Skill, skill_id)
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    db.delete(skill)
    db.commit()


# ---- Projects --------------------------------------------------------------

def _project_to_admin(p: Project) -> ProjectAdminOut:
    return ProjectAdminOut(
        id=p.id,
        name=p.name,
        description=p.description,
        short_description=p.short_description,
        date=p.date,
        live_url=p.live_url,
        video_url=p.video_url,
        thumbnail_url=p.thumbnail_url,
        visible=p.visible,
        display_order=p.display_order,
        skills=[SkillBrief.model_validate(s) for s in p.skills],
        images=[
            ProjectImageOut(id=i.id, image_url=i.image_url, display_order=i.display_order)
            for i in p.images
        ],
    )


@router.get("/projects", response_model=list[ProjectAdminOut])
def admin_list_projects(db: Session = Depends(get_db)) -> list[ProjectAdminOut]:
    projects = (
        db.execute(
            select(Project)
            .options(selectinload(Project.skills), selectinload(Project.images))
            .order_by(Project.display_order, Project.id.desc())
        )
        .scalars()
        .all()
    )
    return [_project_to_admin(p) for p in projects]


def _attach_skills(project: Project, skill_ids: list[int], db: Session) -> None:
    if not skill_ids:
        project.skills = []
        return
    skills = list(db.execute(select(Skill).where(Skill.id.in_(skill_ids))).scalars())
    found_ids = {s.id for s in skills}
    missing = set(skill_ids) - found_ids
    if missing:
        raise HTTPException(status_code=400, detail=f"Unknown skill ids: {sorted(missing)}")
    project.skills = skills


@router.post("/projects", response_model=ProjectAdminOut, status_code=201)
def admin_create_project(payload: ProjectIn, db: Session = Depends(get_db)) -> ProjectAdminOut:
    data = payload.model_dump()
    skill_ids = data.pop("skill_ids", [])
    project = Project(**data)
    db.add(project)
    db.flush()
    _attach_skills(project, skill_ids, db)
    db.commit()
    db.refresh(project)
    return _project_to_admin(project)


@router.put("/projects/{project_id}", response_model=ProjectAdminOut)
def admin_update_project(
    project_id: int, payload: ProjectIn, db: Session = Depends(get_db)
) -> ProjectAdminOut:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    data = payload.model_dump()
    skill_ids = data.pop("skill_ids", [])
    for k, v in data.items():
        setattr(project, k, v)
    _attach_skills(project, skill_ids, db)
    db.commit()
    db.refresh(project)
    return _project_to_admin(project)


@router.delete("/projects/{project_id}", status_code=204)
def admin_delete_project(project_id: int, db: Session = Depends(get_db)) -> None:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()


@router.post("/projects/{project_id}/images", response_model=ProjectImageOut, status_code=201)
def admin_add_project_image(
    project_id: int, payload: ProjectImageIn, db: Session = Depends(get_db)
) -> ProjectImage:
    project = db.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    img = ProjectImage(
        project_id=project.id,
        image_url=payload.image_url,
        display_order=payload.display_order,
    )
    db.add(img)
    db.commit()
    db.refresh(img)
    return img


@router.delete("/projects/images/{image_id}", status_code=204)
def admin_delete_project_image(image_id: int, db: Session = Depends(get_db)) -> None:
    img = db.get(ProjectImage, image_id)
    if img is None:
        raise HTTPException(status_code=404, detail="Image not found")
    db.delete(img)
    db.commit()


# ---- Contacts (platforms) --------------------------------------------------

@router.get("/contacts", response_model=list[ContactPlatformAdminOut])
def admin_list_contacts(db: Session = Depends(get_db)) -> list[ContactPlatform]:
    return list(
        db.execute(
            select(ContactPlatform).order_by(ContactPlatform.display_order, ContactPlatform.platform)
        ).scalars()
    )


@router.post("/contacts", response_model=ContactPlatformAdminOut, status_code=201)
def admin_create_contact(
    payload: ContactPlatformIn, db: Session = Depends(get_db)
) -> ContactPlatform:
    if db.scalar(select(ContactPlatform).where(ContactPlatform.platform == payload.platform)):
        raise HTTPException(status_code=409, detail="A contact with that platform already exists")
    c = ContactPlatform(**payload.model_dump())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c


@router.put("/contacts/{contact_id}", response_model=ContactPlatformAdminOut)
def admin_update_contact(
    contact_id: int, payload: ContactPlatformIn, db: Session = Depends(get_db)
) -> ContactPlatform:
    c = db.get(ContactPlatform, contact_id)
    if c is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    if payload.platform != c.platform and db.scalar(
        select(ContactPlatform).where(
            ContactPlatform.platform == payload.platform, ContactPlatform.id != contact_id
        )
    ):
        raise HTTPException(status_code=409, detail="A contact with that platform already exists")
    for k, v in payload.model_dump().items():
        setattr(c, k, v)
    db.commit()
    db.refresh(c)
    return c


@router.delete("/contacts/{contact_id}", status_code=204)
def admin_delete_contact(contact_id: int, db: Session = Depends(get_db)) -> None:
    c = db.get(ContactPlatform, contact_id)
    if c is None:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(c)
    db.commit()


# ---- Messages --------------------------------------------------------------

@router.get("/messages", response_model=list[MessageOut])
def admin_list_messages(
    unread_only: bool = False, db: Session = Depends(get_db)
) -> list[Message]:
    stmt = select(Message).order_by(Message.created_at.desc())
    if unread_only:
        stmt = stmt.where(Message.read.is_(False))
    return list(db.execute(stmt).scalars())


@router.get("/messages/{message_id}", response_model=MessageOut)
def admin_get_message(message_id: int, db: Session = Depends(get_db)) -> Message:
    msg = db.get(Message, message_id)
    if msg is None:
        raise HTTPException(status_code=404, detail="Message not found")
    return msg


@router.patch("/messages/{message_id}/read", response_model=MessageOut)
def admin_mark_message_read(
    message_id: int, read: bool = True, db: Session = Depends(get_db)
) -> Message:
    msg = db.get(Message, message_id)
    if msg is None:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.read = read
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/messages/{message_id}", status_code=204)
def admin_delete_message(message_id: int, db: Session = Depends(get_db)) -> None:
    msg = db.get(Message, message_id)
    if msg is None:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(msg)
    db.commit()


# ---- About -----------------------------------------------------------------

@router.get("/about", response_model=AboutOut)
def admin_get_about(db: Session = Depends(get_db)) -> About:
    about = db.execute(select(About).order_by(About.id).limit(1)).scalar_one_or_none()
    if about is None:
        about = About()
        db.add(about)
        db.commit()
        db.refresh(about)
    return about


@router.put("/about", response_model=AboutOut)
def admin_update_about(payload: AboutIn, db: Session = Depends(get_db)) -> About:
    about = db.execute(select(About).order_by(About.id).limit(1)).scalar_one_or_none()
    if about is None:
        about = About(**payload.model_dump())
        db.add(about)
    else:
        for k, v in payload.model_dump().items():
            setattr(about, k, v)
    db.commit()
    db.refresh(about)
    return about
