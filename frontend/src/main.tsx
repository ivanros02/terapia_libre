// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SocketProvider } from "./context/SocketContext"; // Importar SocketProvider

const GOOGLE_CLIENT_ID = "1005376109174-8j00pst6p2d1g0a5o330brpavnnbc731.apps.googleusercontent.com"; // Usa el ID de cliente de Google

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <SocketProvider> {/* Envolver la aplicación con SocketProvider */}
        <App />
      </SocketProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);