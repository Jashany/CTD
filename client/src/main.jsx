import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";

const ClientID = "62859005195-hr597m0g5jf0khahkli4rhcuo2ttoc41.apps.googleusercontent.com"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={ClientID}>
    <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
