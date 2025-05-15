const { getAuthUrl, getAccessToken } = require('../config/googleAuth');

exports.authGoogle = (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
};

exports.googleCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const tokens = await getAccessToken(code);
    // Guarda el token en la base de datos o en el perfil de sesión del usuario
    res.json({ message: 'Autenticación exitosa', tokens });
  } catch (error) {
    console.error("Error en googleCallback:", error);
    res.status(400).json({ message: "No se pudo completar la autenticación con Google. Intentá nuevamente." });
  }
};
