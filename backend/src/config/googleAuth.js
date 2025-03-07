const { OAuth2Client } = require('google-auth-library');
const credentials = require('../../google-credentials.json');

const oAuth2Client = new OAuth2Client(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

module.exports = oAuth2Client;
