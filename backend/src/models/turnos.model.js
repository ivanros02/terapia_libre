const pool = require("../config/db");

class Turno {
    static async crearTurno({ id_profesional, id_paciente, id_disponibilidad, motivo_consulta }) {
        const [result] = await pool.execute(
            `INSERT INTO turnos (id_profesional, id_paciente, id_disponibilidad, motivo_consulta) 
         VALUES (?, ?, ?, ?)`,
            [id_profesional, id_paciente, id_disponibilidad, motivo_consulta]
        );
        return result.insertId;
    }

    static async obtenerTurnosDisponibles(id_profesional, fecha) {
        const [rows] = await pool.execute(
            `SELECT t.id_turno, t.motivo_consulta, t.estado 
         FROM turnos t 
         JOIN disponibilidad_profesional dp ON t.id_disponibilidad = dp.id_disponibilidad
         WHERE t.id_profesional = ? AND dp.fecha = ? AND t.estado = 'confirmado'`,
            [id_profesional, fecha]
        );
        return rows;
    }

    // Función para actualizar el estado del turno
    static async actualizarEstadoTurno(id_turno, estado) {
        const [result] = await pool.execute(
            `UPDATE turnos SET estado = ? WHERE id_turno = ?`,
            [estado, id_turno]
        );
        return result.affectedRows > 0; // Si la actualización fue exitosa
    }
}

module.exports = Turno;

