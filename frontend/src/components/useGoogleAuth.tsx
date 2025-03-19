import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = "1005376109174-8j00pst6p2d1g0a5o330brpavnnbc731.apps.googleusercontent.com";
export const SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly";

export const useGoogleAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [googleAuth, setGoogleAuth] = useState<any>(null);

  useEffect(() => {
    const initClient = () => {
      gapi.load("client:auth2", () => {
        gapi.client.init({
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
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              console.error("Error loading Google API", error.message);
            } else {
              console.error("Unknown error loading Google API", error);
            }
          });
      });
    };

    initClient();
  }, []);


  const signIn = () => googleAuth?.signIn();
  const signOut = () => googleAuth?.signOut();

  return { isSignedIn, signIn, signOut };
};
