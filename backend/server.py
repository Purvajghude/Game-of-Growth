from fastapi import FastAPI, APIRouter, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import base64
import hashlib
import hmac
import logging
import time
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Game of Growth API")
api_router = APIRouter(prefix="/api")


# ============ Models ============
class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = ""
    phone: Optional[str] = ""
    source: Optional[str] = "Website"
    status: str = "new"  # new | contacted | qualified | won | lost
    value: Optional[float] = 0
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LeadCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = ""
    phone: Optional[str] = ""
    source: Optional[str] = "Website"
    status: Optional[str] = "new"
    value: Optional[float] = 0
    notes: Optional[str] = ""

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    value: Optional[float] = None
    notes: Optional[str] = None


class PipelineItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    client: Optional[str] = ""
    value: Optional[float] = 0
    stage: str = "discovery"  # discovery | proposal | negotiation | won | lost
    owner: Optional[str] = ""
    due_date: Optional[str] = None
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PipelineCreate(BaseModel):
    title: str
    client: Optional[str] = ""
    value: Optional[float] = 0
    stage: Optional[str] = "discovery"
    owner: Optional[str] = ""
    due_date: Optional[str] = None
    notes: Optional[str] = ""

class PipelineUpdate(BaseModel):
    title: Optional[str] = None
    client: Optional[str] = None
    value: Optional[float] = None
    stage: Optional[str] = None
    owner: Optional[str] = None
    due_date: Optional[str] = None
    notes: Optional[str] = None


class ContentEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    platform: str = "Instagram"
    date: str  # YYYY-MM-DD
    status: str = "draft"  # draft | scheduled | published
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContentEventCreate(BaseModel):
    title: str
    platform: Optional[str] = "Instagram"
    date: str
    status: Optional[str] = "draft"
    notes: Optional[str] = ""

class ContentEventUpdate(BaseModel):
    title: Optional[str] = None
    platform: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    company: Optional[str] = ""
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = ""
    message: str


# ============ Team auth (HMAC-signed tokens, stdlib only) ============
# Credentials come from backend/.env:
#   AUTH_SECRET=<long random string>
#   TEAM_USERS=purvaj:changeme1,member2:changeme2,member3:changeme3,member4:changeme4
AUTH_SECRET = os.environ.get("AUTH_SECRET", "gog-dev-secret-change-me")
TOKEN_TTL_SECONDS = 60 * 60 * 24 * 14  # 14 days


def _team_users() -> dict:
    raw = os.environ.get(
        "TEAM_USERS",
        "purvaj:gogrow2026,member2:gogrow2026,member3:gogrow2026,member4:gogrow2026",
    )
    users = {}
    for pair in raw.split(","):
        if ":" in pair:
            u, p = pair.split(":", 1)
            users[u.strip().lower()] = p.strip()
    return users


def _sign(payload: str) -> str:
    return hmac.new(AUTH_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()


def _make_token(username: str) -> str:
    payload = f"{username}|{int(time.time()) + TOKEN_TTL_SECONDS}"
    encoded = base64.urlsafe_b64encode(payload.encode()).decode()
    return f"{encoded}.{_sign(payload)}"


def _verify_token(token: str) -> Optional[str]:
    try:
        encoded, sig = token.rsplit(".", 1)
        payload = base64.urlsafe_b64decode(encoded.encode()).decode()
        if not hmac.compare_digest(_sign(payload), sig):
            return None
        username, expiry = payload.rsplit("|", 1)
        if int(expiry) < time.time():
            return None
        return username
    except Exception:
        return None


class LoginPayload(BaseModel):
    username: str
    password: str


@api_router.post("/auth/login")
async def auth_login(payload: LoginPayload):
    users = _team_users()
    username = payload.username.strip().lower()
    expected = users.get(username)
    if expected is None or not hmac.compare_digest(expected, payload.password):
        raise HTTPException(401, "Wrong username or password")
    return {"token": _make_token(username), "user": {"username": username}}


@api_router.get("/auth/me")
async def auth_me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Not signed in")
    username = _verify_token(authorization.removeprefix("Bearer "))
    if not username:
        raise HTTPException(401, "Session expired")
    return {"user": {"username": username}}


# ============ Helpers ============
def _hydrate(doc):
    if doc and isinstance(doc.get('created_at'), str):
        try:
            doc['created_at'] = datetime.fromisoformat(doc['created_at'])
        except Exception:
            pass
    return doc


# ============ Health ============
@api_router.get("/")
async def root():
    return {"service": "Game of Growth API", "status": "ok"}


# ============ Leads ============
@api_router.get("/leads", response_model=List[Lead])
async def list_leads():
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [_hydrate(d) for d in docs]

@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.leads.insert_one(doc)
    return lead

@api_router.patch("/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, payload: LeadUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "No fields to update")
    res = await db.leads.find_one_and_update(
        {"id": lead_id}, {"$set": update},
        return_document=True, projection={"_id": 0}
    )
    if not res:
        raise HTTPException(404, "Lead not found")
    return _hydrate(res)

@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    res = await db.leads.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Lead not found")
    return {"deleted": True, "id": lead_id}


# ============ Pipeline ============
@api_router.get("/pipeline", response_model=List[PipelineItem])
async def list_pipeline():
    docs = await db.pipeline.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [_hydrate(d) for d in docs]

@api_router.post("/pipeline", response_model=PipelineItem)
async def create_pipeline(payload: PipelineCreate):
    item = PipelineItem(**payload.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.pipeline.insert_one(doc)
    return item

@api_router.patch("/pipeline/{item_id}", response_model=PipelineItem)
async def update_pipeline(item_id: str, payload: PipelineUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "No fields to update")
    res = await db.pipeline.find_one_and_update(
        {"id": item_id}, {"$set": update},
        return_document=True, projection={"_id": 0}
    )
    if not res:
        raise HTTPException(404, "Pipeline item not found")
    return _hydrate(res)

@api_router.delete("/pipeline/{item_id}")
async def delete_pipeline(item_id: str):
    res = await db.pipeline.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Pipeline item not found")
    return {"deleted": True, "id": item_id}


# ============ Content Calendar ============
@api_router.get("/content", response_model=List[ContentEvent])
async def list_content():
    docs = await db.content.find({}, {"_id": 0}).sort("date", 1).to_list(1000)
    return [_hydrate(d) for d in docs]

@api_router.post("/content", response_model=ContentEvent)
async def create_content(payload: ContentEventCreate):
    item = ContentEvent(**payload.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.content.insert_one(doc)
    return item

@api_router.patch("/content/{item_id}", response_model=ContentEvent)
async def update_content(item_id: str, payload: ContentEventUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "No fields to update")
    res = await db.content.find_one_and_update(
        {"id": item_id}, {"$set": update},
        return_document=True, projection={"_id": 0}
    )
    if not res:
        raise HTTPException(404, "Content event not found")
    return _hydrate(res)

@api_router.delete("/content/{item_id}")
async def delete_content(item_id: str):
    res = await db.content.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Content event not found")
    return {"deleted": True, "id": item_id}


# ============ Contact (from landing) ============
@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(payload: ContactCreate):
    msg = ContactMessage(**payload.model_dump())
    doc = msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    # also auto-create a lead
    lead = Lead(name=payload.name, email=payload.email, company=payload.company or "", notes=payload.message, source="Landing Contact")
    ldoc = lead.model_dump()
    ldoc['created_at'] = ldoc['created_at'].isoformat()
    await db.leads.insert_one(ldoc)
    return msg

@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contact():
    docs = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [_hydrate(d) for d in docs]


# ============ Projects ============
class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    client: Optional[str] = ""
    project_type: str = "Brand"  # Brand | Web | Motion | Strategy | Content | Other
    status: str = "briefing"  # briefing | in-progress | review | delivered | archived
    budget: Optional[float] = 0
    deadline: Optional[str] = None
    team: Optional[List[str]] = []
    progress: Optional[int] = 0  # 0-100
    description: Optional[str] = ""
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectCreate(BaseModel):
    title: str
    client: Optional[str] = ""
    project_type: Optional[str] = "Brand"
    status: Optional[str] = "briefing"
    budget: Optional[float] = 0
    deadline: Optional[str] = None
    team: Optional[List[str]] = []
    progress: Optional[int] = 0
    description: Optional[str] = ""
    notes: Optional[str] = ""

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    client: Optional[str] = None
    project_type: Optional[str] = None
    status: Optional[str] = None
    budget: Optional[float] = None
    deadline: Optional[str] = None
    team: Optional[List[str]] = None
    progress: Optional[int] = None
    description: Optional[str] = None
    notes: Optional[str] = None


@api_router.get("/projects", response_model=List[Project])
async def list_projects():
    docs = await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [_hydrate(d) for d in docs]

@api_router.post("/projects", response_model=Project)
async def create_project(payload: ProjectCreate):
    item = Project(**payload.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.projects.insert_one(doc)
    return item

@api_router.patch("/projects/{item_id}", response_model=Project)
async def update_project(item_id: str, payload: ProjectUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "No fields to update")
    res = await db.projects.find_one_and_update(
        {"id": item_id}, {"$set": update},
        return_document=True, projection={"_id": 0}
    )
    if not res:
        raise HTTPException(404, "Project not found")
    return _hydrate(res)

@api_router.delete("/projects/{item_id}")
async def delete_project(item_id: str):
    res = await db.projects.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Project not found")
    return {"deleted": True, "id": item_id}


# ============ Invoices ============
class InvoiceLineItem(BaseModel):
    description: str = ""
    quantity: float = 1
    rate: float = 0

class Invoice(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    invoice_number: Optional[str] = ""
    client: str
    project: Optional[str] = ""
    status: str = "draft"  # draft | sent | paid | overdue
    line_items: List[InvoiceLineItem] = []
    tax_rate: Optional[float] = 0  # percentage
    notes: Optional[str] = ""
    due_date: Optional[str] = None
    paid_date: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InvoiceCreate(BaseModel):
    invoice_number: Optional[str] = ""
    client: str
    project: Optional[str] = ""
    status: Optional[str] = "draft"
    line_items: Optional[List[InvoiceLineItem]] = []
    tax_rate: Optional[float] = 0
    notes: Optional[str] = ""
    due_date: Optional[str] = None

class InvoiceUpdate(BaseModel):
    invoice_number: Optional[str] = None
    client: Optional[str] = None
    project: Optional[str] = None
    status: Optional[str] = None
    line_items: Optional[List[InvoiceLineItem]] = None
    tax_rate: Optional[float] = None
    notes: Optional[str] = None
    due_date: Optional[str] = None
    paid_date: Optional[str] = None


@api_router.get("/invoices", response_model=List[Invoice])
async def list_invoices():
    docs = await db.invoices.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [_hydrate(d) for d in docs]

@api_router.post("/invoices", response_model=Invoice)
async def create_invoice(payload: InvoiceCreate):
    item = Invoice(**payload.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    # serialize line_items
    doc['line_items'] = [li.model_dump() if hasattr(li, 'model_dump') else li for li in doc.get('line_items', [])]
    await db.invoices.insert_one(doc)
    return item

@api_router.patch("/invoices/{item_id}", response_model=Invoice)
async def update_invoice(item_id: str, payload: InvoiceUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if 'line_items' in update and update['line_items'] is not None:
        update['line_items'] = [li.model_dump() if hasattr(li, 'model_dump') else li for li in update['line_items']]
    if not update:
        raise HTTPException(400, "No fields to update")
    res = await db.invoices.find_one_and_update(
        {"id": item_id}, {"$set": update},
        return_document=True, projection={"_id": 0}
    )
    if not res:
        raise HTTPException(404, "Invoice not found")
    return _hydrate(res)

@api_router.delete("/invoices/{item_id}")
async def delete_invoice(item_id: str):
    res = await db.invoices.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Invoice not found")
    return {"deleted": True, "id": item_id}


# ============ Tasks ============
class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    assignee: Optional[str] = ""
    priority: str = "medium"  # low | medium | high | urgent
    status: str = "todo"  # todo | in-progress | review | done
    due_date: Optional[str] = None
    tags: Optional[List[str]] = []
    description: Optional[str] = ""
    project: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(BaseModel):
    title: str
    assignee: Optional[str] = ""
    priority: Optional[str] = "medium"
    status: Optional[str] = "todo"
    due_date: Optional[str] = None
    tags: Optional[List[str]] = []
    description: Optional[str] = ""
    project: Optional[str] = ""

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    assignee: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None
    tags: Optional[List[str]] = None
    description: Optional[str] = None
    project: Optional[str] = None


@api_router.get("/tasks", response_model=List[Task])
async def list_tasks():
    docs = await db.tasks.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [_hydrate(d) for d in docs]

@api_router.post("/tasks", response_model=Task)
async def create_task(payload: TaskCreate):
    item = Task(**payload.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.tasks.insert_one(doc)
    return item

@api_router.patch("/tasks/{item_id}", response_model=Task)
async def update_task(item_id: str, payload: TaskUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "No fields to update")
    res = await db.tasks.find_one_and_update(
        {"id": item_id}, {"$set": update},
        return_document=True, projection={"_id": 0}
    )
    if not res:
        raise HTTPException(404, "Task not found")
    return _hydrate(res)

@api_router.delete("/tasks/{item_id}")
async def delete_task(item_id: str):
    res = await db.tasks.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Task not found")
    return {"deleted": True, "id": item_id}


# ============ Notes ============
class Note(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content: Optional[str] = ""
    category: Optional[str] = "General"
    project: Optional[str] = ""
    pinned: Optional[bool] = False
    tags: Optional[List[str]] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NoteCreate(BaseModel):
    title: str
    content: Optional[str] = ""
    category: Optional[str] = "General"
    project: Optional[str] = ""
    pinned: Optional[bool] = False
    tags: Optional[List[str]] = []

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    project: Optional[str] = None
    pinned: Optional[bool] = None
    tags: Optional[List[str]] = None


@api_router.get("/notes", response_model=List[Note])
async def list_notes():
    docs = await db.notes.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [_hydrate(d) for d in docs]

@api_router.post("/notes", response_model=Note)
async def create_note(payload: NoteCreate):
    item = Note(**payload.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.notes.insert_one(doc)
    return item

@api_router.patch("/notes/{item_id}", response_model=Note)
async def update_note(item_id: str, payload: NoteUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "No fields to update")
    update['updated_at'] = datetime.now(timezone.utc).isoformat()
    res = await db.notes.find_one_and_update(
        {"id": item_id}, {"$set": update},
        return_document=True, projection={"_id": 0}
    )
    if not res:
        raise HTTPException(404, "Note not found")
    return _hydrate(res)

@api_router.delete("/notes/{item_id}")
async def delete_note(item_id: str):
    res = await db.notes.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Note not found")
    return {"deleted": True, "id": item_id}


# ============ Proposals ============
class Proposal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    client: Optional[str] = ""
    contact: Optional[str] = ""  # email or phone
    services: Optional[List[str]] = []
    amount: Optional[float] = 0
    status: str = "draft"  # draft | sent | accepted | declined
    valid_until: Optional[str] = None  # YYYY-MM-DD
    scope: Optional[str] = ""
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProposalCreate(BaseModel):
    title: str
    client: Optional[str] = ""
    contact: Optional[str] = ""
    services: Optional[List[str]] = []
    amount: Optional[float] = 0
    status: Optional[str] = "draft"
    valid_until: Optional[str] = None
    scope: Optional[str] = ""
    notes: Optional[str] = ""

class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    client: Optional[str] = None
    contact: Optional[str] = None
    services: Optional[List[str]] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    valid_until: Optional[str] = None
    scope: Optional[str] = None
    notes: Optional[str] = None


@api_router.get("/proposals", response_model=List[Proposal])
async def list_proposals():
    docs = await db.proposals.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [_hydrate(d) for d in docs]

@api_router.post("/proposals", response_model=Proposal)
async def create_proposal(payload: ProposalCreate):
    item = Proposal(**payload.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.proposals.insert_one(doc)
    return item

@api_router.patch("/proposals/{item_id}", response_model=Proposal)
async def update_proposal(item_id: str, payload: ProposalUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "No fields to update")
    res = await db.proposals.find_one_and_update(
        {"id": item_id}, {"$set": update},
        return_document=True, projection={"_id": 0}
    )
    if not res:
        raise HTTPException(404, "Proposal not found")
    return _hydrate(res)

@api_router.delete("/proposals/{item_id}")
async def delete_proposal(item_id: str):
    res = await db.proposals.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Proposal not found")
    return {"deleted": True, "id": item_id}


# ============ Follow-ups ============
class FollowUp(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_name: str
    contact: Optional[str] = ""  # phone / email / handle
    channel: str = "call"  # call | whatsapp | email | meeting
    due_date: str  # YYYY-MM-DD
    note: Optional[str] = ""
    done: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FollowUpCreate(BaseModel):
    lead_name: str
    contact: Optional[str] = ""
    channel: Optional[str] = "call"
    due_date: str
    note: Optional[str] = ""
    done: Optional[bool] = False

class FollowUpUpdate(BaseModel):
    lead_name: Optional[str] = None
    contact: Optional[str] = None
    channel: Optional[str] = None
    due_date: Optional[str] = None
    note: Optional[str] = None
    done: Optional[bool] = None


@api_router.get("/followups", response_model=List[FollowUp])
async def list_followups():
    docs = await db.followups.find({}, {"_id": 0}).sort("due_date", 1).to_list(1000)
    return [_hydrate(d) for d in docs]

@api_router.post("/followups", response_model=FollowUp)
async def create_followup(payload: FollowUpCreate):
    item = FollowUp(**payload.model_dump())
    doc = item.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.followups.insert_one(doc)
    return item

@api_router.patch("/followups/{item_id}", response_model=FollowUp)
async def update_followup(item_id: str, payload: FollowUpUpdate):
    update = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not update:
        raise HTTPException(400, "No fields to update")
    res = await db.followups.find_one_and_update(
        {"id": item_id}, {"$set": update},
        return_document=True, projection={"_id": 0}
    )
    if not res:
        raise HTTPException(404, "Follow-up not found")
    return _hydrate(res)

@api_router.delete("/followups/{item_id}")
async def delete_followup(item_id: str):
    res = await db.followups.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Follow-up not found")
    return {"deleted": True, "id": item_id}


# ============ Stats ============
@api_router.get("/stats")
async def stats():
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"status": "new"})
    won = await db.leads.count_documents({"status": "won"})
    pipeline_count = await db.pipeline.count_documents({})
    content_count = await db.content.count_documents({})
    project_count = await db.projects.count_documents({})
    task_count = await db.tasks.count_documents({})
    note_count = await db.notes.count_documents({})
    # sum pipeline values per stage
    stages = ["discovery", "proposal", "negotiation", "won", "lost"]
    by_stage = {}
    total_value = 0
    async for d in db.pipeline.find({}, {"_id": 0, "stage": 1, "value": 1}):
        st = d.get("stage", "discovery")
        v = float(d.get("value") or 0)
        by_stage[st] = by_stage.get(st, 0) + v
        total_value += v
    for s in stages:
        by_stage.setdefault(s, 0)
    # invoice totals
    invoice_total = 0
    invoice_paid = 0
    invoice_outstanding = 0
    invoice_overdue = 0
    async for d in db.invoices.find({}, {"_id": 0, "status": 1, "line_items": 1, "tax_rate": 1}):
        subtotal = sum(li.get("quantity", 1) * li.get("rate", 0) for li in d.get("line_items", []))
        tax = subtotal * (float(d.get("tax_rate") or 0) / 100)
        total = subtotal + tax
        invoice_total += total
        if d.get("status") == "paid":
            invoice_paid += total
        elif d.get("status") == "overdue":
            invoice_overdue += total
        else:
            invoice_outstanding += total
    # proposals + follow-ups
    proposal_count = await db.proposals.count_documents({})
    proposals_sent = await db.proposals.count_documents({"status": "sent"})
    proposals_accepted = await db.proposals.count_documents({"status": "accepted"})
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    followups_due = await db.followups.count_documents({"done": False, "due_date": {"$lte": today}})
    followups_open = await db.followups.count_documents({"done": False})
    return {
        "proposal_count": proposal_count,
        "proposals_sent": proposals_sent,
        "proposals_accepted": proposals_accepted,
        "followups_due_today": followups_due,
        "followups_open": followups_open,
        "total_leads": total_leads,
        "new_leads": new_leads,
        "won_leads": won,
        "pipeline_count": pipeline_count,
        "content_count": content_count,
        "pipeline_value_total": total_value,
        "pipeline_value_by_stage": by_stage,
        "project_count": project_count,
        "task_count": task_count,
        "note_count": note_count,
        "invoice_total": invoice_total,
        "invoice_paid": invoice_paid,
        "invoice_outstanding": invoice_outstanding,
        "invoice_overdue": invoice_overdue,
    }


# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

