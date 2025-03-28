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

    // 🔹 Verificar si la matrícula provincial ya existe
    const [existingMatricula] = await pool.execute(
      `SELECT matricula_provincial FROM profesionales WHERE matricula_provincial = ?`,
      [matricula_provincial]
    );

    if (existingMatricula.length > 0) {
      throw new Error("La matrícula provincial ya está registrada. Verifica los datos.");
    }

    const [existingMatriculaNacional] = await pool.execute(
      `SELECT matricula_nacional FROM profesionales WHERE matricula_nacional = ?`,
      [matricula_nacional]
    );

    if (existingMatriculaNacional.length > 0) {
      throw new Error("La matrícula nacional ya está registrada. Verifica los datos.");
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

  static async getAll(limit, offset, especialidad = null, disponibilidad = null, orden = null) {
    let whereClauses = ["p.estado = 1"]; // 🔹 Filtrar solo profesionales activos

    let queryParams = [];

    // 🔹 Filtrar por especialidad si está definida
    if (especialidad) {
      whereClauses.push("e.nombre LIKE ?");
      queryParams.push(`%${especialidad}%`);
    }

    // 🔹 Filtrar por disponibilidad si está definida
    if (disponibilidad) {
      whereClauses.push("p.disponibilidad = ?");
      queryParams.push(disponibilidad);
    }

    // 🔹 Construir la consulta SQL dinámicamente
    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // 🔹 Ordenar por precio si se especifica
    let orderClause = "";
    if (orden === "asc") {
      orderClause = "ORDER BY p.valor ASC";
    } else if (orden === "desc") {
      orderClause = "ORDER BY p.valor DESC";
    } else {
      orderClause = "ORDER BY p.creado_en DESC"; // Orden predeterminado
    }

    const [rows] = await pool.execute(
      `
        SELECT p.id_profesional, p.nombre, p.foto_perfil_url, p.disponibilidad, p.valor, p.estado, 
               GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades, p.correo_electronico, p.creado_en
        FROM profesionales p
        LEFT JOIN profesional_especialidad pe ON p.id_profesional = pe.id_profesional
        LEFT JOIN especialidades e ON pe.id_especialidad = e.id_especialidad
        ${whereClause}
        GROUP BY p.id_profesional
        ${orderClause}
        LIMIT ? OFFSET ?
        `,
      [...queryParams, limit, offset]
    );

    return rows;
  }




  // Nuevo método para obtener el total de profesionales
  static async getTotalCount(especialidad = null, disponibilidad = null) {
    let whereClauses = ["estado = 1"];
    let queryParams = [];

    if (especialidad) {
      whereClauses.push("id_profesional IN (SELECT pe.id_profesional FROM profesional_especialidad pe JOIN especialidades e ON pe.id_especialidad = e.id_especialidad WHERE e.nombre LIKE ?)");
      queryParams.push(`%${especialidad}%`);
    }

    if (disponibilidad) {
      whereClauses.push("disponibilidad = ?");
      queryParams.push(disponibilidad);
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const [total] = await pool.execute(
      `SELECT COUNT(*) AS total FROM profesionales ${whereClause}`,
      queryParams
    );

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
    const fields = [];
    const values = [];

    Object.keys(data).forEach((key) => {
      if (key === "estado") {
        fields.push(`${key} = ?`);
        values.push(data[key] ? 1 : 0); // 🔹 Convertir `true/false` a `1/0`
      } else {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    });

    values.push(id_profesional);

    if (fields.length === 0) {
      throw new Error("No se proporcionaron datos para actualizar");
    }

    const query = `UPDATE profesionales SET ${fields.join(", ")} WHERE id_profesional = ?`;

    console.log("Ejecutando SQL:", query, values); // 🔹 Log para depuración

    await pool.execute(query, values);
  }

  static async updateEspecialidades(id_profesional, especialidades) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 🔹 Obtener las especialidades actuales del profesional
      const [currentEspecialidades] = await connection.execute(
        `SELECT id_especialidad FROM profesional_especialidad WHERE id_profesional = ?`,
        [id_profesional]
      );

      const currentEspecialidadesSet = new Set(currentEspecialidades.map(e => e.id_especialidad));
      const newEspecialidadesSet = new Set(especialidades);

      // 🔹 Determinar cambios
      const especialidadesAEliminar = [...currentEspecialidadesSet].filter(e => !newEspecialidadesSet.has(e));
      const especialidadesAInsertar = [...newEspecialidadesSet].filter(e => !currentEspecialidadesSet.has(e));

      // 🔹 Eliminar solo las especialidades que fueron deseleccionadas
      if (especialidadesAEliminar.length > 0) {
        await connection.execute(
          `DELETE FROM profesional_especialidad WHERE id_profesional = ? AND id_especialidad IN (${especialidadesAEliminar.map(() => '?').join(', ')})`,
          [id_profesional, ...especialidadesAEliminar]
        );
      }

      // 🔹 Insertar solo las nuevas especialidades seleccionadas
      if (especialidadesAInsertar.length > 0) {
        const insertQueries = especialidadesAInsertar.map(id_especialidad =>
          connection.execute(
            `INSERT INTO profesional_especialidad (id_profesional, id_especialidad) VALUES (?, ?)`,
            [id_profesional, id_especialidad]
          )
        );
        await Promise.all(insertQueries);
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }


}

module.exports = Profesional;
