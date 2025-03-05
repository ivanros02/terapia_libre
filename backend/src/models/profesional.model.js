const pool = require("../config/db");

class Profesional {

  static async create({ nombre, titulo_universitario, matricula_nacional, matricula_provincial, descripcion, telefono, disponibilidad, correo_electronico, contrasena_hash, foto_perfil_url, valor, valor_internacional }) {
    const [result] = await pool.execute(
      `INSERT INTO profesionales (nombre, titulo_universitario, matricula_nacional, matricula_provincial, descripcion, telefono, disponibilidad, correo_electronico, contrasena_hash, foto_perfil_url, valor, valor_internacional) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, titulo_universitario, matricula_nacional, matricula_provincial, descripcion, telefono, disponibilidad, correo_electronico, contrasena_hash, foto_perfil_url, valor, valor_internacional]
    );
    return result.insertId;
  }

  static async assignEspecialidades(id_profesional, especialidades) {
    if (especialidades.length === 0) return;

    const values = especialidades.map(id_especialidad => [id_profesional, id_especialidad]);
    await pool.query(`INSERT INTO profesional_especialidad (id_profesional, id_especialidad) VALUES ?`, [values]);
  }

  static async getAll() {
    const [rows] = await pool.execute(`SELECT p.id_profesional, p.nombre, p.foto_perfil_url, p.disponibilidad, p.valor, 
               GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades
        FROM profesionales p
        LEFT JOIN profesional_especialidad pe ON p.id_profesional = pe.id_profesional
        LEFT JOIN especialidades e ON pe.id_especialidad = e.id_especialidad
        GROUP BY p.id_profesional`);
    return rows;
  }

  static async findByEmail(correo_electronico) {
    const [rows] = await pool.execute(
      `SELECT * FROM profesionales WHERE correo_electronico = ?`,
      [correo_electronico]
    );
    return rows[0]; // Retorna el usuario si existe
  }

}

module.exports = Profesional;
