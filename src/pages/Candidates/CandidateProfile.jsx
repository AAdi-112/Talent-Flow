// src/pages/Candidates/CandidateProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge"; 
import Card from "../../components/Card"; 

function renderWithMentions(text) {
  // naive mention parser: finds @word and wraps it
  const parts = text.split(/(@[a-zA-Z0-9_-]+)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("@")) {
      return <span key={idx} className="text-blue-600 font-semibold">{part}</span>;
    }
    return <span key={idx}>{part}</span>;
  });
}

export default function CandidateProfile() {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCandidate = async () => {
    setLoading(true);
    const res = await fetch(`/api/candidates/${id}`);
    const data = await res.json();
    setCandidate(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCandidate();
    // eslint-disable-next-line
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    const text = noteText.trim();
    if (!text) return;
    const res = await fetch(`/api/candidates/${id}/notes`, {
      method: "POST",
      body: JSON.stringify({ text, author: "HR" }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const newNote = await res.json();
      setCandidate((prev) => ({ ...prev, notes: [...(prev.notes || []), newNote] }));
      setNoteText("");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!candidate) return <div className="p-6">Candidate not found</div>;

  return (
    <div className="p-6 space-y-1 bg-[var(--color-dashboard-bg)] text-[var(--color-text)">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{candidate.name}</h2>
            <p className="text-sm text-gray-600">{candidate.email}</p>
            <p className="text-sm text-gray-500">Applied for job: {candidate.jobId}</p>
          </div>
          <div>
            <StatusBadge status={candidate.stage} />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-3">Stage Timeline</h3>
<ul className="border-l border-gray-200 pl-4 space-y-3">
  {candidate.statusHistory?.map((item, idx) => (
    <li key={idx} className="relative">
      <span className="absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full"></span>
      <div className="font-medium">{item.stage}</div>
      <div className="text-xs text-gray-500">{new Date(item.date).toLocaleString()}</div>
    </li>
  ))}
</ul>

      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-3">Notes</h3>
        <form onSubmit={handleAddNote} className="mb-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            placeholder="Add a note. Use @ to mention (render only)."
            className="w-full border rounded p-2"
          />
          <div className="flex justify-end mt-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Note</button>
          </div>
        </form>

        <div className="space-y-3">
          {candidate.notes?.length ? (
            candidate.notes.map((n) => (
              <div key={n.id || n.createdAt} className="p-3 bg-gray-50 border rounded">
                <div className="text-sm">{renderWithMentions(n.text)}</div>
                <div className="text-xs text-gray-500 mt-1">{n.author} · {new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No notes yet</div>
          )}
        </div>
      </Card>
    </div>
  );
}
