
// src/pages/Auth/Login.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../src/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, user, error } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "candidate",
  });
  useEffect(()=>{
    console.log(user)
    if(user && user.role==='hr'){
      navigate("/hr")
    }
  })
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setForm({ ...form, role });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("[Login] submitting:", form);

  const success = await login(form.email, form.password);

  if (success) {
    // 🔑 Don’t use `user` here, it may still be stale
    const savedUser = JSON.parse(localStorage.getItem("user"));
    console.log("[Login] savedUser after login:", savedUser);

    if (savedUser?.role === "admin") navigate("/admin");
    else if (savedUser?.role === "hr") navigate("/hr");
    else navigate("/candidate");
  } else {
    console.warn("[Login] login failed");
  }
};

  const getRoleButtonClasses = (role, color) =>
    `px-4 py-2 rounded-lg text-white font-semibold transition 
     ${color} hover:opacity-90 
     ${form.role === role ? "ring-4 ring-offset-2 ring-[var(--color-stroke)]" : ""}`;

     return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-dashboard-bg)] text-[var(--color-text)]">
      <div className="w-full max-w-md p-6 bg-[var(--color-surface)] rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

       {/* Role Selection Buttons */}
<div className="grid grid-cols-3 gap-3 mb-6 w-full">
  <button
    type="button"
    onClick={() =>
      handleRoleSelect("candidate") ||
      setForm({
        email: "jane@doe.com",
        password: "candidate123",
        role: "candidate",
      })
    }
    className={`w-full py-2 rounded-lg text-white font-semibold transition 
      bg-blue-600 hover:bg-blue-700 
      ${form.role === "candidate" ? "ring-4 ring-offset-2 ring-blue-300" : ""}`}
  >
    Candidate
  </button>

  <button
    type="button"
    onClick={() =>
      handleRoleSelect("hr") ||
      setForm({ email: "hr@talentflow.com", password: "hr123", role: "hr" })
    }
    className={`w-full py-2 rounded-lg text-white font-semibold transition 
      bg-blue-600 hover:bg-blue-700 
      ${form.role === "hr" ? "ring-4 ring-offset-2 ring-blue-300" : ""}`}
  >
    HR
  </button>

  <button
    type="button"
    onClick={() =>
      handleRoleSelect("admin") ||
      setForm({
        email: "admin@talentflow.com",
        password: "admin123",
        role: "admin",
      })
    }
    className={`w-full py-2 rounded-lg text-white font-semibold transition 
      bg-blue-600 hover:bg-blue-700 
      ${form.role === "admin" ? "ring-4 ring-offset-2 ring-blue-300" : ""}`}
  >
    Admin
  </button>
</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold transition-colors"
          >
            Login as {form.role.charAt(0).toUpperCase() + form.role.slice(1)}
          </button>
        </form>
      </div>
    </div>
  );
}
