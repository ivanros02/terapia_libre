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
        res.status(500).json({ message: "Error interno" });
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
        res.status(500).json({ message: "Error interno" });
    }
};

exports.obtenerDisponibilidadesHoras = async (req, res) => {
    try {
        const { id_profesional } = req.query;
        if (!id_profesional) {
            return res.status(400).json({ message: "id_profesional es requerido" });
        }

        const horarios = await Disponibilidad.obtenerDisponibilidadesHoras(id_profesional);

        // Agrupar por día de la semana correctamente
        const disponibilidadPorDia = horarios.reduce((acc, horario) => {
            const dia = horario.dia_semana;
            if (!acc[dia]) {
                acc[dia] = [];
            }
            acc[dia].push({
                hora_inicio: horario.hora_inicio,
                hora_fin: horario.hora_fin,
            });
            return acc;
        }, {});

        res.json(disponibilidadPorDia);
    } catch (error) {
        console.error("Error al obtener disponibilidades:", error);
        res.status(500).json({ message: "Error interno" });
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
        res.status(500).json({ message: "Error interno" });
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
        res.status(500).json({ message: "Error interno" });
    }
};