
import { createServer } from "miragejs";
import { db } from "./db";

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,

    routes() {
      this.namespace = "api";
      
      this.get("/users", async () => {
        // return all users from Dexie
        const users = await db.users.toArray();
        console.log("users; ",users)
        return users;
      });
      // GET jobs with pagination + filters
      this.get("/jobs", async (_, request) => {
        let { page = 1, limit = 10, title, status, tag } = request.queryParams;
        page = parseInt(page);
        limit = parseInt(limit);

        // get all jobs from Dexie
        let jobs = await db.jobs.toArray();

        // filters
        if (title) {
          jobs = jobs.filter((job) =>
            job.title.toLowerCase().includes(title.toLowerCase())
          );
        }
        if (status) {
          jobs = jobs.filter((job) => job.status === status);
        }
        if (tag) {
          jobs = jobs.filter((job) => job.tags?.includes(tag));
        }

        // sort by order
        jobs = jobs.sort((a, b) => a.order - b.order);

        const total = jobs.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const end = start + limit;

        return {
          jobs: jobs.slice(start, end),
          page,
          totalPages,
          total,
        };
      });

      // POST job
      this.post("/jobs", async (_, request) => {
        const data = JSON.parse(request.requestBody);
        const { id, ...jobsData } = data
        console.log("jobData: ",jobsData)
        const newId = await db.jobs.add({
          ...jobsData,
          order: (await db.jobs.count()) + 1,
        });
        return await db.jobs.get(newId);
      });

      // GET job by ID
this.get("/jobs/:id", async (_, request) => {
  const id = parseInt(request.params.id, 10);
  console.log("📌 Fetching job with ID:", id);

  const job = await db.jobs.get(id);
  if (!job) {
    console.warn("⚠️ Job not found:", id);
    return { error: "Job not found" };
  }

  return job;
});



      // GET all candidates (for pipeline board)
      // GET candidates with pagination + filters
      this.get("/candidates", async (_, request) => {
        let { page = 1, limit = 50, stage, q } = request.queryParams;
        page = parseInt(page);
        limit = parseInt(limit);

        let candidates = await db.candidates.toArray();

        // filters
        if (stage) candidates = candidates.filter(c => c.stage === stage);
        if (q) {
          const term = q.toLowerCase();
          candidates = candidates.filter(
            c => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
          );
        }

        const total = candidates.length;
        const totalPages = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const end = start + limit;

        return {
          candidates: candidates.slice(start, end), // ✅ only current page
          page,
          totalPages,
          total,
        };
      });




      // GET candidate by ID
      this.get("/candidates/:id", async (_, request) => {
        const id = parseInt(request.params.id, 10);
        return await db.candidates.get(id);
      });
      
      // PATCH candidate by ID (stage transitions, partial update)
this.patch("/candidates/:id", async (_, request) => {
  const id = parseInt(request.params.id);
  const body = JSON.parse(request.requestBody);
  
  console.log("📝 PATCH /candidates/:id", { id, body });
  const candidate = await db.candidates.get(id);
  if (!candidate) return { error: "Candidate not found" };


  // Update stage if provided
  if (body.stage) {
    candidate.stage = body.stage;

    // Track transitions
    candidate.statusHistory = [
      ...(candidate.statusHistory || []),
      {
        stage: body.stage,
        date: body.transitionDate || new Date().toISOString(),
      },
    ];
  }

  // Merge other fields (if PATCH includes them)
  const updatedCandidate = { ...candidate, ...body };

  await db.candidates.put(updatedCandidate);

  console.log("✅ Candidate updated:", updatedCandidate);

  return updatedCandidate;
});

      // Add note for candidate
      this.post("/candidates/:id/notes", async (_, request) => {
        const id = parseInt(request.params.id, 10);
        const { text } = JSON.parse(request.requestBody);

        const candidate = await db.candidates.get(id);
        if (!candidate) return { error: "Candidate not found" };

        const newNote = {
          text,
          createdAt: new Date().toISOString()
        };

        const updatedNotes = [...(candidate.notes || []), newNote];
        await db.candidates.update(id, { notes: updatedNotes });

        return newNote;
      });
      // for adding new candidates
      this.post("/candidates", async (_, request) => {
        const data = JSON.parse(request.requestBody);
        const newId = await db.candidates.add({
          ...data,
          jobId: 1, // or generate dynamically
          statusHistory: [{ stage: data.stage, date: new Date().toISOString() }],
          notes: [],
        });
        return await db.candidates.get(newId);
      });



      // PUT job update
      this.put("/jobs/:id", async (_, request) => {
        const id = parseInt(request.params.id, 10);
        const data = JSON.parse(request.requestBody);
        await db.jobs.update(id, data);
        return await db.jobs.get(id);
      });

      //PUT for candidates
      this.put("/candidates/:id", async (_, request) => {
        const id = parseInt(request.params.id, 10);
        const data = JSON.parse(request.requestBody);
        await db.candidates.update(id, data);
        return await db.candidates.get(id);
      });


      // DELETE job
      this.delete("/jobs/:id", async (_, request) => {
        const id = parseInt(request.params.id, 10);
        await db.jobs.delete(id);
        return { success: true };
      });
    },
  });
}
