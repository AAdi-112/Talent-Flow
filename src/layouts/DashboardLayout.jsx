// src/layouts/DashboardLayout.jsx
import React from "react";
import Header from "../components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
