const pool = require("../config/db");
const bcrypt = require("bcryptjs");



class Profesional {

  static async create(data) {
    const [existingEmail] = await pool.execute(
      `SELECT correo_electronico FROM profesionales WHERE correo_electronico = ?`,
      [data.correo_electronico]
    );

    if (existingEmail.length > 0) {
      throw new Error("El correo electrónico ya está registrado como profesional.");
    }

    const [existingUserEmail] = await pool.execute(
      `SELECT correo_electronico FROM usuarios WHERE correo_electronico = ?`,
      [data.correo_electronico]
    );

    if (existingUserEmail.length > 0) {
      throw new Error("El correo electrónico ya está registrado como usuario.");
    }

    if (data.cbu) {
      const [existingCbu] = await pool.execute(
        `SELECT cbu FROM profesionales WHERE cbu = ?`,
        [data.cbu]
      );

      if (existingCbu.length > 0) {
        throw new Error("El CBU/CVU ya está registrado.");
      }
    }

    // Construcción dinámica
    const fields = Object.keys(data);
    const placeholders = fields.map(() => '?');
    const values = Object.values(data);

    const query = `INSERT INTO profesionales (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`;
    const [result] = await pool.execute(query, values);

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

  static async getSesiones(id_profesional) {
    const [sesiones] = await pool.execute(
      `SELECT 
            t.id_turno as id,
            t.fecha_turno as date,
            t.hora_turno as time,
            u.nombre as patient,
            p.valor as value,
            t.estado as status
        FROM turnos t
        JOIN usuarios u ON t.id_usuario = u.id_usuario
        JOIN profesionales p ON t.id_profesional = p.id_profesional
        WHERE t.id_profesional = ?
        ORDER BY t.fecha_turno DESC, t.hora_turno DESC`,
      [id_profesional]
    );

    return sesiones.map(sesion => ({
      ...sesion,
      id: sesion.id.toString(),
      date: new Date(sesion.date).toLocaleDateString('es-AR'),
      time: sesion.time.slice(0, 5),
      status: sesion.status === 'Cancelado' ? 'cancelada' :
        sesion.status === 'Completado' ? 'completada' : 'pendiente',
      detail: sesion.status === 'Completado' ? 'Cargar factura' : null
    }));
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

  static async getAll(limit, offset, especialidad = null, disponibilidad = null, orden = null, seed = null) {
    let whereClauses = ["p.estado = 1"];
    let queryParams = [];

    if (especialidad) {
      whereClauses.push("e.nombre LIKE ?");
      queryParams.push(`%${especialidad}%`);
    }

    if (disponibilidad) {
      whereClauses.push("p.disponibilidad = ?");
      queryParams.push(disponibilidad);
    }

    const whereClause = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    let orderClause = "ORDER BY p.id_profesional ASC"; // Default sin random
    if (orden === "asc") orderClause = "ORDER BY p.valor ASC, p.id_profesional ASC";
    if (orden === "desc") orderClause = "ORDER BY p.valor DESC, p.id_profesional ASC";
    // Solo usar seed cuando NO hay orden por precio
    if (seed && (!orden || (orden !== "asc" && orden !== "desc"))) {
      orderClause = `ORDER BY RAND(${seed})`;
    }

    const sql = `
      SELECT 
        p.id_profesional, p.nombre, p.foto_perfil_url, p.disponibilidad, p.valor, p.estado, 
        GROUP_CONCAT(e.nombre SEPARATOR ', ') AS especialidades, 
        p.correo_electronico, p.creado_en
      FROM profesionales p
      LEFT JOIN profesional_especialidad pe ON p.id_profesional = pe.id_profesional
      LEFT JOIN especialidades e ON pe.id_especialidad = e.id_especialidad
      ${whereClause}
      GROUP BY p.id_profesional
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset); // ✅ Siempre agregar al final

    const [rows] = await pool.execute(sql, queryParams);
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
      `SELECT e.id_especialidad, e.nombre
       FROM especialidades e
       JOIN profesional_especialidad pe ON e.id_especialidad = pe.id_especialidad
       WHERE pe.id_profesional = ?`,
      [id_profesional]
    );

    // Nuevo formato: array de objetos
    profesional.especialidades = especialidades; // [{ id_especialidad: 1, nombre: 'Psicología' }, ...]

    return profesional; // Ahora incluye todos los datos y especialidades
  }

  static async verificarPassword(id, passwordActual) {
    const [rows] = await pool.query("SELECT contrasena_hash FROM profesionales WHERE id_profesional = ?", [id]);
    if (rows.length === 0) return false;
    return bcrypt.compare(passwordActual, rows[0].contrasena_hash);
  }

  static async actualizarPassword(id, nuevaPassword) {
    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    await pool.query("UPDATE profesionales SET contrasena_hash = ? WHERE id_profesional = ?", [hashedPassword, id]);
  }

  static async update(id_profesional, data) {
    const fields = [];
    const values = [];

    // Excluir campos que no deben actualizarse
    const excludedFields = ['contrasena_hash', 'creado_en', 'id_profesional'];

    Object.keys(data).forEach((key) => {
      if (!excludedFields.includes(key)) {
        if (key === "estado") {
          fields.push(`${key} = ?`);
          values.push(data[key] ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
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
