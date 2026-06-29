# plan.md — Game of Growth (Premium Creative Agency Website)

## 1) Objectives
- Deliver a **desktop-first, award-site-level** marketing experience where **each section is a distinct UI design language** yet the overall journey feels cohesive.
- Ship V1 with: **12 marketing sections + /dashboard shell** with **5–6 core modules** (no auth gating, no LLM, empty state + manual entry).
- Establish a minimal backend (FastAPI + MongoDB) to support basic CRUD for dashboard modules and future expansion.

---

## 2) Implementation Steps

### Phase 1 — Core POC (SKIP)
- No POC required (no OAuth yet, no LLM, no payments, no fragile external integrations). Proceed directly to V1 build.

**User stories (Phase 1)**
1. As a stakeholder, I want us to skip risky integration work so we can focus on design execution.
2. As a visitor, I want the site to load fast and feel cinematic immediately.
3. As a visitor, I want scroll transitions to feel intentional, not janky.
4. As a founder, I want a dashboard route available without auth for quick review.
5. As a developer, I want a clear design system plan so sections can differ without chaos.

### Phase 2 — V1 App Development (Marketing Site + Dashboard Shell)

#### 2.1 Foundation + design system setup
- Stack: React + Tailwind + Framer Motion + shadcn/ui + lucide-react.
- Add smooth scroll/section triggering (Framer Motion + IntersectionObserver; GSAP only if needed).
- Create **global “spine” system** to keep cohesion:
  - shared grid + spacing scale
  - typography pairing (display + body)
  - unified motion curve + transition timing tokens
  - ambient background layer + section “portal” transitions
- Curate stock imagery (Unsplash/Pexels) and standardize aspect ratios + color grading.

#### 2.2 Marketing site (12 sections + final CTA)
Build each section as its own component with a **unique local theme** (tokens scoped per section) and signature interaction.
- (1) Hero: fullscreen cinematic + custom cursor + parallax + bold CTAs.
- (2) Transition: morph/portal effect bridging to next design language.
- (3) Neo-brutalism: thick borders, stickers, loud palette, oversized buttons.
- (4) Glassmorphism: frosted panels, blur, floating cards.
- (5) Apple-minimal: pristine whitespace, elegant type, product-like layouts.
- (6) Maximalism: editorial collage, experimental typography.
- (7) Professional SaaS: Stripe/Linear polish, feature grid + workflows.
- (8) Luxury: black/white/gold accents, cinematic photography.
- (9) Interactive process timeline: scroll-driven steps + highlights.
- (10) Case studies: immersive story pages/sections with before/after + metrics.
- (11) Testimonials: non-card layout + interactive quote reveal.
- (12) Digital products storefront: premium product tiles + hover previews.
- (13) Final CTA: confident, simple, high conversion.

#### 2.3 /dashboard shell (no auth gating)
- Route: `/dashboard` with SaaS layout (sidebar + topbar + content).
- V1 modules (empty-first + manual entry):
  1. Overview (KPI cards + placeholder charts)
  2. Lead CRM (table + add/edit/delete)
  3. Pipeline (kanban with drag/drop)
  4. Content Calendar (month view + add/edit)
  5. AI Content Generator (mock UI: prompt in → “generated” preview)
  6. Settings (profile/org placeholders + theme toggle if time)

#### 2.4 Backend (minimal, for persistence)
- FastAPI + MongoDB:
  - Leads CRUD
  - Pipeline items CRUD
  - Content events CRUD
- Keep schema simple; no multi-tenant/auth yet.

#### 2.5 Testing + polish
- Run one full pass of E2E testing for:
  - navigation + scroll performance
  - responsiveness (desktop-first, verify mobile doesn’t break)
  - dashboard CRUD + drag/drop + calendar create/edit
  - empty states and loading states
- Fix until stable; optimize animations (reduce layout thrash, prefer transforms).

**User stories (Phase 2)**
1. As a visitor, I want the hero to feel like a cinematic trailer for a design studio.
2. As a visitor, I want each scroll section to feel like entering a new “world” with its own UI language.
3. As a visitor, I want microinteractions (hover, cursor, reveals) to reward exploration.
4. As a visitor, I want case studies to clearly show transformation and measurable outcomes.
5. As a founder, I want to open `/dashboard` and see a premium internal OS-style interface.
6. As a founder, I want to add/edit/delete leads and immediately see them reflected in the CRM.
7. As a founder, I want to move items across pipeline stages via drag-and-drop.
8. As a founder, I want to add content events to a calendar without friction.

### Phase 3 — Feature Expansion (iterative)
- Marketing:
  - Add more case study depth (dedicated routes), richer motion, better media handling.
  - Accessibility pass (reduced motion mode, contrast checks) without sacrificing premium feel.
- Dashboard:
  - Improve analytics (real charts), saved filters, bulk actions.
  - Add remaining modules incrementally (proposal generator mock → real later).
  - Refactor into more modular services/hooks as surface area grows.
- Backend:
  - Add validation, pagination, audit fields, and richer models.

**User stories (Phase 3)**
1. As a visitor, I want dedicated case study pages that feel immersive and premium.
2. As a visitor, I want reduced-motion support so the experience remains comfortable.
3. As a founder, I want saved CRM views/filters so I can manage leads faster.
4. As a founder, I want stronger analytics so the dashboard feels “real”.
5. As a founder, I want more modules added without the UI feeling inconsistent.

### Phase 4+ — Integrations (OAuth + real AI)
- Google OAuth (later): implement and gate `/dashboard`.
- Real AI: wire generator UIs to LLM; add prompt templates + history.

**User stories (Phase 4+)**
1. As a founder, I want Google login so the dashboard is secure.
2. As a founder, I want role-based access for team members.
3. As a founder, I want AI content generation to produce usable drafts.
4. As a founder, I want proposal generation to pull from CRM + case studies.
5. As a founder, I want reliable persistence and audit history for key actions.

---

## 3) Next Actions
1. Generate a **design spine** (type pairing, spacing, motion tokens) + per-section theme tokens.
2. Scaffold routes: `/` marketing, `/dashboard` shell.
3. Implement Hero + Transition + 2–3 sections first to lock the quality bar and transition style.
4. Build dashboard shell + CRM CRUD (first persistent module) end-to-end.
5. Expand remaining marketing sections + remaining dashboard modules.
6. One E2E test pass; performance/motion tuning.

---

## 4) Success Criteria
- Marketing site feels **non-template, premium, cinematic**, and each section is clearly a different design language.
- Scroll transitions are smooth; interactions are intentional; no obvious jank.
- `/dashboard` loads with a premium SaaS feel and core modules function with **manual entry + persistence**.
- Empty states look designed (not blank); mobile doesn’t break.
- One complete E2E test pass completed with no critical issues.