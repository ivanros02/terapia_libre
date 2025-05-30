const Disponibilidad = require("../models/disponibilidad.model");

exports.crearDisponibilidad = async (req, res) => {
    try {
        const { id_profesional, dia_semana, hora_inicio, hora_fin } = req.body;
        if (!id_profesional || !dia_semana || !hora_inicio || !hora_fin) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const id = await Disponibilidad.crearDisponibilidad(id_profesional, dia_semana, hora_inicio, hora_fin);
        res.status(201).json({ message: "Disponibilidad creada", id });
    } catch (error) {
        console.error("Error al crear disponibilidad:", error);

        // 🔎 Si querés detectar errores de clave única o formato:
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "La disponibilidad ya fue registrada para ese día y horario." });
        }

        // 🧱 Fallback seguro
        res.status(400).json({ message: "No se pudo crear la disponibilidad. Intentá nuevamente." });
    }
};

exports.obtenerDisponibilidades = async (req, res) => {
    try {
        const { id_profesional } = req.query;
        if (!id_profesional) {
            return res.status(400).json({ message: "id_profesional es requerido" });
        }

        const horarios = await Disponibilidad.obtenerDisponibilidades(id_profesional);
        res.json(horarios);
    } catch (error) {
        console.error("Error al obtener disponibilidades:", error);
        res.status(400).json({ message: "No se pudieron obtener las disponibilidades. Intentá nuevamente." });
    }
};

exports.obtenerDisponibilidadesHoras = async (req, res) => {
    try {
        const { id_profesional } = req.query;
        if (!id_profesional) {
            return res.status(400).json({ message: "id_profesional es requerido" });
        }

        // ⏬ Ahora devuelve un objeto con { horarios, ausencias }
        const { horarios, ausencias, ausenciasHorarias } = await Disponibilidad.obtenerDisponibilidadesHoras(id_profesional);

        console.log("📦 Devolviendo:", {
            horarios: horarios.length,
            ausencias: ausencias.length,
            ausenciasHorarias: ausenciasHorarias.length
        });


        // Agrupar por fecha los horarios disponibles
        const disponibilidadPorFecha = horarios.reduce((acc, horario) => {
            const { fecha, hora_inicio, hora_fin } = horario;

            if (!fecha || !hora_inicio || !hora_fin) {
                console.warn(`⚠️ Horario con datos faltantes: ${JSON.stringify(horario)}`);
                return acc;
            }

            if (!acc[fecha]) acc[fecha] = [];
            acc[fecha].push({ hora_inicio, hora_fin });

            return acc;
        }, {});

        res.json({
            ...disponibilidadPorFecha,
            ausencias, // 🔹 fechas con ausencia total (para pintar en violeta)
            ausenciasHorarias
        });

    } catch (error) {
        console.error("❌ Error al obtener disponibilidades:", error);
        res.status(400).json({ message: "No se pudieron obtener las disponibilidades. Intentá nuevamente." });
    }
};


exports.actualizarDisponibilidad = async (req, res) => {
    try {
        const { id_disponibilidad, id_profesional, dia_semana, hora_inicio, hora_fin } = req.body;
        if (!id_disponibilidad || !id_profesional || !dia_semana || !hora_inicio || !hora_fin) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const updated = await Disponibilidad.actualizarDisponibilidad(id_disponibilidad, id_profesional, dia_semana, hora_inicio, hora_fin);
        if (updated) {
            res.json({ message: "Disponibilidad actualizada" });
        } else {
            res.status(404).json({ message: "No se encontró la disponibilidad" });
        }
    } catch (error) {
        console.error("Error al actualizar disponibilidad:", error);
        return res.status(400).json({ message: "No se pudo actualizar la disponibilidad. Intentá nuevamente." });
    }
};

exports.eliminarDisponibilidad = async (req, res) => {
    try {
        const { id_disponibilidad, id_profesional } = req.body;
        if (!id_disponibilidad || !id_profesional) {
            return res.status(400).json({ message: "id_disponibilidad e id_profesional son requeridos" });
        }

        const deleted = await Disponibilidad.eliminarDisponibilidad(id_disponibilidad, id_profesional);
        if (deleted) {
            res.json({ message: "Disponibilidad eliminada" });
        } else {
            res.status(404).json({ message: "No se encontró la disponibilidad" });
        }
    } catch (error) {
        console.error("Error al eliminar disponibilidad:", error);
        return res.status(400).json({ message: "No se pudo eliminar la disponibilidad. Intentá nuevamente." });
    }
};