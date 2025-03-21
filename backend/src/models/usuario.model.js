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

  static async editarUsuario(id_usuario, { nombre, correo_electronico, contrasena_hash }) {
    let query = "UPDATE usuarios SET ";
    let fields = [];
    let values = [];

    if (nombre) {
      fields.push("nombre = ?");
      values.push(nombre);
    }
    if (correo_electronico) {
      fields.push("correo_electronico = ?");
      values.push(correo_electronico);
    }
    if (contrasena_hash) {
      fields.push("contrasena_hash = ?");
      values.push(contrasena_hash);
    }

    if (fields.length === 0) return false; // Si no hay datos, no actualiza nada

    query += fields.join(", ") + " WHERE id_usuario = ?";
    values.push(id_usuario);

    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

}

module.exports = Usuario;
