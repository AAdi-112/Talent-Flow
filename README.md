# React + Vite

Talent-Flow — Mini Hiring Platform (Front-end)

Talent-Flow is a React-based candidate management tool built for HR teams to manage Jobs, Candidates and Assessments. It uses a client-side mock API (MirageJS or MSW) and local persistent storage (IndexedDB via Dexie or localForage) to behave like a real app with server-like pagination, latency and error injection. 

TALENTFLOW – A MINI HIRING PLAT…

Table of contents

What this README covers

Features (complete)

Tech stack

Quick start (dev + mock servers + DB)

Mock API & endpoints (Mirage / MSW)

Persistence & seed data

User flows — every click explained (what each click does)

Dashboard

Jobs board (list / create / edit / archive / reorder)

Candidates (virtualized list / profile / timeline)

Kanban pipeline (drag & drop)

Assessment builder & runtime

Role-based authentication & user profiles

Project structure (suggested)

Scripts & recommended npm tasks

Architecture & technical decisions

Known issues & testing notes

Deliverables & evaluation checklist

Contributing / License

What this README covers

This README documents everything required by the assignment and your users:

Full feature list (including Drag & Drop, Role-based auth, Assessment generator)

How the mock backend (Mirage / MSW) is implemented and the endpoints it exposes. 

TALENTFLOW – A MINI HIRING PLAT…

Local persistence strategy (IndexedDB write-through) and seed requirements (25 jobs, 1,000 candidates, 3+ assessments). 

TALENTFLOW – A MINI HIRING PLAT…

UI click/interaction flows — what each click/button does (so HRs can follow every action).

Setup steps to run locally with simulated latency and error injection. 

TALENTFLOW – A MINI HIRING PLAT…

Features (complete)

Candidate lifecycle: add / edit / delete candidate, view profile & timeline.

Jobs: create, edit, archive/unarchive, reorder (drag & drop), deep links ( /jobs/:jobId).

Drag & Drop (kanban) pipelines for moving candidates between stages with optimistic update + rollback on simulated failures.

Virtualized candidate list (1000+ seeded) with client-side search and server-like filters.

Assessment builder per job (sections + question types) + live preview + runtime.

Assessment question types: single-choice, multi-choice, short text, long text, numeric (with range), file upload stub.

Conditional questions and validation (required, numeric range, max length) in assessment runtime.

@mention rendering in candidate notes (suggestions from local list).

Role-based authentication simulation (Admin / HR / Interviewer) with role-aware UI and permissions.

Mock REST API (MirageJS or MSW) that simulates latency and a 5–10% write-error rate; all data is persisted locally into IndexedDB (Dexie or localForage). 

TALENTFLOW – A MINI HIRING PLAT…

Tech stack (recommended / used)

React (functional components + hooks)

Vite (dev server + build)

MirageJS or Mock Service Worker (MSW) for simulated REST API

IndexedDB via Dexie (or localForage) for persistent local storage

Drag-and-drop: @dnd-kit/core (recommended) or react-beautiful-dnd

Virtualized lists: react-window (for candidate list)

Forms: react-hook-form (builder & runtime)

State management: React Context / useReducer or small store (Zustand) for global app state

Styling: Tailwind CSS (or plain CSS modules)

Testing: Jest + React Testing Library (unit)

Quick start (dev + mock servers + DB)
# 1. clone
git clone https://github.com/AAdi-112/Talent-Flow.git
cd Talent-Flow

# 2. install
npm install

# 3. start dev server (Mirage or MSW is bootstrapped inside dev)
npm run dev

# 4. build and preview
npm run build
npm run preview


The dev server boots the mock API (Mirage or MSW) automatically. If you prefer explicit control you can add separate scripts (examples below). The mock network layer writes through to IndexedDB so the app state persists between reloads. 

TALENTFLOW – A MINI HIRING PLAT…

Optional separate mock-server scripts (recommended)

If you want explicit commands, add scripts to package.json:

"scripts": {
  "dev": "vite",
  "start:mock": "node src/mocks/start-mock.js", // example: boot a Mirage server before Vite
  "dev:with-mock": "npm-run-all --parallel start:mock dev",
  "build": "vite build",
  "preview": "vite preview"
}

Mock API & endpoints (Mirage / MSW)

The mock API mirrors a real REST backend. Use MirageJS or MSW to intercept requests and route them to handlers. The project brief requires these endpoints (implement exactly as below to match tests): 

TALENTFLOW – A MINI HIRING PLAT…

GET  /jobs?search=&status=&page=&pageSize=&sort=
POST /jobs
PATCH /jobs/:id
PATCH /jobs/:id/reorder     # occasionally returns 500 to test optimistic rollback
GET  /candidates?search=&stage=&page=
POST /candidates
PATCH /candidates/:id      # stage transitions
GET  /candidates/:id/timeline
GET  /assessments/:jobId
PUT  /assessments/:jobId
POST /assessments/:jobId/submit   # store response locally


Behavior & notes

PATCH /jobs/:id/reorder should sometimes (5–10% of the time) return 500 to force the front-end to rollback optimistic reorder moves. This simulates real-world failure and verifies rollback logic. 

TALENTFLOW – A MINI HIRING PLAT…

Inject artificial latency (200–1200ms) on all routes to make UI loading states and optimistic updates testable. 

TALENTFLOW – A MINI HIRING PLAT…

Mirage example (schematic)

// src/mocks/server.js (Mirage)
import { createServer, Model, Response } from "miragejs";

export function makeServer({ environment = "development" } = {}) {
  let server = createServer({
    environment,
    models: {
      job: Model,
      candidate: Model,
      assessment: Model,
      assessmentResponse: Model,
      user: Model,
    },
    routes() {
      this.timing = 300; // base latency
      this.get("/jobs", (schema, request) => { /* implement search, paging, filters */ });
      this.post("/jobs", (schema, request) => { /* create job + persist to IndexedDB */ });
      this.patch("/jobs/:id/reorder", () => {
        if (Math.random() < 0.08) { // 8% error rate
          return new Response(500, {}, { error: "Simulated reorder failure" });
        }
        return {}; // success
      });
      // ... other routes
    }
  });
  return server;
}

Persistence & seed data (IndexedDB / Dexie)

The app must persist all resources locally in IndexedDB and treat the mock API as a network/proxy layer, writing through to IndexedDB on every create/update. On refresh the app restores state from IndexedDB. This is required by the brief. 

TALENTFLOW – A MINI HIRING PLAT…

Seed data requirements (exact):

25 jobs (mix of active and archived)

1,000 candidates randomly assigned to jobs and stages

At least 3 assessments with 10+ questions each

Example Dexie schema (suggested)

// src/services/db.js
import Dexie from "dexie";

export const db = new Dexie("talentFlowDB");
db.version(1).stores({
  jobs: "id,slug,title,status,order,tags",
  candidates: "id,name,email,jobId,stage",
  candidateTimeline: "++id,candidateId,action,meta,date",
  assessments: "jobId, data",
  assessmentResponses: "id, jobId, candidateId, response, date",
  users: "id,username,role",
});


Write-through approach

Mock API handlers (Mirage/MSW) call into Dexie to create/update records — the front end always fetches from REST endpoints but those endpoints persist/return data from IndexedDB. This is how the app behaves like it has a backend while storing data locally. 

TALENTFLOW – A MINI HIRING PLAT…

User flows — every click explained (detailed)

Below is a click-by-click breakdown for all user-facing UI flows. Use it as a user manual or to verify UX tests.

For all routes assume base path http://localhost:5173.

Dashboard (Home)

Open app → lands on Dashboard showing: total candidates, counts by stage, quick links to Jobs, Candidates, Assessments.

Click “Candidates” (nav) → opens Candidates list.

Click “Jobs” (nav) → opens Jobs board.

Click any card in “Quick actions” (e.g., “Create job”) → opens the corresponding modal/route.

Jobs board (list + management)

Click Jobs (nav) → opens jobs list with server-like pagination and filter controls.

Search box: type → filters jobs by title / slug. Submitting or pressing Enter triggers GET /jobs?search=....

Status filter: select Active / Archived → triggers GET /jobs?status=....

Tags filter: select tags → filters results.

Pagination controls: Prev / Next → fetches next pages (GET /jobs?page=X&pageSize=Y).

Click “Add New Job” (button):

Opens a modal or route /jobs/create.

Fill Title (required), Slug (auto-generated but must be unique), Tags, Description.

Click Save → POST /jobs. Data persisted to IndexedDB via mock API. UI shows success toast.

Click job row → deep link to /jobs/:jobId showing job details and assigned candidates.

Click “Edit” (on a job) → open edit modal → modify → Click Save → PATCH /jobs/:id (updates DB).

Click “Archive / Unarchive”: toggles status and calls PATCH /jobs/:id.

Reorder jobs: Grab job card and drag to new position:

Front-end performs optimistic reorder and calls PATCH /jobs/:id/reorder with { fromOrder, toOrder }.

If API returns 500 (simulated 5–10% failure), the UI rolls back the reorder and shows an error toast. 

TALENTFLOW – A MINI HIRING PLAT…

Candidates list (virtualized 1000+)

Open Candidates page → virtualized list loads (fast scroll for many items).

Search (name/email): typing filters client-side; hitting Submit calls GET /candidates?search=....

Stage filter: Choose a stage (applied / screen / tech / offer / hired / rejected) → filters list.

Click candidate row → navigates to /candidates/:id.

Click “Add Candidate” → opens create form; Upload resume or paste link; set initial stage; Save → POST /candidates.

Keyboard / accessibility: arrow keys to navigate list (recommended to implement).

Candidate profile & timeline

Open /candidates/:id → shows full profile: contact, resume link, current stage, job applied for, notes, and timeline.

Click timeline item → expands details (who changed stage, message).

Change Stage (dropdown or move via Kanban):

Selecting new stage triggers PATCH /candidates/:id updating stage (and appends a timeline entry).

Add note / comment:

Type in notes box; @ triggers mention suggestions from local users list (render only — no real mention API).

Click Save Note → stores to candidateTimeline and displays in the timeline.

Click “Assign Assessment” → opens modal to pick an assessment for the candidate.

Kanban / Pipeline (Drag & Drop)

Open Pipeline (Kanban) page.

Columns: applied, screen, tech, offer, hired, rejected.

Each column shows candidate cards (same data as list).

Drag candidate card from one column to another → UI optimistically updates, then sends PATCH /candidates/:id with new stage.

If the mock API returns an error, the card goes back to its original column and an error notification is shown.

Click candidate card in Kanban → opens profile modal or navigates to /candidates/:id.

Assessment builder & runtime

Open Assessments → lists assessments by job.

Click “Add Assessment”:

Opens the assessment builder for a selected job (route /assessments/builder/:jobId).

Builder controls:

Add section (click) → section added.

Add question (click) → choose question type: single-choice, multi-choice, short text, long text, numeric (with min/max), file upload (stub).

Set validation: required, max length, numeric range.

Conditional logic: set show if rules (e.g., show Q3 only if Q1 === "Yes").

Live preview pane: updates instantly as builder changes.

Click Save → PUT /assessments/:jobId (persist builder JSON to IndexedDB via mock API).

Assign assessment to candidate(s): select candidates → click Assign → persists assignment.

Candidate runtime:

Candidate opens assessment runtime UI (fillable form).

Click Submit → POST /assessments/:jobId/submit stores candidate response in local DB.

Validation rules run client-side; blocked submission shows inline errors.

File upload fields are stubs (store file metadata only).

Role-based authentication & UI/permissions

Login page: choose username & password (mocked). The mock server returns a simulated token and user role (admin | hr | interviewer) and the app stores it in localStorage.

Role-based behavior:

Admin: full access — jobs, candidates, assessments, user management.

HR: manage jobs, candidates, assessments, but cannot manage users.

Interviewer: view assigned candidates, leave comments, update interview stage.

Click “Profile” → open user settings (edit display name, change password stub).

Unauthorized access: clicking a route without permission shows a “403 – Not authorized” screen and links to Dashboard.

Project structure (suggested / used)
Talent-Flow/
├─ public/
├─ src/
│  ├─ api/                # Fetch wrappers for REST endpoints
│  ├─ assets/
│  ├─ components/
│  ├─ hooks/
│  ├─ pages/
│  │  ├─ Dashboard/
│  │  ├─ Jobs/
│  │  ├─ Candidates/
│  │  ├─ Pipeline/
│  │  ├─ Assessments/
│  │  └─ Auth/
│  ├─ services/
│  │  ├─ db.js            # Dexie instance
│  │  └─ auth.js
│  ├─ stores/
│  ├─ mocks/              # Mirage / MSW handlers & seed scripts
│  ├─ App.jsx
│  └─ main.jsx
├─ package.json
└─ README.md

Scripts & recommended npm tasks

Add or verify the following scripts in package.json:

"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext .js,.jsx",
  "test": "vitest",
  "seed": "node src/mocks/seed.js",
  "dev:mock": "node src/mocks/start-mock.js"
}


npm run seed — creates the 25 jobs, 1000 candidates and sample assessments and writes them to IndexedDB (used the first time or to reset state). 

TALENTFLOW – A MINI HIRING PLAT…

npm run dev:mock — optional explicit start script to run mock server separately.

Architecture & technical decisions

MirageJS vs MSW: both are acceptable. Mirage is simpler to embed directly in dev builds and easy to tie to Dexie write-through logic. MSW is better if you want closer parity with service-worker interception in production-like environments. Either approach must persist to IndexedDB so state survives page reloads. 

TALENTFLOW – A MINI HIRING PLAT…

Persistence layer: Dexie offers a typed, convenient API for IndexedDB. All writes from mock endpoints should call Dexie so the data is durable. On app bootstrap, if IndexedDB is empty, load seeded data. 

TALENTFLOW – A MINI HIRING PLAT…

Optimistic updates: Reorders and drag/drop stage moves are applied locally immediately and then confirmed by mock API. PATCH /jobs/:id/reorder and PATCH /candidates/:id must support failure responses to test rollback logic. 

TALENTFLOW – A MINI HIRING PLAT…

Virtualization: react-window for rendering large candidate lists (1000+ items).

Form builder & runtime: React-hook-form + custom JSON schema for assessment definitions. The builder saves JSON (PUT /assessments/:jobId), and runtime reads that JSON to render the fillable form. 

TALENTFLOW – A MINI HIRING PLAT…

Known issues & testing notes

Reorder rollback must be tested several times — implement a 5–10% simulated failure rate for writes and confirm UI rollback looks correct. 

TALENTFLOW – A MINI HIRING PLAT…

When seeding 1,000 candidates, verify virtualized list performance and confirm that search/filter still runs smoothly.

Browser IndexedDB storage size limits: large file attachments (if you move beyond stubs) may not persist — keep uploads as metadata or switch to FileSystemAPI for larger files.

Cross-browser testing: ensure MSW/Mirage works with the intended browsers (Chrome, Firefox, Edge).

Deliverables & evaluation checklist

Per the assignment, include:

Deployed App link (Netlify / Vercel / Surge) — put URL here.

GitHub repo link — you already have it: https://github.com/AAdi-112/Talent-Flow

README (this file) with setup steps, architecture decisions and issues. 

TALENTFLOW – A MINI HIRING PLAT…

Evaluation criteria to verify before submission:

Code quality & structure

Functionality: Jobs, Candidates, Assessments working as required

Drag & drop + optimistic updates + rollback tested

Virtualized list for 1,000 candidates

Persistence & seed data restored from IndexedDB on refresh

Mock API latency & error injection implemented

Clear README & working deploy link

Contributing

Fork → branch (feature/xyz) → PR with clear description & screenshots.

Follow ESLint and Prettier rules. Add tests for critical flows (reorder rollback, assessment submit, pipeline drag/drop).

License

Add your license (MIT recommended) or include an existing LICENSE file.
