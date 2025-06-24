const pool = require("../config/db");
const { sendEmail } = require("../utils/emailService");

class Turno {
    static async crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno) {
        // 🔍 Verificar si ya existe el turno
        const [rows] = await pool.execute(
            `SELECT id_turno FROM turnos 
             WHERE id_profesional = ? AND id_usuario = ? AND fecha_turno = ? AND hora_turno = ?`,
            [id_profesional, id_usuario, fecha_turno, hora_turno]
        );

        if (rows.length > 0) {
            console.log("⚠️ Turno ya existente. No se crea uno nuevo.");
            return rows[0].id_turno; // Devolvés el ID existente
        }

        // ✅ Si no existe, se crea
        const [result] = await pool.execute(
            `INSERT INTO turnos (id_profesional, id_usuario, fecha_turno, hora_turno, estado) 
             VALUES (?, ?, ?, ?, 'Pendiente')`,
            [id_profesional, id_usuario, fecha_turno, hora_turno]
        );

        return result.insertId;
    }

    static async notificarTurnoConfirmado(id_turno) {
        // 🔎 Traer datos del turno, profesional y paciente
        const [rows] = await pool.execute(
            `SELECT t.fecha_turno, t.hora_turno,
                    u.nombre AS nombre_paciente, u.correo_electronico AS email_paciente,
                    p.nombre AS nombre_profesional, p.correo_electronico AS email_profesional
             FROM turnos t
             JOIN usuarios u ON t.id_usuario = u.id_usuario
             JOIN profesionales p ON t.id_profesional = p.id_profesional
             WHERE t.id_turno = ?`,
            [id_turno]
        );

        if (rows.length === 0) {
            throw new Error("Turno no encontrado");
        }

        const turno = rows[0];

        const fechaLocal = new Date(turno.fecha_turno).toLocaleDateString('es-AR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const horaLocal = turno.hora_turno.slice(0, 5);

        const asunto = ` ¡Tu espacio ya está reservado! 🧠✨`;

        const cuerpoMensaje = (conNombre) => `
            Hola,

            Queremos confirmarte que tu sesión con ${conNombre} fue reservada con éxito para el ${fechaLocal} a las ${horaLocal} hs.

            📍Cualquier duda, podés escribirnos:
            Por WhatsApp al +54 9 11 4448-2738 / +54 9 11 4419-1777

            O por mail a terapialibre@terapialibre.com.ar

            Gracias por confiar en Terapia Libre.
            Nos vemos en sesión.
        `;

        // Email para el paciente (menciona al profesional)
        await sendEmail({
            to: turno.email_paciente,
            subject: asunto,
            html: `<p>${cuerpoMensaje(turno.nombre_profesional).replace(/\n/g, "<br>")}</p>`,
        });

        // Email para el profesional (menciona al paciente)
        await sendEmail({
            to: turno.email_profesional,
            subject: asunto,
            html: `<p>${cuerpoMensaje(turno.nombre_paciente).replace(/\n/g, "<br>")}</p>`,
        });

    }

    static async verificarDisponibilidad(id_profesional, fecha_turno, hora_turno) {
        const [rows] = await pool.execute(
            `SELECT * FROM turnos WHERE id_profesional = ? AND fecha_turno = ? AND hora_turno = ? AND estado IN ('Pendiente', 'Confirmado')`,
            [id_profesional, fecha_turno, hora_turno]
        );
        return rows.length === 0; // Retorna true si el turno está disponible
    }

    static async obtenerTurnosPorProfesional(id_profesional) {
        const [rows] = await pool.execute(
            `SELECT turnos.* , usuarios.nombre AS nombre_paciente, usuarios.correo_electronico AS email_paciente,profesionales.correo_electronico AS email_profesional
            FROM turnos 
            LEFT JOIN usuarios ON turnos.id_usuario = usuarios.id_usuario
            LEFT JOIN profesionales ON turnos.id_profesional = profesionales.id_profesional
            WHERE turnos.id_profesional = ? 
            ORDER BY fecha_turno, hora_turno`,
            [id_profesional]
        );
        return rows;
    }

    static async obtenerTurnosPorProfesionalDashboard(id_profesional) {
        const [rows] = await pool.execute(
            `SELECT t.fecha_turno, t.hora_turno, u.nombre AS nombre_paciente
            FROM turnos t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            WHERE t.id_profesional = ?
            ORDER BY t.fecha_turno ASC, t.hora_turno ASC
            LIMIT 5`,
            [id_profesional]
        );
        return rows;
    }

    static async obtenerTurnosPorUsuarioDashboard(id_usuario) {
        const [rows] = await pool.execute(
            `SELECT t.fecha_turno, t.hora_turno, p.nombre AS nombre_profesional
            FROM turnos t
            JOIN profesionales p ON t.id_profesional = p.id_profesional
            WHERE t.id_usuario = ?
            ORDER BY t.fecha_turno ASC, t.hora_turno ASC
            LIMIT 5`,
            [id_usuario]
        );
        return rows;
    }

    static async cancelarTurno(id_turno, motivo) {
        const [result] = await pool.execute(
            `UPDATE turnos SET estado = 'Cancelado', motivo_cancelacion = ? WHERE id_turno = ?`,
            [motivo, id_turno]
        );
        return result.affectedRows;
    }

    static async obtenerTurnosPorUsuario(id_usuario) {
        try {
            const [rows] = await pool.execute(
                `SELECT turnos.*, profesionales.nombre AS nombre_profesional, profesionales.correo_electronico AS email_profesional,usuarios.correo_electronico AS email_paciente
                FROM turnos 
                LEFT JOIN profesionales ON turnos.id_profesional = profesionales.id_profesional
                LEFT JOIN usuarios ON turnos.id_usuario = usuarios.id_usuario
                WHERE turnos.id_usuario = ?
                ORDER BY fecha_turno, hora_turno`,
                [id_usuario]
            );
            return rows;
        } catch (error) {
            console.error("Error en la consulta de turnos del usuario:", error);
            throw new Error("Error al obtener los turnos del usuario.");
        }
    }

    // 🔹 Obtener el próximo turno más cercano
    static async obtenerProximoTurno(id_profesional) {
        const [turnos] = await pool.execute(
            `SELECT t.id_turno, u.nombre AS nombre_paciente, t.fecha_turno, t.hora_turno, t.meet_url
            FROM turnos t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            WHERE t.id_profesional = ? 
                AND DATE(t.fecha_turno) >= CURDATE()
                AND t.estado IN ('Pendiente', 'Confirmado')
            ORDER BY t.fecha_turno ASC, t.hora_turno ASC
            LIMIT 1`,
            [id_profesional]
        );
        return turnos.length > 0 ? turnos[0] : null;
    }

    static async obtenerProximoTurnoPaciente(id_usuario) {
        const [turnos] = await pool.execute(
            `SELECT t.id_turno, p.nombre AS nombre_profesional, t.fecha_turno, t.hora_turno, t.meet_url, t.id_profesional
             FROM turnos t
             JOIN profesionales p ON t.id_profesional = p.id_profesional
             WHERE t.id_usuario = ?
               AND t.estado = 'Pendiente'
               AND DATE(t.fecha_turno) >= CURDATE()
             ORDER BY t.fecha_turno ASC, t.hora_turno ASC
             LIMIT 1`,
            [id_usuario]
        );
        return turnos.length > 0 ? turnos[0] : null;
    }

    // 🔹 Obtener cantidad de nuevos pacientes en los últimos 7 días

    static async obtenerNuevosPacientes(id_profesional) {
        // 📅 Hoy en Buenos Aires
        const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' });
        const [year, month] = today.split("-");

        const firstDayOfMonth = `${year}-${month}-01`;

        // 🗓️ Calcular último día del mes actual
        const lastDayDate = new Date(Number(year), Number(month), 0); // Día 0 del mes siguiente = último día del mes actual
        const lastDayOfMonth = lastDayDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD


        const [result] = await pool.execute(
            `SELECT COUNT(DISTINCT t.id_usuario) AS nuevos_pacientes
             FROM turnos t
             WHERE t.id_profesional = ?
               AND DATE(t.fecha_turno) BETWEEN ? AND ?`,
            [id_profesional, firstDayOfMonth, lastDayOfMonth] // ⬅️ Ahora sí: todo abril entero
        );

        return result[0].nuevos_pacientes;
    }

    // 🔹 Obtener progreso de turnos completados en la última semana
    static async obtenerProgreso(id_profesional) {
        const [totalTurnos] = await pool.execute(
            `SELECT COUNT(*) AS total 
            FROM turnos 
            WHERE id_profesional = ? 
                AND fecha_turno >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
            [id_profesional]
        );

        const [turnosCompletados] = await pool.execute(
            `SELECT COUNT(*) AS completados 
            FROM turnos 
            WHERE id_profesional = ? 
                AND fecha_turno >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                AND estado = 'Completado'`,
            [id_profesional]
        );

        const total = totalTurnos[0].total;
        const completados = turnosCompletados[0].completados;
        return total > 0 ? Math.round((completados / total) * 100) : 0;
    }

    static async guardarGoogleEvent(id_turno, google_event_id_paciente = null, google_event_id_profesional = null, meet_url = null) {
        try {
            let query = `UPDATE turnos SET `;
            const params = [];

            if (google_event_id_paciente) {
                query += `google_event_id_paciente = ?, `;
                params.push(google_event_id_paciente);
            }

            if (google_event_id_profesional) {
                query += `google_event_id_profesional = ?, `;
                params.push(google_event_id_profesional);
            }

            if (meet_url) {
                query += `meet_url = ?, `;
                params.push(meet_url);
            }

            query = query.slice(0, -2); // 🔹 Eliminar la última coma
            query += ` WHERE id_turno = ?`;
            params.push(id_turno);

            const [result] = await pool.execute(query, params);
            return result.affectedRows > 0;
        } catch (error) {
            console.error("❌ Error al guardar Google Event ID y Meet URL:", error);
            throw new Error("Error al guardar en la base de datos.");
        }
    }



    static async obtenerHistorialUsuario(id_usuario) {
        const [rows] = await pool.execute(
            `SELECT t.fecha_turno, t.hora_turno, t.estado, p.monto
             FROM turnos t
             LEFT JOIN pagos p ON t.id_turno = p.id_turno
             WHERE t.id_usuario = ?
             ORDER BY t.fecha_turno DESC`,
            [id_usuario]
        );
        return rows;
    }

    static async obtenerTerapeutaUsuario(id_usuario) {
        const [rows] = await pool.execute(
            `SELECT p.nombre, p.correo_electronico, t.fecha_turno AS ultimaConsulta, p.valor, p.valor_internacional, p.id_profesional
             FROM turnos t
             JOIN profesionales p ON t.id_profesional = p.id_profesional
             WHERE t.id_usuario = ?
             ORDER BY t.fecha_turno DESC
             LIMIT 1`,
            [id_usuario]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    static async guardarTokenTemporal(token, datos) {
        const {
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno,
            precio_original,
            precio_final,
            cupon,
            registrar_cupon
        } = datos;

        await pool.execute(`
      INSERT INTO tokens_temporales (
        booking_token, id_profesional, id_usuario, fecha_turno, hora_turno,
        precio_original, precio_final, cupon, registrar_cupon
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            token,
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno,
            precio_original,
            precio_final,
            cupon,
            registrar_cupon ? 1 : 0
        ]);
    }

    static async obtenerTokenTemporal(token) {
        const [rows] = await pool.execute(
            "SELECT * FROM tokens_temporales WHERE booking_token = ? LIMIT 1",
            [token]
        );
        return rows[0] || null;
    }

    static async obtenerProfesionalConPrecios(id_profesional) {
        const [rows] = await pool.execute(
            `SELECT id_profesional, nombre, correo_electronico, 
                    valor as precio_ars, 
                    valor_internacional as precio_usd
             FROM profesionales 
             WHERE id_profesional = ? AND estado = 1`,
            [id_profesional]
        );

        if (rows.length === 0) {
            throw new Error("Profesional no encontrado o inactivo");
        }

        return rows[0];
    }

    // 🔒 NUEVO MÉTODO: Verificar que el usuario existe y está activo
    static async verificarUsuario(id_usuario) {
        const [rows] = await pool.execute(
            `SELECT id_usuario, nombre, correo_electronico 
             FROM usuarios 
             WHERE id_usuario = ?`,
            [id_usuario]
        );

        if (rows.length === 0) {
            throw new Error("Usuario no encontrado o inactivo");
        }

        return rows[0];
    }

    // 🔒 ACTUALIZAR: Método de verificación completa de datos
    static async validarDatosTurno(id_profesional, id_usuario, fecha_turno, hora_turno) {
        // ✅ Verificar que el profesional existe y obtener precios
        const profesional = await this.obtenerProfesionalConPrecios(id_profesional);

        // ✅ Verificar que el usuario existe
        const usuario = await this.verificarUsuario(id_usuario);

        // ✅ Verificar disponibilidad del horario
        const horarioDisponible = await this.verificarDisponibilidad(id_profesional, fecha_turno, hora_turno);
        if (!horarioDisponible) {
            throw new Error("El horario ya no está disponible");
        }

        // ✅ Validar que la fecha no sea pasada (solo comparar fechas, no horas)
        const hoyArgentina = new Date().toLocaleDateString('sv-SE', {
            timeZone: 'America/Argentina/Buenos_Aires'
        }); // Formato: YYYY-MM-DD

        // 🔹 Comparar fechas como strings (más seguro)
        if (fecha_turno < hoyArgentina) {
            throw new Error("No se pueden reservar turnos en fechas pasadas");
        }

        return { profesional, usuario };
    }

    // 🔒 NUEVO MÉTODO: Limpiar tokens expirados (llamar periódicamente)
    static async limpiarTokensExpirados() {
        await pool.execute(
            `DELETE FROM tokens_temporales 
             WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE)`
        );
    }

    // 🔒 ACTUALIZAR: Método para eliminar token temporal
    static async eliminarTokenTemporal(booking_token) {
        await pool.execute(
            `DELETE FROM tokens_temporales WHERE booking_token = ?`,
            [booking_token]
        );
    }

}

module.exports = Turno;