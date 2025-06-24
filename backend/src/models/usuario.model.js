const pool = require("../config/db");

class Usuario {
  static async create(data) {
    // 1️⃣ Verificar si el correo ya existe
    const [existingUsers] = await pool.execute(
      `SELECT id_usuario FROM usuarios WHERE correo_electronico = ?`,
      [data.correo_electronico]
    );

    if (existingUsers.length > 0) {
      throw new Error("El correo ya está registrado.");
    }

    // 2️⃣ Verificar si el correo ya existe en la tabla profesionales
    const [existingProfesionales] = await pool.execute(
      `SELECT id_profesional FROM profesionales WHERE correo_electronico = ?`,
      [data.correo_electronico]
    );

    if (existingProfesionales.length > 0) {
      throw new Error("El correo ya está registrado como profesional.");
    }

    // 3️⃣ Insertar el nuevo usuario
    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?');
    const values = Object.values(data);

    const query = `INSERT INTO usuarios (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
    const [result] = await pool.execute(query, values);

    return result.insertId;
  }


  static async findByEmail(correo_electronico) {
    const [rows] = await pool.execute(
      `SELECT * FROM usuarios WHERE correo_electronico = ?`,
      [correo_electronico]
    );
    return rows[0]; // Retorna el usuario si existe
  }

  static async findByGoogleId(id_google, correo_electronico = null) {
    // 🔒 Validar si el correo existe en profesionales
    if (correo_electronico) {
      const [profesionales] = await pool.execute(
        `SELECT 1 FROM profesionales WHERE correo_electronico = ? LIMIT 1`,
        [correo_electronico]
      );
      if (profesionales.length > 0) {
        throw new Error("PROFESIONAL_REGISTRADO");
      }
    }

    // 🔍 Buscar usuario con Google ID
    const [rows] = await pool.execute(
      `SELECT * FROM usuarios WHERE id_google = ?`,
      [id_google]
    );
    return rows[0];
  }


  static async findById(id_profesional) {
    const [rows] = await pool.execute(
      `SELECT * FROM usuarios WHERE id_usuario = ?`,
      [id_profesional]
    );
    return rows[0]; // Retorna el profesional si existe
  }

  static async editarUsuario(id_usuario, data) {
    let query = "UPDATE usuarios SET ";
    let fields = [];
    let values = [];

    Object.keys(data).forEach((key) => {
      if (key !== 'contrasena_actual') {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    if (fields.length === 0) return false;

    query += fields.join(", ") + " WHERE id_usuario = ?";
    values.push(id_usuario);

    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  }

  // Buscar usuario o profesional por correo
  static async findByEmailResetPassword(correo) {
    try {
      const [usuario] = await pool.query("SELECT id_usuario, id_google FROM usuarios WHERE correo_electronico = ?", [correo]);
      if (usuario.length) return { ...usuario[0], tipo: "usuario" };

      const [profesional] = await pool.query("SELECT id_profesional FROM profesionales WHERE correo_electronico = ?", [correo]);
      if (profesional.length) return { ...profesional[0], tipo: "profesional" };

      return null;
    } catch (error) {
      console.error("Error en findByEmail:", error);
      throw error;
    }
  }

  // Guardar token de recuperación
  static async saveResetToken(id, tipo, token, expiracion) {
    try {
      const tabla = tipo === "usuario" ? "usuarios" : "profesionales";
      const campo = tipo === "usuario" ? "id_usuario" : "id_profesional";

      await pool.query(`UPDATE ${tabla} SET reset_token = ?, reset_token_expira = ? WHERE ${campo} = ?`, [token, expiracion, id]);
    } catch (error) {
      console.error("Error en saveResetToken:", error);
      throw error;
    }
  }

  // Buscar usuario o profesional por token
  static async findByToken(token) {
    try {
      const [usuario] = await pool.query("SELECT id_usuario FROM usuarios WHERE reset_token = ? AND reset_token_expira > ?", [token, Date.now()]);
      if (usuario.length) return { id: usuario[0].id_usuario, tipo: "usuario" };

      const [profesional] = await pool.query("SELECT id_profesional FROM profesionales WHERE reset_token = ? AND reset_token_expira > ?", [token, Date.now()]);
      if (profesional.length) return { id: profesional[0].id_profesional, tipo: "profesional" };

      return null;
    } catch (error) {
      console.error("Error en findByToken:", error);
      throw error;
    }
  }

  // Actualizar contraseña
  static async updatePassword(id, tipo, hashedPassword) {
    try {
      const tabla = tipo === "usuario" ? "usuarios" : "profesionales";
      const campo = tipo === "usuario" ? "id_usuario" : "id_profesional";

      await pool.query(`UPDATE ${tabla} SET contrasena_hash = ?, reset_token = NULL, reset_token_expira = NULL WHERE ${campo} = ?`, [hashedPassword, id]);
    } catch (error) {
      console.error("Error en updatePassword:", error);
      throw error;
    }
  }
}


module.exports = Usuario;
