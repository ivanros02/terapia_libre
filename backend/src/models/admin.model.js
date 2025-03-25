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
}

module.exports = Admin; // 🔹 CommonJS (igual que Usuario.js)
