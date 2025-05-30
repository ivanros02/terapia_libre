const { google } = require("googleapis");

const CLIENT_ID = "1046358666022-7p6r5abv40lu5b3c7inq67vvr2upjfuk.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://api.terapialibre.com.ar/api_terapia/google/auth/google/callback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const code = "4/0Ab_5qll6LgHt4gB49ii9nHb5lnPocW9TuxgDbUKHzU6o8osT4U8oe_C68gdJ9VqA4eWnrw"; // el code que te dio Google

oauth2Client.getToken(code).then(({ tokens }) => {
  console.log("✅ Tokens obtenidos:");
  console.log(tokens);
}).catch((err) => {
  console.error("❌ Error:", err);
});
