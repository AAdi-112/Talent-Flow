import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { makeServer } from "./services/mirage.js";
import { seedDatabase } from "./services/db.js";

// Seed Dexie and start Mirage
seedDatabase().then(() => {
  makeServer();
});
seedDatabase({ });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
