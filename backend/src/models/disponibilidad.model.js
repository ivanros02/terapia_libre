const pool = require("../config/db");

class Disponibilidad {
    static async crearDisponibilidad(id_profesional, fecha, hora_inicio, hora_fin) {
        const [result] = await pool.execute(
            `INSERT INTO disponibilidad_profesional (id_profesional, fecha, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)`,
            [id_profesional, fecha, hora_inicio, hora_fin]
        );
        return result.insertId;
    }

    static async obtenerDisponibilidad(id_profesional, fecha) {
        const [rows] = await pool.execute(
            `SELECT id_disponibilidad, id_profesional, 
       DATE_FORMAT(fecha, '%Y-%m-%d') AS fecha, 
       hora_inicio, hora_fin, estado 
       FROM disponibilidad_profesional 
       WHERE id_profesional = ? AND fecha = ? AND estado = 'disponible'`,
            [id_profesional, fecha]
        );
        return rows;
    }


    static async marcarComoOcupado(id_disponibilidad) {
        await pool.execute(
            `UPDATE disponibilidad_profesional SET estado = 'ocupado' WHERE id_disponibilidad = ?`,
            [id_disponibilidad]
        );
    }
}

module.exports = Disponibilidad;
