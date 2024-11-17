import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerPWA } from "./utils/registerPWA";
import "./index.css";

// Initialize PWA registration
registerPWA().catch(console.error);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
