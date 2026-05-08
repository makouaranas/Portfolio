from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from ..db import get_db
from ..models import About, ContactPlatform, Message, Project, Skill
from ..schemas import (
    AboutOut,
    ContactMessageAck,
    ContactMessageIn,
    ContactPlatformOut,
    ProjectOut,
    SkillBrief,
    SkillOut,
)

router = APIRouter(tags=["public"])


@router.get("/skills", response_model=list[SkillOut])
def list_skills(db: Session = Depends(get_db)) -> list[SkillOut]:
    rows = db.execute(
        select(Skill, func.count(Project.id))
        .outerjoin(Skill.projects)
        .where(Skill.visible.is_(True))
        .group_by(Skill.id)
        .order_by(Skill.display_order, Skill.name)
    ).all()
    out: list[SkillOut] = []
    for skill, count in rows:
        out.append(
            SkillOut(
                id=skill.id,
                name=skill.name,
                icon_svg=skill.icon_svg,
                category=skill.category,
                description=skill.description,
                proficiency=skill.proficiency,
                certificate_url=skill.certificate_url,
                project_count=int(count or 0),
            )
        )
    return out


@router.get("/projects", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)) -> list[ProjectOut]:
    projects = (
        db.execute(
            select(Project)
            .where(Project.visible.is_(True))
            .options(selectinload(Project.skills), selectinload(Project.images))
            .order_by(Project.display_order, Project.date.desc().nulls_last(), Project.id.desc())
        )
        .scalars()
        .all()
    )
    return [
        ProjectOut(
            id=p.id,
            name=p.name,
            description=p.description,
            short_description=p.short_description,
            date=p.date,
            live_url=p.live_url,
            video_url=p.video_url,
            thumbnail_url=p.thumbnail_url,
            skills=[SkillBrief.model_validate(s) for s in p.skills],
            images=[
                {"id": i.id, "image_url": i.image_url, "display_order": i.display_order}
                for i in p.images
            ],
        )
        for p in projects
    ]


@router.get("/contacts", response_model=list[ContactPlatformOut])
def list_contacts(db: Session = Depends(get_db)) -> list[ContactPlatform]:
    return list(
        db.execute(
            select(ContactPlatform)
            .where(ContactPlatform.visible.is_(True))
            .order_by(ContactPlatform.display_order, ContactPlatform.platform)
        )
        .scalars()
        .all()
    )


@router.get("/about", response_model=AboutOut)
def get_about(db: Session = Depends(get_db)) -> About:
    about = db.execute(select(About).order_by(About.id).limit(1)).scalar_one_or_none()
    if about is None:
        raise HTTPException(status_code=404, detail="About content not configured")
    return about


@router.post("/contact/send", response_model=ContactMessageAck, status_code=201)
def send_contact_message(
    payload: ContactMessageIn, db: Session = Depends(get_db)
) -> ContactMessageAck:
    msg = Message(
        name=payload.name.strip(),
        email=str(payload.email).strip(),
        subject=payload.subject.strip(),
        message=payload.message.strip(),
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return ContactMessageAck(ok=True, id=msg.id)
