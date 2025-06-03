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

    static async getAllUsuarios() {
        const [rows] = await pool.execute(
            `
            SELECT 
                id_usuario,
                nombre,
                correo_electronico,
                telefono,
                created_at,
                id_google
            FROM usuarios 
            ORDER BY created_at DESC
            `
        );
        return rows;
    }

    // 🔹 Estadísticas del dashboard
    static async getDashboardStatistics() {
        const [stats] = await pool.execute(`
    SELECT 
      (SELECT COUNT(*) FROM usuarios) as total_usuarios,
      (SELECT COUNT(*) FROM profesionales WHERE estado = 1) as profesionales_activos,
      (SELECT COUNT(*) FROM turnos WHERE estado = 'Pendiente') as turnos_pendientes,
      (SELECT COUNT(*) FROM turnos WHERE estado = 'Confirmado') as turnos_confirmados,
      (SELECT COUNT(*) FROM turnos WHERE fecha_turno >= CURDATE()) as turnos_futuros,
      (SELECT COUNT(*) FROM pagos WHERE estado = 'Pendiente') as pagos_pendientes,
      (SELECT COUNT(*) FROM pagos WHERE estado = 'Pagado') as pagos_completados,
      (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE estado = 'Pagado' AND DATE(fecha_pago) = CURDATE()) as ingresos_hoy,
      (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE estado = 'Pagado' AND YEARWEEK(fecha_pago) = YEARWEEK(NOW())) as ingresos_semana
  `);
        return stats[0];
    }

    // 🔹 Turnos con todos los detalles
    static async getTurnosWithDetails(filtros = {}) {
        let query = `
    SELECT 
      t.id_turno,
      t.fecha_turno,
      t.hora_turno,
      t.estado as estado_turno,
      t.motivo_cancelacion,
      t.creado_en,
      t.meet_url,
      t.meet_creado_en,
      t.google_event_id_paciente,
      t.google_event_id_profesional,
      
      u.id_usuario,
      u.nombre as nombre_usuario,
      u.correo_electronico as correo_usuario,
      u.telefono as telefono_usuario,
      
      p.id_profesional,
      p.nombre as nombre_profesional,
      p.correo_electronico as correo_profesional,
      
      pago.id_pago,
      pago.monto,
      pago.metodo_pago,
      pago.estado as estado_pago,
      pago.id_transaccion,
      pago.fecha_pago
      
    FROM turnos t
    LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
    LEFT JOIN profesionales p ON t.id_profesional = p.id_profesional
    LEFT JOIN pagos pago ON t.id_turno = pago.id_turno
    WHERE 1=1
  `;

        const params = [];

        if (filtros.estado) {
            query += ` AND t.estado = ?`;
            params.push(filtros.estado);
        }

        if (filtros.fecha_desde) {
            query += ` AND t.fecha_turno >= ?`;
            params.push(filtros.fecha_desde);
        }

        if (filtros.fecha_hasta) {
            query += ` AND t.fecha_turno <= ?`;
            params.push(filtros.fecha_hasta);
        }

        if (filtros.id_usuario) {
            query += ` AND t.id_usuario = ?`;
            params.push(filtros.id_usuario);
        }

        if (filtros.id_profesional) {
            query += ` AND t.id_profesional = ?`;
            params.push(filtros.id_profesional);
        }

        query += ` ORDER BY t.fecha_turno DESC, t.hora_turno DESC`;

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    // 🔹 Detalles completos de un turno específico
    static async getTurnoCompleteDetails(id_turno) {
        const [rows] = await pool.execute(`
    SELECT 
      t.*,
      u.nombre as nombre_usuario,
      u.correo_electronico as correo_usuario,
      u.telefono as telefono_usuario,
      u.id_google as id_google_usuario,
      
      p.nombre as nombre_profesional,
      p.correo_electronico as correo_profesional,
      p.telefono as telefono_profesional,
      p.valor,
      
      pago.id_pago,
      pago.monto,
      pago.metodo_pago,
      pago.estado as estado_pago,
      pago.id_transaccion,
      pago.fecha_pago
      
    FROM turnos t
    LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
    LEFT JOIN profesionales p ON t.id_profesional = p.id_profesional
    LEFT JOIN pagos pago ON t.id_turno = pago.id_turno
    WHERE t.id_turno = ?
  `, [id_turno]);

        return rows[0];
    }

    // 🔹 Pagos con detalles
    // Model - Admin.js (modificación del método getPagosWithDetails)
    static async getPagosWithDetails(filtros = {}) {
        let query = `
        SELECT 
            pago.*,
            t.fecha_turno,
            t.hora_turno,
            t.estado as estado_turno,
            u.nombre as nombre_usuario,
            u.correo_electronico as correo_usuario,
            p.nombre as nombre_profesional,
            cu.codigo_cupon,
            cu.usado_en as fecha_uso_cupon,
            CASE 
                WHEN cu.codigo_cupon IS NOT NULL THEN 'Si' 
                ELSE 'No' 
            END as tiene_cupon
        FROM pagos pago
        LEFT JOIN turnos t ON pago.id_turno = t.id_turno
        LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
        LEFT JOIN profesionales p ON t.id_profesional = p.id_profesional
        LEFT JOIN cupones_usados cu ON u.id_usuario = cu.id_usuario 
            AND DATE(cu.usado_en) = DATE(pago.fecha_pago)
        WHERE 1=1
    `;

        const params = [];

        if (filtros.estado) {
            query += ` AND pago.estado = ?`;
            params.push(filtros.estado);
        }

        if (filtros.metodo_pago) {
            query += ` AND pago.metodo_pago = ?`;
            params.push(filtros.metodo_pago);
        }

        if (filtros.fecha_desde) {
            query += ` AND DATE(pago.fecha_pago) >= ?`;
            params.push(filtros.fecha_desde);
        }

        if (filtros.fecha_hasta) {
            query += ` AND DATE(pago.fecha_pago) <= ?`;
            params.push(filtros.fecha_hasta);
        }

        // Nuevo filtro para cupones
        if (filtros.tiene_cupon) {
            if (filtros.tiene_cupon === 'Si') {
                query += ` AND cu.codigo_cupon IS NOT NULL`;
            } else if (filtros.tiene_cupon === 'No') {
                query += ` AND cu.codigo_cupon IS NULL`;
            }
        }

        query += ` ORDER BY pago.fecha_pago DESC`;

        const [rows] = await pool.execute(query, params);
        return rows;
    }

    static async getDashboardStatistics() {
        try {
            const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM usuarios) as total_usuarios,
        (SELECT COUNT(*) FROM profesionales WHERE estado = 1) as profesionales_activos,
        (SELECT COUNT(*) FROM turnos WHERE estado = 'Pendiente') as turnos_pendientes,
        (SELECT COUNT(*) FROM turnos WHERE estado = 'Confirmado') as turnos_confirmados,
        (SELECT COUNT(*) FROM turnos WHERE fecha_turno >= CURDATE()) as turnos_futuros,
        (SELECT COUNT(*) FROM pagos WHERE estado = 'Pendiente') as pagos_pendientes,
        (SELECT COUNT(*) FROM pagos WHERE estado = 'Pagado') as pagos_completados,
        (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE estado = 'Pagado' AND DATE(fecha_pago) = CURDATE()) as ingresos_hoy,
        (SELECT COALESCE(SUM(monto), 0) FROM pagos WHERE estado = 'Pagado' AND YEARWEEK(fecha_pago) = YEARWEEK(NOW())) as ingresos_semana
    `);
            return stats[0];
        } catch (error) {
            console.error("Error en getDashboardStatistics:", error);
            throw error;
        }
    }

}

module.exports = Admin; // 🔹 CommonJS (igual que Usuario.js)
