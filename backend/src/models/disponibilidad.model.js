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

    static calcularFechasDesdeDiaSemana(diaSemana, semanas = 24) { // Ahora calcula para 6 meses
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const hoy = new Date();
        const fechas = [];
    
        // 🔹 Normalizar el nombre del día
        const diaSemanaNormalizado = diaSemana?.trim()?.toLowerCase();
        console.log("🔍 Verificando día de la semana recibido:", diaSemanaNormalizado);
    
        const diasSemanaNormalizados = diasSemana.map(d => d.toLowerCase());
    
        if (!diasSemanaNormalizados.includes(diaSemanaNormalizado)) {
            console.error(`❌ Error: El día recibido "${diaSemana}" no es válido`);
            return [];
        }
    
        for (let i = 0; i < semanas * 7; i++) { // Extiende a 6 meses
            const fecha = new Date();
            fecha.setDate(hoy.getDate() + i);
    
            const nombreDia = diasSemana[fecha.getDay()].toLowerCase();
    
            if (nombreDia === diaSemanaNormalizado) {
                fechas.push(fecha.toISOString().split("T")[0]); // Formato YYYY-MM-DD
            }
        }
    
        console.log("✅ Fechas generadas correctamente:", fechas);
        return fechas;
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
            `SELECT DATE_FORMAT(fecha_turno, '%Y-%m-%d') AS fecha_turno, 
                    TIME_FORMAT(hora_turno, '%H:%i:%s') AS hora_turno
             FROM turnos 
             WHERE id_profesional = ? 
             AND estado IN ('Pendiente', 'Confirmado')`,
            [id_profesional]
        );

        // Convertimos los turnos ocupados en un Set para búsqueda rápida
        const turnosSet = new Set(turnosOcupados.map(t => `${t.fecha_turno}-${t.hora_turno}`));

        console.log("📆 Turnos ocupados registrados:", turnosSet);

        // Objeto para almacenar los horarios disponibles sin repetir
        const horariosDisponibles = {};

        for (const d of rows) {
            if (!d.dia_semana) {
                console.error("❌ Error: d.dia_semana es undefined o null.");
                continue;
            }

            const diaNormalizado = d.dia_semana.trim().toLowerCase();
            console.log("🔹 Día de la semana normalizado:", diaNormalizado);

            const fechasPosibles = Disponibilidad.calcularFechasDesdeDiaSemana(d.dia_semana);

            if (!fechasPosibles.length) {
                console.error(`⚠️ No se encontraron fechas para el día: "${d.dia_semana}"`);
                continue;
            }

            for (const fecha of fechasPosibles) {
                if (!fecha) continue;

                let horaActual = d.hora_inicio;

                while (horaActual < d.hora_fin) {
                    let [horas, minutos] = horaActual.split(":").map(Number);
                    let horaFin = `${String(horas + 1).padStart(2, "0")}:00:00`;

                    const claveTurno = `${fecha}-${horaActual}`;

                    if (!turnosSet.has(claveTurno)) {
                        if (!horariosDisponibles[fecha]) {
                            horariosDisponibles[fecha] = [];
                        }

                        if (!horariosDisponibles[fecha].some(h => h.hora_inicio === horaActual)) {
                            horariosDisponibles[fecha].push({
                                hora_inicio: horaActual,
                                hora_fin: horaFin
                            });
                        }
                    }

                    horaActual = horaFin;
                }
            }
        }


        console.log("✅ Disponibilidad filtrada correctamente:", horariosDisponibles);

        // 🔹 Convertimos `horariosDisponibles` en array antes de retornarlo
        return Object.keys(horariosDisponibles).flatMap(fecha =>
            horariosDisponibles[fecha].map(horario => ({
                fecha,
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin
            }))
        );
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