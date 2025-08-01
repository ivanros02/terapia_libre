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
            WHERE id_profesional = ? AND activo = TRUE
            ORDER BY FIELD(dia_semana, 'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo')`,
            [id_profesional]
        );
        return rows;
    }

    static calcularFechasDesdeDiaSemana(diaSemana, semanas = 24) {
        console.log("🔍 Iniciando calcularFechasDesdeDiaSemana con:", diaSemana);

        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

        // 🔹 Crear fecha en zona horaria de Argentina
        const hoy = new Date();
        console.log("📅 Fecha original del servidor:", hoy.toString());
        console.log("📅 Fecha UTC:", hoy.toISOString());

        hoy.setHours(hoy.getHours() - 3); // Ajustar a GMT-3 (Argentina)
        console.log("📅 Fecha ajustada a Argentina:", hoy.toString());

        const fechas = [];
        const diaSemanaNormalizado = diaSemana?.trim()?.toLowerCase();

        if (!diasSemana.includes(diaSemanaNormalizado)) {
            console.error(`❌ Error: El día recibido "${diaSemana}" no es válido`);
            return [];
        }

        const diaObjetivo = diasSemana.indexOf(diaSemanaNormalizado);
        console.log(`🎯 Buscando día: ${diaSemanaNormalizado} (índice ${diaObjetivo})`);

        for (let i = 0; i < semanas * 7; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(hoy.getDate() + i);

            if (fecha.getDay() === diaObjetivo) {
                // 🔹 Formatear sin usar toISOString para evitar conversión UTC
                const year = fecha.getFullYear();
                const month = String(fecha.getMonth() + 1).padStart(2, '0');
                const day = String(fecha.getDate()).padStart(2, '0');
                const fechaFormateada = `${year}-${month}-${day}`;

                fechas.push(fechaFormateada);

                // Solo logear las primeras 3 fechas para no saturar
                if (fechas.length <= 3) {
                    console.log(`✅ Fecha encontrada: ${fechaFormateada} (día de semana: ${fecha.getDay()})`);
                }
            }
        }

        console.log(`📊 Total de fechas generadas: ${fechas.length}`);
        console.log("🔢 Primeras 5 fechas:", fechas.slice(0, 5));

        return fechas;
    }




    static async obtenerDisponibilidadesHoras(id_profesional) {
        // Obtener todas las disponibilidades del profesional
        const [rows] = await pool.execute(
            `SELECT d.dia_semana, d.hora_inicio, d.hora_fin 
             FROM disponibilidad d
             WHERE d.id_profesional = ? AND d.activo = TRUE
             ORDER BY FIELD(d.dia_semana, 'Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'), d.hora_inicio`,
            [id_profesional]
        );

        // Obtener ausencias del profesional
        const [ausencias] = await pool.execute(
            `SELECT fecha, hora_inicio, hora_fin 
             FROM ausencias 
             WHERE id_profesional = ?`,
            [id_profesional]
        );

        console.log("🟣 Ausencias obtenidas:", ausencias);


        // Convertir ausencias en rangos bloqueados
        const ausenciasBloqueadas = new Set();
        for (const a of ausencias) {
            let hora = a.hora_inicio;
            while (hora < a.hora_fin) {
                ausenciasBloqueadas.add(`${a.fecha}-${hora}`);
                const [h, m] = hora.split(":").map(Number);
                hora = `${String(h + 1).padStart(2, "0")}:00:00`; // Asumimos intervalo de 1 hora
            }
        }





        // Obtener los turnos ocupados para este profesional
        const [turnosOcupados] = await pool.execute(
            `SELECT DATE_FORMAT(fecha_turno, '%Y-%m-%d') AS fecha_turno, 
                    TIME_FORMAT(hora_turno, '%H:%i:%s') AS hora_turno
             FROM turnos 
             WHERE id_profesional = ?`,
            [id_profesional]
        );

        // Convertimos los turnos ocupados en un Set para búsqueda rápida
        const turnosSet = new Set(turnosOcupados.map(t => `${t.fecha_turno}-${t.hora_turno}`));


        // Objeto para almacenar los horarios disponibles sin repetir
        const horariosDisponibles = {};

        for (const d of rows) {
            if (!d.dia_semana) {
                console.error("❌ Error: d.dia_semana es undefined o null.");
                continue;
            }

            const diaNormalizado = d.dia_semana.trim().toLowerCase();

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

                    const fechaHoraTurno = new Date(`${fecha}T${horaActual}`);
                    const ahora = new Date();
                    ahora.setHours(ahora.getHours() - 3); // Ajustar a Argentina

                    if (fechaHoraTurno <= ahora) {
                        horaActual = horaFin;
                        continue; // ⛔️ saltar horarios pasados
                    }

                    if (!turnosSet.has(claveTurno)) {
                        if (turnosSet.has(claveTurno) || ausenciasBloqueadas.has(claveTurno)) {
                            horaActual = horaFin;
                            continue; // ⛔️ Ocupado o ausente
                        }

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

        const diasAusentes = ausencias.map(a => a.fecha.toISOString().split("T")[0]);
        const fechasUnicas = [...new Set(diasAusentes)];
        const ausenciasHorarias = ausencias.map(a => ({
            fecha: a.fecha.toISOString().split("T")[0],
            hora_inicio: a.hora_inicio,
            hora_fin: a.hora_fin
        }));

        console.log("✅ ausenciasHorarias:", ausenciasHorarias, id_profesional);

        // 🔹 Convertimos `horariosDisponibles` en array antes de retornarlo
        return {
            horarios: Object.keys(horariosDisponibles).flatMap(fecha =>
                horariosDisponibles[fecha].map(horario => ({
                    fecha,
                    hora_inicio: horario.hora_inicio,
                    hora_fin: horario.hora_fin
                }))
            ),
            ausencias: fechasUnicas, // días completamente ausentes
            ausenciasHorarias         // ausencias parciales (por rango horario)
        };
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
            `UPDATE disponibilidad SET activo = FALSE, eliminado_en = NOW() WHERE id_disponibilidad = ? AND id_profesional = ?`,
            [id_disponibilidad, id_profesional]
        );
        return result.affectedRows;
    }
}

module.exports = Disponibilidad;