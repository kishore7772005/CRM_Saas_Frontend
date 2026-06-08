


import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";

// Context Providers
import { ModalProvider } from "./context/ModalContext.jsx";
import { TemplateProvider } from "./context/TemplateContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const loadGlobalSettings = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/settings`);

    // 🔹 Set Company Name
    if (data?.companyName) {
      document.title = data.companyName;
    }

    // 🔹 Set Favicon
    if (data?.favicon) {
      const faviconElement = document.getElementById("dynamic-favicon");
      if (faviconElement) {
        const baseUrl = API_URL.replace("/api", "");
        faviconElement.href = `${baseUrl}/${data.favicon.replace(/\\/g, "/")}`;
      }
    }
  } catch (error) {
    console.error("Failed to load global settings:", error);
  }
};

loadGlobalSettings().finally(() => {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <ModalProvider>
        <TemplateProvider>
          <App />
        </TemplateProvider>
      </ModalProvider>
    </StrictMode>
  );
});
