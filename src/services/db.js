// import Dexie from "dexie";

// export const db = new Dexie("TalentFlowDB");
// db.version(1).stores({
//   users: "++id,role,email,password",
//   jobs: "++id,title,slug,location,stipend,experience,status,tags,order",
//   candidates: "++id, name, email, jobId, stage, statusHistory, notes",
//   assessments: "++id,jobId,title,questions"
// });




// export async function seedDatabase() {
//   const count = await db.jobs.count();
//   if (count === 0) {console.log("under ka code run kr rha hai")
//     // === Users ===
//     await db.users.bulkAdd([
//       { role: "admin", email: "admin@talentflow.com", password: "admin123" },
//       { role: "hr", email: "hr@talentflow.com", password: "hr123" },
//       { role: "candidate", email: "jane@doe.com", password: "candidate123" },
//     ]);

//     // === Jobs (30+ entries) ===
//     const jobTitles = [
//       "Frontend Developer", "Backend Developer", "Fullstack Engineer",
//       "UI/UX Designer", "Data Analyst", "Data Scientist", "DevOps Engineer",
//       "QA Engineer", "Mobile Developer", "Cloud Architect",
//       "AI Engineer", "Product Manager", "Business Analyst",
//       "Cybersecurity Engineer", "Site Reliability Engineer",
//       "Software Engineer", "Embedded Systems Engineer",
//       "Game Developer", "Blockchain Developer", "ML Engineer",
//       "System Administrator", "Database Administrator",
//       "Technical Writer", "IT Support Specialist", "Solutions Architect",
//       "Network Engineer", "Research Engineer", "Data Engineer",
//       "AR/VR Developer", "Integration Engineer", "Scrum Master",
//       "Project Coordinator", "Software Consultant", "Platform Engineer",
//       "ERP Specialist", "CRM Developer", "API Engineer"
//     ];

//     const locations = ["Bangalore", "Delhi", "Mumbai", "Pune", "Hyderabad", "Remote"];
//     const techStacks = [
//       ["React", "Tailwind", "Node.js"],
//       ["Python", "Django", "PostgreSQL"],
//       ["Java", "Spring Boot", "MySQL"],
//       ["AWS", "Docker", "Kubernetes"],
//       ["C++", "Qt", "Linux"],
//       ["Flutter", "Firebase", "Dart"],
//       ["Angular", "TypeScript", "GraphQL"],
//       ["Go", "gRPC", "MongoDB"],
//       ["Next.js", "Prisma", "Redis"],
//     ];
//     // ✅ Create assessments
//         await db.assessments.bulkAdd([
//           {
//             jobId: webDevId,
//             title: "Full-Stack Assessment: Frontend",
//             sections: [
//               {
//                 id: uid(),
//                 title: "React & Frontend",
//                 questions: [
//                   { id: uid(), type: "single-choice", text: "Do you have experience with React?", required: true, options: ["Yes", "No"] },
//                   { id: uid(), type: "short-text", text: "What is JSX?", required: true, maxLength: 150 },
//                   { id: uid(), type: "numeric", text: "How many years of JavaScript experience?", required: true, min: 0, max: 20, showIf: { questionId: "q1", equals: "Yes" }},
//                   { id: uid(), type: "multi-choice", text: "Which CSS frameworks have you used?", required: true, options: ["Tailwind", "Bootstrap", "Material UI", "Chakra UI"] },
//                   { id: uid(), type: "long-text", text: "Explain difference between props and state.", required: true, maxLength: 300 },
//                   { id: uid(), type: "single-choice", text: "Do you know TypeScript?", required: true, options: ["Yes", "No"] },
//                   { id: uid(), type: "numeric", text: "How many React projects have you built?", required: true, min: 0, max: 50 },
//                   { id: uid(), type: "long-text", text: "Explain Virtual DOM.", required: true, maxLength: 250 },
//                   { id: uid(), type: "file-upload", text: "Upload a screenshot of your portfolio project.", required: false, maxSize: 5000000 },
//                   { id: uid(), type: "short-text", text: "What is a React Hook?", required: true, maxLength: 100 },
//                 ],
//               },
//             ],
//           },
//           {
//             jobId: dataAnalystId,
//             title: "Full-Stack Assessment: Backend & APIs",
//             sections: [
//               {
//                 id: uid(),
//                 title: "Node.js & Databases",
//                 questions: [
//                   { id: uid(), type: "single-choice", text: "Have you built REST APIs before?", required: true, options: ["Yes", "No"] },
//                   { id: uid(), type: "short-text", text: "What is Express.js?", required: true, maxLength: 150 },
//                   { id: uid(), type: "numeric", text: "How many years with Node.js?", required: true, min: 0, max: 15, showIf: { questionId: "q1", equals: "Yes" }},
//                   { id: uid(), type: "multi-choice", text: "Which databases have you used?", required: true, options: ["MongoDB", "Postgres", "MySQL", "SQLite"] },
//                   { id: uid(), type: "long-text", text: "Explain difference between SQL & NoSQL.", required: true, maxLength: 300 },
//                   { id: uid(), type: "single-choice", text: "Do you use ORMs?", required: true, options: ["Mongoose", "Prisma", "Sequelize", "No ORM"] },
//                   { id: uid(), type: "long-text", text: "What is JWT authentication?", required: true, maxLength: 200 },
//                   { id: uid(), type: "short-text", text: "Write one SQL query to fetch all users above 25.", required: true, maxLength: 200 },
//                   { id: uid(), type: "file-upload", text: "Upload a sample `.sql` file.", required: false },
//                   { id: uid(), type: "long-text", text: "Explain middleware in Express.", required: true, maxLength: 250 },
//                 ],
//               },
//             ],
//           },
//           {
//             jobId: uiuxId,
//             title: "Full-Stack Assessment: Integration & Deployment",
//             sections: [
//               {
//                 id: uid(),
//                 title: "MERN Deployment",
//                 questions: [
//                   { id: uid(), type: "single-choice", text: "Have you deployed a full-stack app?", required: true, options: ["Yes", "No"] },
//                   { id: uid(), type: "short-text", text: "What is CORS?", required: true, maxLength: 120 },
//                   { id: uid(), type: "multi-choice", text: "Which platforms have you deployed on?", required: true, options: ["Heroku", "Vercel", "Netlify", "AWS", "Docker"] },
//                   { id: uid(), type: "long-text", text: "Explain frontend-backend communication in MERN.", required: true, maxLength: 300 },
//                   { id: uid(), type: "numeric", text: "How many full-stack apps have you deployed?", required: true, min: 0, max: 50 },
//                   { id: uid(), type: "single-choice", text: "Do you use CI/CD pipelines?", required: true, options: ["Yes", "No"] },
//                   { id: uid(), type: "long-text", text: "What is SSR in Next.js?", required: true, maxLength: 200 },
//                   { id: uid(), type: "short-text", text: "What is an environment variable?", required: true, maxLength: 100 },
//                   { id: uid(), type: "file-upload", text: "Upload your `.env` file (remove secrets!).", required: false },
//                   { id: uid(), type: "short-text", text: "What is Docker used for?", required: true, maxLength: 120 },
//                 ],
//               },
//             ],
//           },
//         ]);
//     const jobs = Array.from({ length: 40 }).map((_, i) => {
//       const title = jobTitles[i % jobTitles.length];
//       return {
//         title,
//         slug: `${title.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
//         location: locations[i % locations.length],
//         stipend: `${(i % 5 + 3) * 5000} INR`,
//         experience: `${i % 6} - ${(i % 6) + 2} years`,
//         status: i % 4 === 0 ? "archived" : "active",
//         tags: techStacks[i % techStacks.length],
//         order: i + 1,
//       };
//     });
//     await db.jobs.bulkAdd(jobs);

//     // === Candidates ===
//       const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
//       const candidates = Array.from({ length: 2000 }).map((_, i) => {
//         const stage = stages[i % stages.length];
//         return {
//           jobId: (i % 40) + 1,
//           name: `Candidate ${i + 1}`,
//           email: `candidate${i + 1}@mail.com`,
//           stage,
//           statusHistory: [
//             { stage: "applied", date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() },
//             ...(stage !== "applied" ? [{ stage, date: new Date().toISOString() }] : []),
//           ],
//           notes: []
//         };
//       });
//       await db.candidates.bulkAdd(candidates);


//     // === Assessments ===
//     const assessments = [
//       {
//         jobId: 1,
//         title: "Frontend Assessment",
//         questions: [
//           { id: 1, type: "short-text", text: "Explain virtual DOM." },
//           {
//             id: 2,
//             type: "multi-choice",
//             text: "Select React hooks.",
//             options: ["useState", "useRouter", "useEffect"],
//           },
//         ],
//       },
//     ];
//     await db.assessments.bulkAdd(assessments);
//   }
// }





import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");
db.version(1).stores({
  users: "++id,role,email,password",
  jobs: "++id,title,slug,location,stipend,experience,status,tags,order",
  candidates: "++id, name, email, jobId, stage, statusHistory, notes",
  assessments: "++id,jobId,title,sections" // ✅ store sections, not just questions
});

function uid() {
  return crypto.randomUUID();
}

export async function seedDatabase() {
  const count = await db.jobs.count();
  if (count === 0) {
    console.log("🌱 Seeding database...");

    // === Users ===
    await db.users.bulkAdd([
      { role: "admin", email: "admin@talentflow.com", password: "admin123" },
      { role: "hr", email: "hr@talentflow.com", password: "hr123" },
      { role: "candidate", email: "jane@doe.com", password: "candidate123" },
    ]);

    // === Jobs (3 core jobs for assessments) ===
    const webDevId = await db.jobs.add({
      title: "Frontend Developer",
      slug: "frontend-developer-1",
      location: "Bangalore",
      stipend: "15000 INR",
      experience: "0 - 2 years",
      status: "active",
      tags: ["React", "Tailwind", "JS"],
      order: 1,
    });

    const backendId = await db.jobs.add({
      title: "Backend Developer",
      slug: "backend-developer-1",
      location: "Hyderabad",
      stipend: "20000 INR",
      experience: "1 - 3 years",
      status: "active",
      tags: ["Node.js", "Express", "MongoDB"],
      order: 2,
    });

    const fullstackId = await db.jobs.add({
      title: "Fullstack Engineer",
      slug: "fullstack-engineer-1",
      location: "Remote",
      stipend: "25000 INR",
      experience: "2 - 5 years",
      status: "active",
      tags: ["React", "Node.js", "MongoDB"],
      order: 3,
    });

    // === Assessments linked to jobs ===
    const assessments = [
      {
        jobId: webDevId,
        title: "Full-Stack Assessment: Frontend",
        sections: [
          {
            id: uid(),
            title: "React & Frontend",
            questions: [
              { id: uid(), type: "single-choice", text: "Do you have experience with React?", required: true, options: ["Yes", "No"] },
              { id: uid(), type: "short-text", text: "What is JSX?", required: true, maxLength: 150 },
              { id: uid(), type: "numeric", text: "How many years of JavaScript experience?", required: true, min: 0, max: 20, showIf: { questionId: "q1", equals: "Yes" }},
              { id: uid(), type: "multi-choice", text: "Which CSS frameworks have you used?", required: true, options: ["Tailwind", "Bootstrap", "Material UI", "Chakra UI"] },
              { id: uid(), type: "long-text", text: "Explain difference between props and state.", required: true, maxLength: 300 },
              { id: uid(), type: "single-choice", text: "Do you know TypeScript?", required: true, options: ["Yes", "No"] },
              { id: uid(), type: "numeric", text: "How many React projects have you built?", required: true, min: 0, max: 50 },
              { id: uid(), type: "long-text", text: "Explain Virtual DOM.", required: true, maxLength: 250 },
              { id: uid(), type: "file-upload", text: "Upload a screenshot of your portfolio project.", required: false, maxSize: 5000000 },
              { id: uid(), type: "short-text", text: "What is a React Hook?", required: true, maxLength: 100 },
            ],
          },
        ],
      },
      {
        jobId: backendId,
        title: "Full-Stack Assessment: Backend & APIs",
        sections: [
          {
            id: uid(),
            title: "Node.js & Databases",
            questions: [
              { id: uid(), type: "single-choice", text: "Have you built REST APIs before?", required: true, options: ["Yes", "No"] },
              { id: uid(), type: "short-text", text: "What is Express.js?", required: true, maxLength: 150 },
              { id: uid(), type: "numeric", text: "How many years with Node.js?", required: true, min: 0, max: 15, showIf: { questionId: "q1", equals: "Yes" }},
              { id: uid(), type: "multi-choice", text: "Which databases have you used?", required: true, options: ["MongoDB", "Postgres", "MySQL", "SQLite"] },
              { id: uid(), type: "long-text", text: "Explain difference between SQL & NoSQL.", required: true, maxLength: 300 },
              { id: uid(), type: "single-choice", text: "Do you use ORMs?", required: true, options: ["Mongoose", "Prisma", "Sequelize", "No ORM"] },
              { id: uid(), type: "long-text", text: "What is JWT authentication?", required: true, maxLength: 200 },
              { id: uid(), type: "short-text", text: "Write one SQL query to fetch all users above 25.", required: true, maxLength: 200 },
              { id: uid(), type: "file-upload", text: "Upload a sample `.sql` file.", required: false },
              { id: uid(), type: "long-text", text: "Explain middleware in Express.", required: true, maxLength: 250 },
            ],
          },
        ],
      },
      {
        jobId: fullstackId,
        title: "Full-Stack Assessment: Integration & Deployment",
        sections: [
          {
            id: uid(),
            title: "MERN Deployment",
            questions: [
              { id: uid(), type: "single-choice", text: "Have you deployed a full-stack app?", required: true, options: ["Yes", "No"] },
              { id: uid(), type: "short-text", text: "What is CORS?", required: true, maxLength: 120 },
              { id: uid(), type: "multi-choice", text: "Which platforms have you deployed on?", required: true, options: ["Heroku", "Vercel", "Netlify", "AWS", "Docker"] },
              { id: uid(), type: "long-text", text: "Explain frontend-backend communication in MERN.", required: true, maxLength: 300 },
              { id: uid(), type: "numeric", text: "How many full-stack apps have you deployed?", required: true, min: 0, max: 50 },
              { id: uid(), type: "single-choice", text: "Do you use CI/CD pipelines?", required: true, options: ["Yes", "No"] },
              { id: uid(), type: "long-text", text: "What is SSR in Next.js?", required: true, maxLength: 200 },
              { id: uid(), type: "short-text", text: "What is an environment variable?", required: true, maxLength: 100 },
              { id: uid(), type: "file-upload", text: "Upload your `.env` file (remove secrets!).", required: false },
              { id: uid(), type: "short-text", text: "What is Docker used for?", required: true, maxLength: 120 },
            ],
          },
        ],
      },
    ];

    await db.assessments.bulkAdd(assessments);
    console.log("✅ Assessments seeded");
  }
}
