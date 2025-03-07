const Turno = require("../models/turnos.model");
const Disponibilidad = require("../models/disponibilidad.model");

exports.reservarTurno = async (req, res) => {
    try {
        const { id_profesional, id_paciente, id_disponibilidad, motivo_consulta } = req.body;

        if (!id_profesional || !id_paciente || !id_disponibilidad || !motivo_consulta) {
            return res.status(400).json({ message: "Datos incompletos" });
        }

        // Crear el turno
        const id_turno = await Turno.crearTurno({ id_profesional, id_paciente, id_disponibilidad, motivo_consulta });

        // Marcar la disponibilidad como ocupada
        await Disponibilidad.marcarComoOcupado(id_disponibilidad);

        res.status(201).json({ message: "Turno reservado con éxito", id_turno });
    } catch (error) {
        console.error("Error al reservar turno:", error);
        res.status(500).json({ message: "Error al reservar turno" });
    }
};


exports.obtenerTurnosDisponibles = async (req, res) => {
    try {
        const { id_profesional, fecha } = req.query;

        if (!id_profesional || !fecha) {
            return res.status(400).json({ message: "id_profesional y fecha son requeridos" });
        }

        const turnos = await Turno.obtenerTurnosDisponibles(id_profesional, fecha);
        res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

exports.actualizarEstadoTurno = async (req, res) => {
    try {
        const { id_turno, estado } = req.body;

        if (!id_turno || !estado || !['confirmado', 'cancelado', 'completado'].includes(estado)) {
            return res.status(400).json({ message: "Estado inválido" });
        }

        // Actualizar el estado del turno
        const exito = await Turno.actualizarEstadoTurno(id_turno, estado);

        if (!exito) {
            return res.status(404).json({ message: "Turno no encontrado" });
        }

        res.json({ message: `Estado del turno actualizado a ${estado}` });
    } catch (error) {
        console.error("Error al actualizar el estado del turno:", error);
        res.status(500).json({ message: "Error al actualizar el estado" });
    }
};

