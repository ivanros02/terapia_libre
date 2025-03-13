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

    static async cancelarTurno(id_turno, motivo) {
        const [result] = await pool.execute(
            `UPDATE turnos SET estado = 'Cancelado', motivo_cancelacion = ? WHERE id_turno = ?`,
            [motivo, id_turno]
        );
        return result.affectedRows;
    }
}

module.exports = Turno;
