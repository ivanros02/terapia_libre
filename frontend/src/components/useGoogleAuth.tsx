import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
const client_id = import.meta.env.VITE_GOOGLE_CLIENT;
const CLIENT_ID = client_id;
export const SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";

export const useGoogleAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [googleAuth, setGoogleAuth] = useState<any>(null);

  useEffect(() => {
    const initClient = async () => {
      try {
        await new Promise((resolve, reject) => {
          gapi.load("client:auth2", () => {
            gapi.client
              .init({
                clientId: CLIENT_ID,
                discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
                scope: SCOPES,
                ux_mode: "popup",
              })
              .then(() => {
                const authInstance = gapi.auth2.getAuthInstance();
                setGoogleAuth(authInstance);
                setIsSignedIn(authInstance.isSignedIn.get());
                authInstance.isSignedIn.listen(setIsSignedIn);
                verificarPermisos(); // 🔹 Verifica permisos después de iniciar sesión
                resolve(true);
              })
              .catch((error: unknown) => {
                manejarError(error, "Error al inicializar Google API");
                reject(error);
              });
          });
        });
      } catch (error: unknown) {
        manejarError(error, "Error en initClient");
      }
    };

    initClient();
  }, []);

  // 🔹 Función para manejar errores correctamente
  const manejarError = (error: unknown, mensaje: string) => {
    if (error instanceof Error) {
      console.error(`❌ ${mensaje}:`, error.message);
    } else {
      console.error(`❌ ${mensaje}:`, error);
    }
  };

  // 🔹 Función para verificar permisos del usuario
  const verificarPermisos = () => {
    if (!googleAuth) return;

    const user = googleAuth.currentUser.get();
    const grantedScopes = user.getGrantedScopes();
    if (!grantedScopes.includes("https://www.googleapis.com/auth/calendar.events")) {
      console.warn("⚠️ Permisos insuficientes. Se requiere reautenticación.");
      signIn(); // 🔹 Si no tiene los permisos correctos, fuerza reautenticación
    } else {
      console.log("✅ Permisos correctos para Google Calendar.");
    }
  };

  // 🔹 Función para forzar la autenticación con los permisos correctos
  const signIn = async () => {
    if (!googleAuth) return;

    try {
      await googleAuth.signIn({
        scope: SCOPES,
        prompt: "consent", // 🔹 Forzar a Google a pedir permisos nuevamente
      });

      verificarPermisos(); // 🔹 Verifica los permisos después de iniciar sesión
    } catch (error: unknown) {
      manejarError(error, "Error al autenticar usuario");
    }
  };

  const signOut = () => {
    googleAuth?.signOut();
    setIsSignedIn(false);
    console.log("👋 Usuario cerró sesión en Google.");
  };

  return { isSignedIn, signIn, signOut };
};
