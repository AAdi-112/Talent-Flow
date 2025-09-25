// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function JobForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [job, setJob] = useState({ title: "", location: "", experience: "", stipend: "", tags: [] });

//   useEffect(() => {
//     if (id) {
//       fetch(`/api/jobs/${id}`)
//         .then(res => res.json())
//         .then(data => setJob(data));
//     }
//   }, [id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (id) {
//       // Update
//       await fetch(`/api/jobs/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(job),
//       });
//     } else {
//       // Create
//       await fetch("/api/jobs", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(job),
//       });
//     }

//     navigate("/jobs");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow">
//       <h2 className="text-xl font-bold mb-4">
//         {id ? "Edit Job" : "Create Job"}
//       </h2>
//       {/* fields... */}
//       <input
//         type="text"
//         value={job.title}
//         onChange={(e) => setJob({ ...job, title: e.target.value })}
//         placeholder="Job Title"
//         className="border p-2 w-full mb-3"
//       />
//       {/* add other fields like location, stipend, etc */}
//       <button className="px-4 py-2 bg-blue-600 text-white rounded">
//         {id ? "Update Job" : "Save Job"}
//       </button>
//     </form>
//   );
// }


import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState({
    title: "",
    location: "",
    experience: "",
    stipend: "",
    tags: []
  });
  const [newTag, setNewTag] = useState("");

  // Load job data for editing
  useEffect(() => {
    if (id) {
      fetch(`/api/jobs/${id}`)
        .then((res) => res.json())
        .then((data) => setJob(data));
    }
  }, [id]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/jobs/${id}` : "/api/jobs";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });

    navigate("/jobs");
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !job.tags.includes(newTag.trim())) {
      setJob({ ...job, tags: [...job.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tag) => {
    setJob({ ...job, tags: job.tags.filter((t) => t !== tag) });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-bold">
        {id ? "Edit Job" : "Create Job"}
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium">Job Title</label>
        <input
          type="text"
          value={job.title}
          onChange={(e) => setJob({ ...job, title: e.target.value })}
          placeholder="Job Title"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          value={job.location}
          onChange={(e) => setJob({ ...job, location: e.target.value })}
          placeholder="Location"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Experience */}
      <div>
        <label className="block text-sm font-medium">Experience</label>
        <input
          type="text"
          value={job.experience}
          onChange={(e) => setJob({ ...job, experience: e.target.value })}
          placeholder="e.g. 0 - 2 years"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Stipend */}
      <div>
        <label className="block text-sm font-medium">Stipend</label>
        <input
          type="text"
          value={job.stipend}
          onChange={(e) => setJob({ ...job, stipend: e.target.value })}
          placeholder="e.g. 15000 INR"
          className="border p-2 w-full rounded"
          required
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag (e.g. React)"
            className="border p-2 flex-1 rounded"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-gray-200 rounded text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => removeTag(tag)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {id ? "Update Job" : "Save Job"}
      </button>
    </form>
  );
}
