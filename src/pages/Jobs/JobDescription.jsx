// src/pages/Jobs/JobDescription.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function JobDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  const fetchJob = async () => {
    const res = await fetch(`/api/jobs/${id}`);
    if (res.ok) {
      const data = await res.json();
      setJob(data);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const toggleArchive = async () => {
    if (!job) return;
    await fetch(`/api/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...job,
        status: job.status === "active" ? "archived" : "active",
      }),
    });
    fetchJob();
  };

  if (!job) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-[var(--color-dashboard-bg)] text-[var(--color-text)]">
      {/* Top card with title + actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-gray-600">
            {job.location} • {job.experience} • {job.stipend}
          </p>
        </div>
        <div className="flex gap-3">
          {/* Edit button */}
          <button
            onClick={() => navigate(`/jobs/edit/${job.id}`)}
            className="p-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
            title="Edit Job"
          >
            Edit
          </button>
          {/* Archive/Unarchive button */}
          <button
            onClick={toggleArchive}
            className={`p-2 rounded ${
              job.status === "active"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
            title={job.status === "active" ? "Archive Job" : "Unarchive Job"}
          >
            {job.status === "active" ? "Unarchive" : "archive"}
          </button>
        </div>
      </div>

      {/* Job details */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Job Details</h2>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Experience:</strong> {job.experience}</p>
        <p><strong>Stipend:</strong> {job.stipend}</p>
        <div className="mt-3">
          <h3 className="font-semibold">Tags:</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {job.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 text-sm rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
