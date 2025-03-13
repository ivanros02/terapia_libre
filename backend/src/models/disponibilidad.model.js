const pool = require("../config/db");

class Disponibilidad {
    static async crearDisponibilidad(id_profesional, dia_semana, hora_inicio, hora_fin) {
        const [result] = await pool.execute(
            `INSERT INTO disponibilidad (id_profesional, dia_semana, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)`,
            [id_profesional, dia_semana, hora_inicio, hora_fin]
        );
        return result.insertId;
    }

    static async obtenerDisponibilidades(id_profesional) {
        const [rows] = await pool.execute(
            `SELECT id_disponibilidad, id_profesional, dia_semana, hora_inicio, hora_fin, 
            DATE_FORMAT(creado_en, '%Y-%m-%d %H:%i:%s') AS creado_en 
            FROM disponibilidad 
            WHERE id_profesional = ? 
            ORDER BY FIELD(dia_semana, 'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo')`,
            [id_profesional]
        );
        return rows;
    }

    static calcularFechaDesdeDiaSemana(diaSemana) {
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const hoy = new Date();
        const diaActual = hoy.getDay();
        const diferencia = diasSemana.indexOf(diaSemana) - diaActual;
        const fecha = new Date();
        fecha.setDate(hoy.getDate() + (diferencia >= 0 ? diferencia : 7 + diferencia)); // Próxima ocurrencia del día
        return fecha.toISOString().split("T")[0]; // Retorna en formato YYYY-MM-DD
    }

    static async obtenerDisponibilidadesHoras(id_profesional) {
        // Obtener todas las disponibilidades del profesional
        const [rows] = await pool.execute(
            `SELECT d.dia_semana, d.hora_inicio, d.hora_fin 
            FROM disponibilidad d
            WHERE d.id_profesional = ? 
            ORDER BY FIELD(d.dia_semana, 'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'), d.hora_inicio`,
            [id_profesional]
        );

        // Obtener los turnos ocupados para este profesional
        const [turnosOcupados] = await pool.execute(
            `SELECT DATE_FORMAT(fecha_turno, '%Y-%m-%d') AS fecha_turno, hora_turno 
            FROM turnos 
            WHERE id_profesional = ? 
            AND estado IN ('Pendiente', 'Confirmado')`,
            [id_profesional]
        );

        // Convertir los turnos ocupados en un Set para búsqueda rápida
        const turnosSet = new Set(turnosOcupados.map(t => `${t.fecha_turno}-${t.hora_turno}`));

        // Filtrar la disponibilidad excluyendo solo los horarios ocupados
        const horariosDisponibles = rows.flatMap(d => {
            const fecha = Disponibilidad.calcularFechaDesdeDiaSemana(d.dia_semana);
            let horarios = [];
            let horaActual = d.hora_inicio;

            while (horaActual < d.hora_fin) {
                let [horas, minutos] = horaActual.split(":").map(Number);
                let horaFin = `${String(horas + 1).padStart(2, "0")}:00:00`;

                // Si el turno está ocupado, no lo agregamos a la disponibilidad
                if (!turnosSet.has(`${fecha}-${horaActual}`)) {
                    horarios.push({
                        dia_semana: d.dia_semana,
                        hora_inicio: horaActual,
                        hora_fin: horaFin
                    });
                }

                horaActual = horaFin; // Pasar al siguiente intervalo
            }

            return horarios;
        });

        return horariosDisponibles;
    }





    static async actualizarDisponibilidad(id_disponibilidad, id_profesional, dia_semana, hora_inicio, hora_fin) {
        const [result] = await pool.execute(
            `UPDATE disponibilidad SET dia_semana = ?, hora_inicio = ?, hora_fin = ? WHERE id_disponibilidad = ? AND id_profesional = ?`,
            [dia_semana, hora_inicio, hora_fin, id_disponibilidad, id_profesional]
        );
        return result.affectedRows;
    }

    static async eliminarDisponibilidad(id_disponibilidad, id_profesional) {
        const [result] = await pool.execute(
            `DELETE FROM disponibilidad WHERE id_disponibilidad = ? AND id_profesional = ?`,
            [id_disponibilidad, id_profesional]
        );
        return result.affectedRows;
    }
}

module.exports = Disponibilidad;