import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "./styles/animations.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found");
}

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
