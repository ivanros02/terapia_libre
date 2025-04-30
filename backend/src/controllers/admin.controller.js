const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const generarToken = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.loginAdmin = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const admin = await Admin.findByEmail(correo);

        if (!admin) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        const esCorrecto = await bcrypt.compare(contrasena, admin.contrasena);
        if (!esCorrecto) {
            return res.status(401).json({ message: "Correo o contraseña incorrectos." });
        }

        res.json({
            message: "Inicio de sesión exitoso.",
            token: generarToken(admin.id),  // ✅ Ahora solo el ID
            admin: { id: admin.id, nombre: admin.nombre, correo: admin.correo }
        });

    } catch (error) {
        console.error("Error en loginAdmin:", error);
        res.status(400).json({
            message: "Ocurrió un error inesperado. Verificá los datos o intentá más tarde.",
        });
    }
};

exports.getProfesionalesAdmin = async (req, res) => {
    try {
        // 🔹 Obtener todos los profesionales sin límite ni paginación
        const profesionales = await Admin.getAllWithoutFilters();

        res.json({ professionals: profesionales });
    } catch (error) {
        console.error("Error al obtener profesionales para admin:", error);
        res.status(400).json({
            message: "No se pudieron obtener los profesionales."
        });
    }
};



