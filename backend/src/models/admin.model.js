const pool = require("../config/db");
const bcrypt = require("bcryptjs"); // 🔹 Cambiado a require

class Admin {
    static async findByEmail(correo) {
        const [rows] = await pool.execute(
            `SELECT id, nombre, correo, contrasena FROM admins WHERE correo = ?`,
            [correo]
        );
        return rows.length ? rows[0] : null;
    }

    static async getAllWithoutFilters() {
        const [rows] = await pool.execute(
            `
            SELECT p.id_profesional, p.nombre, p.foto_perfil_url, p.disponibilidad, p.valor, p.estado, 
                   GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades, p.correo_electronico, p.creado_en
            FROM profesionales p
            LEFT JOIN profesional_especialidad pe ON p.id_profesional = pe.id_profesional
            LEFT JOIN especialidades e ON pe.id_especialidad = e.id_especialidad
            GROUP BY p.id_profesional
            ORDER BY p.creado_en DESC
            `
        );
    
        return rows;
    }    

}

module.exports = Admin; // 🔹 CommonJS (igual que Usuario.js)
