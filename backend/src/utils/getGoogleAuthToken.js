const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const getAuthUrl = async () => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline", // 🔹 Necesario para obtener el Refresh Token
        scope: SCOPES,
    });
    console.log("🔗 Autoriza esta aplicación visitando esta URL:", authUrl);
};

getAuthUrl();
