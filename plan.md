# plan.md — Game of Growth (Premium Creative Agency Website)

## 1) Objectives
- Deliver a **desktop-first, award-site-level** marketing experience where **each section is a distinct UI design language** yet the overall journey feels cohesive.
- Ship V1 with:
  - **Marketing site** with **12+ sections** (hero → final CTA) using **stock cinematic imagery**.
  - **Hidden Founder Dashboard** at `/dashboard` with **6 core modules** (no auth gating in V1; **Google OAuth later**).
  - **Mock AI UI only** (no LLM integration yet).
  - **Empty-first dashboards** (no seeded demo data; manual entry).
- Establish a minimal backend (FastAPI + MongoDB) for basic CRUD and future expansion.

**Current status**: **Phase 2 (V1) COMPLETE** — marketing site + dashboard + backend CRUD implemented and **E2E tested with 100% pass rate**.

---

## 2) Implementation Steps

### Phase 1 — Core POC (SKIP)
- No POC required (no OAuth yet, no LLM, no payments, no fragile external integrations). Proceed directly to V1 build.

**User stories (Phase 1)**
1. As a stakeholder, I want us to skip risky integration work so we can focus on design execution.
2. As a visitor, I want the site to load fast and feel cinematic immediately.
3. As a visitor, I want scroll transitions to feel intentional, not janky.
4. As a founder, I want a dashboard route available without auth for quick review.
5. As a developer, I want a clear design spine so sections can differ without chaos.

### Phase 2 — V1 App Development (Marketing Site + Dashboard Shell) ✅ COMPLETE

#### 2.1 Foundation + design system setup ✅
- Stack implemented: **React + Tailwind + Framer Motion + shadcn/ui + lucide-react**.
- Global “spine” implemented:
  - shared spacing/grid rhythm
  - consistent typography pairing (display + sans + mono)
  - unified motion feel across sections
  - ambient gradients/noise, premium cursor system (landing) + SaaS cursor reset (dashboard)
- Stock cinematic imagery curated via **Unsplash**.

#### 2.2 Marketing site (12 sections + final CTA) ✅
Built as separate components with distinct local aesthetics:
1. **Hero**: fullscreen cinematic + parallax mouse movement + custom cursor + premium CTAs.
2. **Marquee transition**: large typographic kinetic strip bridging the experience.
3. **Neo-brutalism**: thick borders, stickers, loud palette, big brand grid.
4. **Glassmorphism**: frosted panels, blur, floating cards.
5. **Apple-minimal**: whitespace, product layout, clean cards.
6. **Maximalism**: poster collage + bold editorial energy.
7. **Professional SaaS**: Stripe/Linear polish, feature grid + OS preview.
8. **Luxury**: gold accents, editorial serif, cinematic monochrome photography.
9. **Process timeline**: animated steps with clear phases.
10. **Case studies**: immersive before/after + measurable metrics.
11. **Testimonials**: interactive quote/portrait layout (non-boring cards).
12. **Digital products storefront**: premium tiles, “coming soon” framing.
13. **Final CTA + Contact form**: conversion-focused contact module.
14. **Footer**: premium brand wrap-up + internal link to dashboard.

#### 2.3 /dashboard shell (no auth gating) ✅
- Route: `/dashboard` with **premium SaaS layout** (sidebar + topbar + content area).
- V1 modules shipped (empty-first + manual entry + persistence):
  1. **Overview**: KPI cards + charts + recent leads empty state
  2. **Lead CRM**: add/edit/delete leads (slide-over)
  3. **Pipeline**: Kanban stages + create + delete; stage changes supported via PATCH
  4. **Content Calendar**: month view + click day to add + delete events
  5. **AI Content Generator**: **mock generation** (preset prompts, output pane, copy)
  6. **Settings**: profile + preference toggles + “coming next” module list

#### 2.4 Backend (minimal, for persistence) ✅
- FastAPI + MongoDB endpoints implemented:
  - **Leads CRUD** (`/api/leads`)
  - **Pipeline CRUD** (`/api/pipeline`)
  - **Content events CRUD** (`/api/content`)
  - **Contact capture** (`/api/contact`) which also auto-creates a Lead
  - **Stats aggregation** (`/api/stats`) for Overview KPIs
- No multi-tenant/auth yet (intentionally deferred).

#### 2.5 Testing + polish ✅
- Ran **testing_agent_v3** with **100% pass rate**:
  - Backend: **17/17** API tests passed
  - Frontend: landing sections render, contact form works, dashboard navigation works, CRUD flows confirmed

**User stories (Phase 2) — Delivered**
1. As a visitor, I want the hero to feel like a cinematic trailer for a design studio. ✅
2. As a visitor, I want each scroll section to feel like entering a new “world” with its own UI language. ✅
3. As a visitor, I want microinteractions (hover, cursor, reveals) to reward exploration. ✅
4. As a visitor, I want case studies to clearly show transformation and measurable outcomes. ✅
5. As a founder, I want to open `/dashboard` and see a premium internal OS-style interface. ✅
6. As a founder, I want to add/edit/delete leads and immediately see them reflected in the CRM. ✅
7. As a founder, I want to move items across pipeline stages via drag-and-drop (V1 supports stage updates; drag UX can be deepened). ✅
8. As a founder, I want to add content events to a calendar without friction. ✅

### Phase 3 — Feature Expansion (iterative; user-driven)

#### 3.1 Marketing enhancements
- Mobile responsive polish pass (spacing, typography scale, nav behavior, performance)
- Deeper transitions between design languages (masked reveals / portal wipes / section-to-section morph)
- Replace placeholder portfolio/case study content with **real projects** when provided
- Accessibility pass:
  - reduced motion mode
  - contrast checks
  - keyboard focus states

#### 3.2 Dashboard upgrades
- Improve analytics from simple charts → **real trend series** and richer breakdowns
- Better UX for Pipeline:
  - true drag-and-drop polish, keyboard alternatives
  - bulk actions / quick edit
- CRM enhancements:
  - filters, saved views, sorting
  - notes and activity timeline per lead

#### 3.3 New dashboard modules (next candidates)
- Client Management
- Proposal Generator (mock → real later)
- Appointment Scheduler
- Revenue Analytics
- Expense Tracker
- Team Tasks
- SOP Library
- Asset Library
- Notes
- Meeting Summaries
- Client Portals
- Digital Products Management

**User stories (Phase 3)**
1. As a visitor, I want dedicated case study pages that feel immersive and premium.
2. As a visitor, I want reduced-motion support so the experience remains comfortable.
3. As a founder, I want saved CRM views/filters so I can manage leads faster.
4. As a founder, I want stronger analytics so the dashboard feels “real”.
5. As a founder, I want more modules added without the UI feeling inconsistent.

### Phase 4+ — Integrations (OAuth + real AI)
- **Google OAuth**: implement secure login and gate `/dashboard`.
- **Real AI**:
  - wire AI Generator to a real LLM (Claude universal key: OpenAI/Anthropic/Gemini)
  - prompt templates + history + export
  - optional brand-voice memory/knowledge base later

**User stories (Phase 4+)**
1. As a founder, I want Google login so the dashboard is secure.
2. As a founder, I want role-based access for team members.
3. As a founder, I want AI content generation to produce usable drafts.
4. As a founder, I want proposal generation to pull from CRM + case studies.
5. As a founder, I want reliable persistence and audit history for key actions.

---

## 3) Next Actions
1. **User review** of V1:
   - confirm overall vibe (premium/creative)
   - identify any sections to redesign, reorder, or expand
2. Decide **Phase 3 priority**:
   - Mobile polish vs. deeper transitions vs. more real case studies
3. If/when ready: implement **Google OAuth** + gate dashboard.
4. If/when ready: upgrade AI Generator from mock → **real LLM**.

---

## 4) Success Criteria
✅ **V1 achieved**
- Marketing site feels **non-template, premium, cinematic**, and each section is clearly a different design language.
- Scroll experience is smooth; interactions feel intentional.
- `/dashboard` loads with premium SaaS feel and core modules function with **manual entry + persistence**.
- Empty states look designed (not blank).
- **One complete E2E test pass** completed with **no critical issues** (100% pass).

🔜 For future phases
- Dashboard secured behind OAuth.
- AI generator produces real usable drafts.
- Additional modules added without UI drift; mobile polish and accessibility improved.