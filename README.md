# Game of Growth

**Game of Growth** is a premium, desktop-first creative agency website designed to deliver an award-winning marketing experience. The platform features over 12 distinct UI design language sections and includes a fully functional, hidden founder dashboard for managing leads, pipeline, and content.

## 🚀 Features

### Marketing Experience
A beautifully crafted landing page with 12+ unique sections, each utilizing a distinct aesthetic while maintaining a cohesive journey:
- **Cinematic Hero**: Fullscreen visuals with parallax mouse movement and custom cursors.
- **Neo-brutalism & Glassmorphism**: Thick borders, loud palettes, frosted panels, and floating cards.
- **Apple-Minimal & Maximalism**: Clean whitespace layouts mixed with bold editorial poster collages.
- **Professional SaaS & Luxury**: Linear-style polish combined with gold accents and monochrome photography.
- **Immersive Content**: Animated process timelines, interactive testimonials, case studies with measurable metrics, and a digital products storefront.

### Hidden Founder Dashboard (`/dashboard`)
A premium internal OS-style interface for managing the agency (currently in V1 without auth gating):
- **Overview**: KPI cards, charts, and recent leads.
- **Lead CRM & Pipeline**: Add, edit, delete leads, and manage Kanban stages.
- **Content Calendar**: Interactive month view for content planning.
- **AI Content Generator**: Mock UI for AI-driven content creation.
- **Settings**: Profile preferences and module list.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animation & 3D**: Framer Motion, GSAP, React Three Fiber (@react-three/drei)
- **Routing & State**: React Router DOM, SWR, React Query

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Motor / PyMongo)
- **Validation**: Pydantic
- **Server**: Uvicorn
- **Testing**: Pytest

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Yarn (recommended based on configuration) or npm
- Python (v3.9+)
- MongoDB (running locally or via MongoDB Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   # Ensure you have a .env file configured for MongoDB connection if required.
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   yarn install
   # or npm install --legacy-peer-deps (if resolving peer dependency conflicts)
   ```
3. Start the development server:
   ```bash
   yarn start
   # or npm start
   ```

## 🧪 Testing

The project has been end-to-end tested with a 100% pass rate. 
- **Backend**: Contains 17/17 passing API tests.
- **Frontend**: E2E flows confirmed for landing sections, contact forms, dashboard navigation, and CRUD operations.

To run backend tests:
```bash
cd backend
pytest
```

## 🔮 Roadmap (Upcoming Phases)
- **Phase 3**: Mobile responsive polish, deeper section transitions, richer analytics, and CRM enhancements.
- **Phase 4+**: Google OAuth integration for the dashboard and wiring the AI Generator to a real LLM (OpenAI/Anthropic/Gemini).

## 📄 License
All rights reserved.
