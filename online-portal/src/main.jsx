import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider as AsgardeoProvider } from "@asgardeo/auth-react";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import App from "./App.jsx";
import { authConfig } from "./authConfig.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AsgardeoProvider config={authConfig}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </AsgardeoProvider>
  </React.StrictMode>,
);
