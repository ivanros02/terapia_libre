const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// 🔹 Reemplaza esto con el código que copiaste de la URL
const authorizationCode = "4/0AQSTgQFbkei7Il8SFxSh4GMv8Z38SaMDl3WwjHw2lqbuI6SZi24V7VcOsc_yCVd53rkWjw";

const getRefreshToken = async () => {
    try {
        const { tokens } = await oauth2Client.getToken(authorizationCode);
        console.log("🔑 Tu Refresh Token:", tokens.refresh_token);
    } catch (error) {
        console.error("❌ Error obteniendo el Refresh Token:", error);
    }
};

getRefreshToken();
