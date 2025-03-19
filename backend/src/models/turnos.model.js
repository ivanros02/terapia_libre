const pool = require("../config/db");

class Turno {
    static async crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno) {
        const [result] = await pool.execute(
            `INSERT INTO turnos (id_profesional, id_usuario, fecha_turno, hora_turno, estado) VALUES (?, ?, ?, ?, 'Pendiente')`,
            [id_profesional, id_usuario, fecha_turno, hora_turno]
        );
        return result.insertId;
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
            `SELECT * FROM turnos WHERE id_profesional = ? ORDER BY fecha_turno, hora_turno`,
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
            AND CONCAT(t.fecha_turno, ' ', t.hora_turno) >= NOW()  -- 🔹 Solo turnos futuros
            ORDER BY t.fecha_turno ASC, t.hora_turno ASC
            LIMIT 5`,  
            [id_profesional]
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
                `SELECT * FROM turnos WHERE id_usuario = ? ORDER BY fecha_turno, hora_turno`,
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
                AND CONCAT(t.fecha_turno, ' ', t.hora_turno) >= NOW()
                AND t.estado IN ('Pendiente', 'Confirmado')
            ORDER BY t.fecha_turno ASC, t.hora_turno ASC
            LIMIT 1`,
            [id_profesional]
        );
        return turnos.length > 0 ? turnos[0] : null;
    }

    // 🔹 Obtener cantidad de nuevos pacientes en los últimos 7 días
    static async obtenerNuevosPacientes(id_profesional) {
        const [result] = await pool.execute(
            `SELECT COUNT(DISTINCT t.id_usuario) AS nuevos_pacientes
            FROM turnos t
            WHERE t.id_profesional = ? 
                AND t.fecha_turno >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`,
            [id_profesional]
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

}

module.exports = Turno;
