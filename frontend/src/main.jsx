import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          duration: 4000,

          style: {
            background: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            padding: "14px 18px",
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "var(--shadow-md)",
          },

          success: {
            style: {
              borderLeft: "4px solid #10B981",
            },
            iconTheme: {
              primary: "#10B981",
              secondary: "#FFFFFF",
            },
          },

          error: {
            style: {
              borderLeft: "4px solid #EF4444",
            },
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FFFFFF",
            },
          },

          loading: {
            iconTheme: {
              primary: "#2563EB",
              secondary: "#FFFFFF",
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
