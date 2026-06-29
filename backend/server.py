from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
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


# ============ Stats ============
@api_router.get("/stats")
async def stats():
    total_leads = await db.leads.count_documents({})
    new_leads = await db.leads.count_documents({"status": "new"})
    won = await db.leads.count_documents({"status": "won"})
    pipeline_count = await db.pipeline.count_documents({})
    content_count = await db.content.count_documents({})
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
    return {
        "total_leads": total_leads,
        "new_leads": new_leads,
        "won_leads": won,
        "pipeline_count": pipeline_count,
        "content_count": content_count,
        "pipeline_value_total": total_value,
        "pipeline_value_by_stage": by_stage,
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
