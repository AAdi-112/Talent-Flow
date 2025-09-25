// src/pages/Assessments/AssessmentsHome.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../services/db";

export default function AssessmentsHome() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const uid = () => crypto.randomUUID();

  const seed = async () => {
    try {
      console.log("🔎 Checking DB for existing jobs...");
      const jobCount = await db.jobs.count();
      console.log("✅ Job count:", jobCount);

      if (jobCount === 0) {
        console.log("🌱 Seeding default jobs and assessments...");

        // Clear old data to avoid duplicates
        await db.jobs.clear();
        await db.assessments.clear();

        // ✅ Create jobs
        const webDevId = await db.jobs.add({ title: "Web Developer", status: "active" });
        const dataAnalystId = await db.jobs.add({ title: "Data Analyst", status: "active" });
        const uiuxId = await db.jobs.add({ title: "UI/UX Designer", status: "active" });
        // console.log("📌 Jobs created with IDs:", { webDevId, dataAnalystId, uiuxId });

        
        // console.log("✅ Full-stack assessments seeded");
      }

      const allJobs = await db.jobs.toArray();
      console.log("📂 Jobs in DB:", allJobs);
      setJobs(allJobs.slice(0, 3));
    } catch (err) {
      console.error("❌ Error seeding or fetching jobs:", err);
    }
  };

  seed();
}, []);


  return (
    <div className="p-6 space-y-6 min-h-screen bg-[var(--color-dashboard-bg)] text-[var(--color-text)]">
      <h1 className="text-2xl font-bold mb-4">Assessments per Job</h1>

      <div className="grid grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="p-6 border rounded-lg h-48 bg-white cursor-pointer hover:shadow-lg flex flex-col justify-center items-center"
            onClick={() => {
              console.log("➡️ Navigating to builder for job:", job);
              navigate(`/assessments/builder/${job.id}`, {state: {job}});
            }}
          >
            <h2 className="font-semibold text-lg mb-2">{job.title}</h2>
            <p className="text-sm text-gray-600">Status: {job.status}</p>
          </div>
        ))}

        {/* Add Job Card */}
        <div
          className="p-6 border-2 border-dashed rounded-lg h-48 bg-gray-50 cursor-pointer hover:shadow-lg flex flex-col justify-center items-center"
          onClick={async () => {
            try {
              const id = await db.jobs.add({ title: "New Job", status: "active" });
              console.log("➕ New job created with ID:", id);
              setJobs(await db.jobs.toArray());
              navigate(`/assessments/builder/${id}`);
            } catch (err) {
              console.error("❌ Error adding new job:", err);
            }
          }}
        >
          <span className="text-4xl text-blue-600 mb-2">+</span>
          <p className="font-medium">Add New Job</p>
        </div>
      </div>
    </div>
  );
}
