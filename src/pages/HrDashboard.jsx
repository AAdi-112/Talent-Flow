import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function HrDashboard() {
  const { user } = useAuth();

  const sections = [
    {
      title: "Jobs Board",
      description: "Create, edit, archive, and reorder job postings.",
      link: "/jobs",
      color: "bg-[var(--color-success)] hover:opacity-90",
    },
    {
      title: "Candidates",
      description: "Search, filter, and move candidates across pipeline stages.",
      link: "/candidates",
      color: "bg-[var(--color-active)] hover:bg-[var(--color-active-hover)]",
    },
    {
      title: "Candidate Board",
      description: "Build and preview job-specific assessments.",
      link: "/pipeline",
      color: "bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]",
    },
    {
      title: "Assessments",
      description: "Build and preview job-specific assessments.",
      link: "/assessments",
      color: "bg-[var(--color-warning)] hover:opacity-90",
    },
    
  ];

  return (
    <div className="min-h-screen p-8 bg-[var(--color-dashboard-bg)] text-[var(--color-text)]">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">HR Dashboard</h1>
        <p className="text-[var(--color-text-muted)]">
          Welcome back, <span className="font-semibold">{user?.email}</span>
        </p>
      </header>

      {/* Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((s) => (
          <Link
            key={s.title}
            to={s.link}
            className={`rounded-xl shadow-lg p-6 text-white transition transform hover:scale-105 ${s.color}`}
          >
            <h2 className="text-2xl font-semibold mb-2">{s.title}</h2>
            <p className="opacity-90">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
