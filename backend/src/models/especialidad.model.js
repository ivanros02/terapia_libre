const pool = require("../config/db");

class Especialidad {
  static async create({ nombre }) {
    const [result] = await pool.execute(
      `INSERT INTO especialidades (nombre) VALUES (?)`,
      [nombre]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute(`SELECT * FROM especialidades ORDER BY CHAR_LENGTH(nombre) ASC;`);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute(`SELECT * FROM especialidades WHERE id_especialidad = ?`, [id]);
    return rows[0] || null;
  }

  static async update(id, { nombre }) {
    const [result] = await pool.execute(
      `UPDATE especialidades SET nombre = ? WHERE id_especialidad = ?`,
      [nombre, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      `DELETE FROM especialidades WHERE id_especialidad = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Especialidad;
