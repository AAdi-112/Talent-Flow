export default function StatusBadge({ status }) {
  const color = {
    applied: "bg-gray-100 text-gray-800",
    screen: "bg-yellow-100 text-yellow-800",
    tech: "bg-blue-100 text-blue-800",
    offer: "bg-indigo-100 text-indigo-800",
    hired: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }[status] || "bg-gray-100 text-gray-800";

  return <span className={`px-2 py-1 rounded text-sm ${color}`}>{status}</span>;
}
