const pool = require("../config/db");

class GoogleMeet {
    static async guardarMeetUrl(id_turno, meet_url) {
        const [result] = await pool.execute(
            `UPDATE turnos SET meet_url = ? WHERE id_turno = ?`,
            [meet_url, id_turno]
        );
        return result.affectedRows > 0;
    }

    static async obtenerMeetUrl(id_turno) {
        const [rows] = await pool.execute(
            `SELECT meet_url FROM turnos WHERE id_turno = ?`,
            [id_turno]
        );
        return rows.length ? rows[0].meet_url : null;
    }

    // 🔹 Registrar el fin de la llamada
    static async registrarFinDeLlamada(id_turno) {
        const [result] = await pool.execute(
            `UPDATE turnos SET estado = 'Completado' WHERE id_turno = ?`,
            [id_turno]
        );
        return result.affectedRows > 0;
    }
    
}



module.exports = GoogleMeet;
