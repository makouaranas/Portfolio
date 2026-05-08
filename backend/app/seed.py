"""Seed the database with starter content for the public portfolio.

Run with:  uv run python -m app.seed
Idempotent: skipped if any skills, projects, contacts, or about row already exists.
"""

from datetime import datetime, timezone

from sqlalchemy import select

from .db import Base, SessionLocal, engine
from .models import About, ContactPlatform, Project, ProjectImage, Skill


SKILLS = [
    # Frontend
    {"name": "React / Next.js", "category": "Frontend", "proficiency": 92,
     "description": "Building dynamic, performant SPAs and statically exported sites with the App Router."},
    {"name": "TypeScript", "category": "Frontend", "proficiency": 88,
     "description": "Strongly-typed JavaScript across the stack — frontend components, API contracts, and Node services."},
    {"name": "Tailwind CSS", "category": "Frontend", "proficiency": 95,
     "description": "Utility-first styling for rapid, consistent, fully responsive UIs."},
    {"name": "Framer Motion", "category": "Frontend", "proficiency": 80,
     "description": "Production-grade interaction and scroll animations."},
    # Backend
    {"name": "Python / FastAPI", "category": "Backend", "proficiency": 85,
     "description": "Async APIs, validation with Pydantic, SQLAlchemy ORM, JWT auth."},
    {"name": "Node.js", "category": "Backend", "proficiency": 82,
     "description": "REST and realtime services, tooling, and CLIs."},
    {"name": "PostgreSQL", "category": "Backend", "proficiency": 80,
     "description": "Schema design, migrations, and query optimization."},
    {"name": "REST & GraphQL", "category": "Backend", "proficiency": 78,
     "description": "API design with clear contracts, pagination, and auth flows."},
    # AI / RPA
    {"name": "AI / LLM Integration", "category": "AI", "proficiency": 80,
     "description": "Building agentic and chat-style features with OpenAI and Anthropic APIs."},
    {"name": "RPA / Automation", "category": "AI", "proficiency": 78,
     "description": "Process automation across web and desktop tooling."},
    # Electrical
    {"name": "Electrical Systems", "category": "Electrical", "proficiency": 85,
     "description": "Power, control, and instrumentation — formal engineering background."},
    {"name": "Embedded / IoT", "category": "Electrical", "proficiency": 75,
     "description": "Microcontrollers, sensors, and connected device prototypes."},
    # Tools
    {"name": "Git & GitHub", "category": "Tools", "proficiency": 90,
     "description": "Workflow design, code review, and CI/CD with GitHub Actions."},
    {"name": "Docker", "category": "Tools", "proficiency": 75,
     "description": "Containerizing services for consistent dev and deploy environments."},
    {"name": "Linux / Nginx", "category": "Tools", "proficiency": 80,
     "description": "Self-hosted infrastructure on Ubuntu with Nginx + Let's Encrypt."},
    {"name": "CI / CD", "category": "Tools", "proficiency": 78,
     "description": "GitHub Actions pipelines for build, test, and deploy."},
]


PROJECTS = [
    {
        "name": "Portfolio + Admin Panel",
        "short_description": "Self-hosted portfolio with a private admin panel — Next.js static export, FastAPI, Oracle Cloud.",
        "description": (
            "A complete portfolio platform deployed across two Oracle Cloud servers: a public "
            "Next.js static site at makouaranas.site and a JWT/2FA-protected admin panel at "
            "admin.makouaranas.site, both backed by a FastAPI API on a private subnet. "
            "Includes Skills, Projects, Contacts, Kanban, and Clients management."
        ),
        "skills": ["React / Next.js", "TypeScript", "Tailwind CSS", "Python / FastAPI",
                   "PostgreSQL", "Linux / Nginx", "CI / CD"],
        "thumbnail_url": "https://picsum.photos/seed/portfolio-platform/800/500.jpg",
        "live_url": "https://makouaranas.site",
        "date": datetime(2026, 5, 1, tzinfo=timezone.utc),
    },
    {
        "name": "AI Chat Interface",
        "short_description": "Streaming conversational UI with markdown rendering and history.",
        "description": (
            "A conversational interface that streams responses from large language models, "
            "renders rich markdown and code, and persists conversation history. "
            "Built with Next.js, the Vercel AI SDK, and a small FastAPI orchestration layer."
        ),
        "skills": ["React / Next.js", "TypeScript", "AI / LLM Integration", "Tailwind CSS"],
        "thumbnail_url": "https://picsum.photos/seed/ai-chat-ui/800/500.jpg",
        "date": datetime(2026, 2, 15, tzinfo=timezone.utc),
    },
    {
        "name": "RPA Automation Suite",
        "short_description": "Cross-platform automation toolkit for repeatable business workflows.",
        "description": (
            "A modular RPA platform that automates a chain of web and desktop tasks for "
            "reporting and data entry. Includes a scheduler, retry logic, and a small dashboard "
            "to monitor runs."
        ),
        "skills": ["RPA / Automation", "Python / FastAPI", "Node.js"],
        "thumbnail_url": "https://picsum.photos/seed/rpa-suite/800/500.jpg",
        "date": datetime(2025, 11, 10, tzinfo=timezone.utc),
    },
    {
        "name": "Embedded Sensor Dashboard",
        "short_description": "Real-time telemetry from microcontrollers, visualized in the browser.",
        "description": (
            "A demonstrator that streams sensor data from an ESP32 microcontroller through MQTT "
            "to a Node.js gateway and a React dashboard. Charts, thresholds, and alerts surface "
            "live measurements."
        ),
        "skills": ["Embedded / IoT", "Electrical Systems", "Node.js", "React / Next.js"],
        "thumbnail_url": "https://picsum.photos/seed/iot-dashboard/800/500.jpg",
        "date": datetime(2025, 7, 22, tzinfo=timezone.utc),
    },
]


CONTACTS = [
    {"platform": "email", "label": "Email", "url": "mailto:makouaranass@gmail.com", "display_order": 0},
    {"platform": "github", "label": "GitHub", "url": "https://github.com/", "display_order": 1},
    {"platform": "linkedin", "label": "LinkedIn", "url": "https://www.linkedin.com/", "display_order": 2},
    {"platform": "whatsapp", "label": "WhatsApp", "url": "https://wa.me/", "display_order": 3},
]


ABOUT = {
    "name": "MAKOUAR Anas",
    "title": "Electrical Engineer & Full Stack Developer",
    "hero_description": (
        "I build performant, beautifully-crafted web apps and bring an electrical engineering "
        "mindset to every system I design — from the database up to the final pixel."
    ),
    "bio": (
        "I'm an electrical engineer who fell in love with software. Today I work across the full "
        "stack — React and Next.js on the front, FastAPI and PostgreSQL on the back — and I lean "
        "on my engineering background whenever a project meets the physical world: IoT, "
        "instrumentation, automation. I care about clean code, accessible UI, and shipping things "
        "that actually feel good to use."
    ),
    "location": "Morocco",
    "email": "makouaranass@gmail.com",
    "photo_url": "https://picsum.photos/seed/your-face/600/600.jpg",
    "years_experience": 3,
    "seo_title": "MAKOUAR Anas — Electrical Engineer & Full Stack Developer",
    "seo_description": (
        "Portfolio of MAKOUAR Anas — full-stack web development, AI integration, and embedded "
        "systems."
    ),
}


def seed() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.execute(select(Skill).limit(1)).first()
        if existing:
            print("Skills already exist — skipping seed.")
            return

        skill_objs: dict[str, Skill] = {}
        for order, data in enumerate(SKILLS):
            s = Skill(display_order=order, **data)
            db.add(s)
            skill_objs[s.name] = s
        db.flush()

        for order, data in enumerate(PROJECTS):
            skills = [skill_objs[name] for name in data.pop("skills")]
            p = Project(display_order=order, **data, skills=skills)
            db.add(p)
            db.flush()
            db.add(
                ProjectImage(
                    project_id=p.id,
                    image_url=p.thumbnail_url,
                    display_order=0,
                )
            )

        for data in CONTACTS:
            db.add(ContactPlatform(**data))

        db.add(About(**ABOUT))

        db.commit()
        print("Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
