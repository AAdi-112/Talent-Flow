


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../../components/SortableItem";
import JobForm from "./JobForm";

export default function JobsBoard() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [isDragging, setIsDragging] = useState(false);


  const handleDragStart = () => {
  setIsDragging(true);
  };
  // fetch jobs with pagination + filters
  const fetchJobs = async (page = 1, limit = 10) => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("title", search);
    if (statusFilter) params.append("status", statusFilter);
    if (tagFilter) params.append("tag", tagFilter);

    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data = await res.json();

    setJobs(data.jobs);
    setPagination({ page: data.page, totalPages: data.totalPages });
  };

  useEffect(() => {
    fetchJobs();
  }, []);


  //  Refresh jobs
  const refreshJobs = () => {
    fetch("/api/jobs?page=1&limit=10")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs));
  };

  // save job
const handleSave = async (job) => {
  console.log("Handle Save: jobId ",job)
  if (job.id) {
    await fetch(`/api/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
  } else {
    console.log("Handle Save: not jobId ",job)

    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
  }

  await refreshJobs();
  setShowForm(false);
  setEditJob(null);
};

  // toggle archive
  const toggleArchive = async (job) => {
    await fetch(`/api/jobs/${job.id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...job,
        status: job.status === "active" ? "archived" : "active",
      }),
    });
    fetchJobs(pagination.page);
  };

  // drag-and-drop reorder
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = jobs.findIndex((j) => j.id === active.id);
    const newIndex = jobs.findIndex((j) => j.id === over.id);

    const reordered = arrayMove(jobs, oldIndex, newIndex);
    setJobs(reordered);

    reordered.forEach(async (job, idx) => {
      await fetch(`/api/jobs/${job.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...job, order: idx + 1 }),
      });
    });
    setTimeout(() => setIsDragging(false), 0);
  };

  return (
    <div className="min-h-screen p-8 bg-[var(--color-dashboard-bg)] text-[var(--color-text)] rounded-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jobs Board</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 "
        >
          Add Job
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchJobs(1)}
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            fetchJobs(1);
          }}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={tagFilter}
          onChange={(e) => {
            setTagFilter(e.target.value);
            fetchJobs(1);
          }}
          className="px-3 py-2 border rounded"
        >
          <option value="">All Tags</option>
          <option value="React">React</option>
          <option value="Tailwind">Tailwind</option>
          <option value="Node.js">Node.js</option>
          <option value="AWS">AWS</option>
          <option value="Python">Python</option>
          <option value="Django">Django</option>
          <option value="Flutter">Flutter</option>
          <option value="MongoDB">MongoDB</option>
        </select>

        <button
          onClick={() => fetchJobs(1)}
          className="px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600"
        >
          Apply
        </button>
      </div>

      <DndContext
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
  onDragStart={handleDragStart}
>
  <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
    <ul className="space-y-2">
      {jobs.map((job) => (
        <SortableItem key={job.id} id={job.id}>
          {({ attributes, listeners }) => (
            <div
              className="p-4 bg-[var(--color-surface)] rounded shadow flex items-start"
            >
              {/* Drag handle */}
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab text-gray-500 hover:text-gray-700 mr-3 mt-1"
                title="Drag to reorder"
                onClick={(e) => e.stopPropagation()} // ✅ Prevent accidental navigation
              >
                ☰
              </button>

      <div
        className="flex-1"
        onClick={() => {
          console.log("➡️ Navigating to JobDescription for job:", job.id, job.title);
          navigate(`/jobs/${job.id}`);
        }}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">{job.title}</h2>

          {/* ✅ Show status beside title */}
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded 
              ${job.status === "archived" 
                ? "bg-red-100 text-red-600" 
                : "bg-green-100 text-green-600"}`}
          >
            {job.status === "archived" ? "Archived" : "Active"}
          </span>
        </div>

        <p className="text-sm text-[var(--color-text-muted)]">
          {job.location} • {job.experience} • {job.stipend}
        </p>

        <div className="flex flex-wrap gap-2 mt-1">
          {job.tags?.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-[var(--color-surface-alt)] text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

                  </div>
                )}
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={pagination.page === 1}
          onClick={() => fetchJobs(pagination.page - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => fetchJobs(pagination.page + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal form */}
      {showForm || editJob ? (
        <JobForm
          job={editJob}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditJob(null);
          }}
        />
      ) : null}
    </div>
  );
}