const pool = require("../config/db");

class Profesional {

  static async create({ nombre, titulo_universitario, matricula_nacional, matricula_provincial, descripcion, telefono, disponibilidad, correo_electronico, contrasena_hash, foto_perfil_url, valor, valor_internacional }) {
    // Verificar si el correo electrónico ya está registrado
    const [existingEmail] = await pool.execute(
      `SELECT correo_electronico FROM profesionales WHERE correo_electronico = ?`,
      [correo_electronico]
    );

    // Si el correo ya existe, lanzar un error
    if (existingEmail.length > 0) {
      throw new Error("El correo electrónico ya está registrado.");
    }

    // Si el correo no existe, proceder con la inserción
    const [result] = await pool.execute(
      `INSERT INTO profesionales (nombre, titulo_universitario, matricula_nacional, matricula_provincial, descripcion, telefono, disponibilidad, correo_electronico, contrasena_hash, foto_perfil_url, valor, valor_internacional) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, titulo_universitario, matricula_nacional, matricula_provincial, descripcion, telefono, disponibilidad, correo_electronico, contrasena_hash, foto_perfil_url, valor, valor_internacional]
    );

    return result.insertId;
  }

  static async getTurnoDelDia(id_profesional) {
    const [turno] = await pool.execute(
      `SELECT t.id_turno, t.fecha_turno, t.hora_turno, u.nombre AS nombre_paciente
       FROM turnos t
       JOIN usuarios u ON t.id_usuario = u.id_usuario
       WHERE t.id_profesional = ? 
         AND t.fecha_turno = CURDATE() 
         AND t.estado IN ('Pendiente', 'Confirmado')
       ORDER BY t.hora_turno ASC
       LIMIT 1`,
      [id_profesional]
    );

    return turno.length > 0 ? turno[0] : null;
  }

  static async getProximosTurnos(id_profesional) {
    const [turnos] = await pool.execute(
      `SELECT t.fecha_turno, u.nombre AS paciente
       FROM turnos t
       JOIN usuarios u ON t.id_usuario = u.id_usuario
       WHERE t.id_profesional = ? 
         AND t.fecha_turno >= CURDATE() 
         AND t.estado IN ('Pendiente', 'Confirmado')
       ORDER BY t.fecha_turno ASC
       LIMIT 10`,
      [id_profesional]
    );

    return turnos;
  }

  static async assignEspecialidades(id_profesional, especialidades) {
    if (especialidades.length === 0) return;

    const values = especialidades.map(id_especialidad => [id_profesional, id_especialidad]);
    await pool.query(`INSERT INTO profesional_especialidad (id_profesional, id_especialidad) VALUES ?`, [values]);
  }

  static async getAll(limit, offset) {
    const [rows] = await pool.execute(`
        SELECT p.id_profesional, p.nombre, p.foto_perfil_url, p.disponibilidad, p.valor, 
               GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades
        FROM profesionales p
        LEFT JOIN profesional_especialidad pe ON p.id_profesional = pe.id_profesional
        LEFT JOIN especialidades e ON pe.id_especialidad = e.id_especialidad
        GROUP BY p.id_profesional
        LIMIT ? OFFSET ?
    `, [limit, offset]);
    return rows;
  }

  // Nuevo método para obtener el total de profesionales
  static async getTotalCount() {
    const [total] = await pool.execute("SELECT COUNT(*) AS total FROM profesionales");
    return total[0].total;
  }

  static async findByEmail(correo_electronico) {
    const [rows] = await pool.execute(
      `SELECT *,id_profesional AS id_usuario FROM profesionales WHERE correo_electronico = ?`,
      [correo_electronico]
    );
    return rows[0]; // Retorna el usuario si existe
  }

  static async findById(id_profesional) {
    // Obtener todos los datos del profesional
    const [rows] = await pool.execute(
      `SELECT * FROM profesionales WHERE id_profesional = ?`,
      [id_profesional]
    );

    if (rows.length === 0) return null; // Si no existe, devolver null

    let profesional = rows[0];

    // Obtener especialidades asociadas
    const [especialidades] = await pool.execute(
      `SELECT e.nombre 
       FROM especialidades e
       JOIN profesional_especialidad pe ON e.id_especialidad = pe.id_especialidad
       WHERE pe.id_profesional = ?`,
      [id_profesional]
    );

    // Agregar especialidades como un array de strings al objeto profesional
    profesional.especialidades = especialidades.map(e => e.nombre);

    return profesional; // Ahora incluye todos los datos y especialidades
  }

  static async update(id_profesional, data) {
    const { nombre, titulo_universitario, matricula_nacional, matricula_provincial, descripcion, telefono, disponibilidad, correo_electronico, foto_perfil_url, valor, valor_internacional } = data;

    await pool.execute(
      `UPDATE profesionales 
         SET nombre = ?, titulo_universitario = ?, matricula_nacional = ?, matricula_provincial = ?, descripcion = ?, telefono = ?, disponibilidad = ?, correo_electronico = ?, foto_perfil_url = ?, valor = ?, valor_internacional = ?
         WHERE id_profesional = ?`,
      [nombre, titulo_universitario, matricula_nacional, matricula_provincial, descripcion, telefono, disponibilidad, correo_electronico, foto_perfil_url, valor, valor_internacional, id_profesional]
    );
  }

}

module.exports = Profesional;
