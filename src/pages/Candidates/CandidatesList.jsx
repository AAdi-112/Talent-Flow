
import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useNavigate } from "react-router-dom";

// Row component
const CandidateRow = ({ index, style, data }) => {
  const { candidates, navigate } = data;
  const cand = candidates[index];

  if (!cand) return null;

  return (
    <div
      style={style}
      className="flex items-center justify-between px-4 py-2 border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => navigate(`/candidates/${cand.id}`)}
    >
      <div>
        <div className="font-medium">{cand.name}</div>
        <div className="text-sm text-gray-500">{cand.email}</div>
      </div>
      <div className="text-sm text-gray-600">{cand.stage}</div>
    </div>
  );
};

export default function CandidatesList() {
  const [candidates, setCandidates] = useState([]);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newCandidate, setNewCandidate] = useState({ name: "", email: "", stage: "applied" });
  const navigate = useNavigate();
  const limit = 15; // number of candidates per page

  const fetchCandidates = async () => {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (stage) params.set("stage", stage);
    if (q) params.set("q", q);

    const res = await fetch(`/api/candidates?${params.toString()}`);
    const body = await res.json();

    setCandidates(body.candidates || []);
    setTotal(body.total || 0);
    setTotalPages(body.totalPages || 1);
  };

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, stage, page]);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.email) return;

    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCandidate),
    });

    if (res.ok) {
      setShowForm(false);
      setNewCandidate({ name: "", email: "", stage: "applied" });
      fetchCandidates(); // refresh list
    }
  };

  return (
    <div className="p-6 space-y-4 bg-[var(--color-dashboard-bg)] text-[var(--color-text)">
      {/* Subheading with Add button */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Candidate List</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-lime-500 text-white px-4 py-2 rounded hover:bg-lime-600"
        >
          + Add Candidate
        </button>
      </div>

      {/* Add Candidate Form */}
      {showForm && (
        <form
          onSubmit={handleAddCandidate}
          className="p-4 border rounded bg-gray-50 space-y-3"
        >
          <input
            type="text"
            placeholder="Name"
            value={newCandidate.name}
            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={newCandidate.email}
            onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <select
            value={newCandidate.stage}
            onChange={(e) => setNewCandidate({ ...newCandidate, stage: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="applied">applied</option>
            <option value="screen">screen</option>
            <option value="tech">tech</option>
            <option value="offer">offer</option>
            <option value="hired">hired</option>
            <option value="rejected">rejected</option>
          </select>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setNewCandidate({ name: "", email: "", stage: "applied" });
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Search + Filter */}
      <div className="flex gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 border rounded px-3 py-2"
        />
        <select
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All stages</option>
          <option value="applied">applied</option>
          <option value="screen">screen</option>
          <option value="tech">tech</option>
          <option value="offer">offer</option>
          <option value="hired">hired</option>
          <option value="rejected">rejected</option>
        </select>
      </div>

      {/* Virtualized List */}
      <div className="border rounded">
        <List
          height={800}
          itemCount={candidates.length}
          itemSize={72}
          width="100%"
          itemData={{ candidates, navigate }}
        >
          {CandidateRow}
        </List>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="text-sm text-gray-500">{total} candidates total</div>
    </div>
  );
}
