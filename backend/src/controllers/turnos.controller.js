const Turno = require("../models/turnos.model");

exports.reservarTurno = async (req, res) => {
    try {
        const { id_profesional, id_usuario, fecha_turno, hora_turno } = req.body;
        if (!id_profesional || !id_usuario || !fecha_turno || !hora_turno) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar disponibilidad
        const disponible = await Turno.verificarDisponibilidad(id_profesional, fecha_turno, hora_turno);
        if (!disponible) {
            return res.status(400).json({ message: "El horario ya está ocupado" });
        }

        // Crear el turno
        const turnoId = await Turno.crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno);
        res.status(201).json({ message: "Turno reservado con éxito", id_turno: turnoId });
    } catch (error) {
        console.error("Error al reservar turno:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

exports.obtenerTurnos = async (req, res) => {
    try {
        const { id_profesional } = req.query;
        if (!id_profesional) {
            return res.status(400).json({ message: "id_profesional es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorProfesional(id_profesional);
        res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

exports.cancelarTurno = async (req, res) => {
    try {
        const { id_turno, motivo } = req.body;
        if (!id_turno || !motivo) {
            return res.status(400).json({ message: "id_turno y motivo son obligatorios" });
        }

        const cancelado = await Turno.cancelarTurno(id_turno, motivo);
        if (cancelado) {
            res.json({ message: "Turno cancelado correctamente" });
        } else {
            res.status(404).json({ message: "No se encontró el turno" });
        }
    } catch (error) {
        console.error("Error al cancelar turno:", error);
        res.status(500).json({ message: "Error interno" });
    }
};
