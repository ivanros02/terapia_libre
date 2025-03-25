const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Profesional = require("../models/profesional.model");

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
        res.status(500).json({ message: "Error en el servidor." });
    }
};

exports.getProfesionalesAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        // 🔹 Pasa `null` en los filtros para que no se apliquen
        const profesionales = await Profesional.getAll(limit, offset, null, null, null, true);

        const totalProfesionales = await Profesional.getTotalCount(null, null); // También sin filtros

        const totalPages = Math.ceil(totalProfesionales / limit);

        res.json({ professionals: profesionales, totalPages });
    } catch (error) {
        console.error("Error al obtener profesionales para admin:", error);
        res.status(500).json({ message: error.message });
    }
};

