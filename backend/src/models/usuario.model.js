const pool = require("../config/db");

class Usuario {
  static async create({ correo_electronico, contrasena_hash, nombre, id_google }) {
    // 1️⃣ Verificar si el correo ya existe
    const [existingUsers] = await pool.execute(
      `SELECT id_usuario FROM usuarios WHERE correo_electronico = ?`,
      [correo_electronico]
    );

    if (existingUsers.length > 0) {
      throw new Error("El correo ya está registrado.");
    }

    // 2️⃣ Si el correo no existe, insertar el nuevo usuario
    const [result] = await pool.execute(
      `INSERT INTO usuarios (correo_electronico, contrasena_hash, nombre, id_google) VALUES (?, ?, ?, ?)`,
      [correo_electronico, contrasena_hash, nombre, id_google]
    );

    return result.insertId;
  }


  static async findByEmail(correo_electronico) {
    const [rows] = await pool.execute(
      `SELECT * FROM usuarios WHERE correo_electronico = ?`,
      [correo_electronico]
    );
    return rows[0]; // Retorna el usuario si existe
  }

  static async findByGoogleId(id_google) {
    const [rows] = await pool.execute(
      `SELECT * FROM usuarios WHERE id_google = ?`,
      [id_google]
    );
    return rows[0]; // Retorna el usuario si existe
  }

  static async findById(id_profesional) {
    const [rows] = await pool.execute(
      `SELECT * FROM usuarios WHERE id_usuario = ?`,
      [id_profesional]
    );
    return rows[0]; // Retorna el profesional si existe
  }
}

module.exports = Usuario;
