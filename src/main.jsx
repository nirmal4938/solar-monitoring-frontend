// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import GlobalLoader from "./components/global/GlobalLoader";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";  // ✅ IMPORTANT

import "./index.css";

// PrimeReact Core
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import './primeflex.css';
import { LoadingProvider } from "./context/LoadingContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>   {/* ✅ THIS FIXES YOUR ERROR */}
        <LoadingProvider>
        <App />
        {/* <ResumeBuilder/> */}
         <GlobalLoader />
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);