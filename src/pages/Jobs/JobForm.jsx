import { useState, useEffect } from "react";

export default function JobForm({ job, onSave, onClose, jobs = [] }) {
  const [form, setForm] = useState({
    id: job?.id || null,
    title: job?.title || "",
    slug: job?.slug || "",
    location: job?.location || "",
    stipend: job?.stipend || "",
    experience: job?.experience || "",
    status: job?.status || "active",
    tags: job?.tags || [],
  });

  const [error, setError] = useState("");

  // auto-generate slug when title changes
  useEffect(() => {
    if (!job) {
      setForm((prev) => ({
        ...prev,
        slug: prev.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      }));
    }
  }, [form.title]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTagsChange = (e) => {
    setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // === Validation ===
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    const exists = jobs.find(
      (j) => j.slug === form.slug && j.id !== form.id
    );
    if (exists) {
      setError("Slug must be unique.");
      return;
    }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-dashboard-bg)] bg-opacity-10">
      <div className="bg-[var(--color-surface)] rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {job ? "Edit Job" : "Create Job"}
        </h2>

        {error && (
          <p className="mb-3 text-red-500 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          {/* Slug (read-only) */}
          <div>
            <label className="block mb-1 font-medium">Slug</label>
            <input
              type="text"
              name="slug"
              value={form.slug}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Stipend */}
          <div>
            <label className="block mb-1 font-medium">Stipend</label>
            <input
              type="text"
              name="stipend"
              value={form.stipend}
              onChange={handleChange}
              placeholder="e.g. 50000 INR"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block mb-1 font-medium">Experience</label>
            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="e.g. 2-4 years"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <input
              type="text"
              name="tags"
              value={form.tags.join(", ")}
              onChange={handleTagsChange}
              placeholder="Comma separated (React, Node.js, etc.)"
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-500 text-white hover:opacity-80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-lime-400 text-white hover:bg-[var(--color-accent-hover)]"
            >
              {job ? "Save Changes" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
