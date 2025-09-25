
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <header className="bg-lime-500 text-white shadow-md">
      <div className="mx-auto px-40 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-4xl font-bold tracking-wide">
          TalentFlow
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 items-center">
          <Link to="/jobs" className="hover:underline">
            Jobs
          </Link>
          <Link to="/candidates" className="hover:underline">
            Candidates
          </Link>
          <Link to="/pipeline" className="hover:underline">
            Pipeline
          </Link>
          <Link to="/assessments" className="hover:underline">
            Assessments
          </Link>

          {/* Right-side Auth Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-white text-lime-600 flex items-center justify-center font-bold hover:ring-2 hover:ring-offset-2 hover:ring-white"
                title={user.email}
              >
                {userInitial}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-700 rounded shadow-lg z-50">
                  {/* User info */}
                  <div className="px-4 py-2 border-b text-sm text-gray-600">
                    Signed in as <br />
                    <span className="font-semibold text-gray-800">
                      {user.email}
                    </span>
                    <br />
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-lime-100 text-lime-700 font-semibold">
                      {user.role?.toUpperCase() || "USER"}
                    </span>
                  </div>

                  {/* Links */}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white text-lime-600 px-3 py-1 rounded font-semibold hover:bg-gray-100"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
