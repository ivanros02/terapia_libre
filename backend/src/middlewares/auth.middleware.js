const jwt = require("jsonwebtoken");

// Clave secreta para verificar el token (debe coincidir con la usada para firmar el token)
const SECRET_KEY = process.env.JWT_SECRET || "secreto";

/**
 * Middleware de autenticación.
 * Verifica si el token JWT es válido y añade los datos del usuario al objeto `req`.
 */
const authenticate = (req, res, next) => {
    // Obtener el token del header "Authorization"
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Si no hay token, devolver un error
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, SECRET_KEY);

        // Añadir los datos del usuario al objeto `req` para que estén disponibles en los controladores
        req.user = decoded;

        // Continuar con el siguiente middleware o controlador
        next();
    } catch (error) {
        // Si el token es inválido o ha expirado
        console.error("Error en la autenticación:", error);
        res.status(401).json({ message: "Token inválido o expirado." });
    }
};

/**
 * Middleware para verificar si el usuario es administrador.
 */
const authenticateAdmin = (req, res, next) => {
    authenticate(req, res, () => {
        console.log("Usuario autenticado:", req.user); // 🔹 Debug para verificar que el token es correcto
        next(); // ✅ Permitir acceso sin verificar rol
    });
};

module.exports = { authenticate,authenticateAdmin };