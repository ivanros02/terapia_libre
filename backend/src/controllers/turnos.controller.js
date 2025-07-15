const Turno = require("../models/turnos.model");
const fs = require('fs');
const path = require('path');

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
        res.status(400).json({ message: "No se pudo completar la operación. Verificá los datos e intentá nuevamente." });
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
        res.status(400).json({ message: "No se pudo completar la operación. Verificá los datos e intentá nuevamente." });
    }
};

exports.obtenerTurnosPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        if (!id_usuario) {
            return res.status(400).json({ message: "ID de usuario es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorUsuario(id_usuario);

        res.status(200).json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.obtenerTurnosPorProfesional = async (req, res) => {
    try {
        const { id_profesional } = req.params;

        if (!id_profesional) {
            return res.status(400).json({ message: "ID del profesional es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorProfesional(id_profesional);

        if (!turnos.length) {
            return res.status(200).json([]); // Devuelve un array vacío si no hay turnos
        }

        res.status(200).json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos del profesional:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.obtenerTurnosPorProfesionalDashboard = async (req, res) => {
    try {
        const { id_profesional } = req.params;

        if (!id_profesional) {
            return res.status(400).json({ message: "ID del profesional es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorProfesionalDashboard(id_profesional);

        if (!turnos.length) {
            return res.status(200).json([]); // Si no hay turnos, devuelve array vacío
        }

        res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos del profesional:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.obtenerTurnosPorUsuarioDashboard = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        if (!id_usuario) {
            return res.status(400).json({ message: "ID del profesional es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorUsuarioDashboard(id_usuario);

        if (!turnos.length) {
            return res.status(200).json([]); // Si no hay turnos, devuelve array vacío
        }

        res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos del profesional:", error);
        res.status(500).json({ message: "Error interno del servidor" });
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

exports.getTurnoDelDia = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID del profesional es requerido" });

        const turno = await Turno.obtenerProximoTurno(id);
        res.json(turno);
    } catch (error) {
        console.error("Error al obtener el próximo turno:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getTurnoDelDiaPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID del paciente es requerido" });

        const turno = await Turno.obtenerProximoTurnoPaciente(id);
        res.json(turno);
    } catch (error) {
        console.error("Error al obtener el próximo turno:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getNuevosPacientes = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID del profesional es requerido" });

        const nuevosPacientes = await Turno.obtenerNuevosPacientes(id);
        res.json(nuevosPacientes);
    } catch (error) {
        console.error("Error al obtener nuevos pacientes:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID del profesional es requerido" });

        const progress = await Turno.obtenerProgreso(id);
        res.json({ progress });
    } catch (error) {
        console.error("Error al obtener progreso:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.guardarGoogleEvent = async (req, res) => {
    try {
        console.log("📩 Request recibido en guardarGoogleEvent:", req.body);

        const { id_turno, google_event_id_paciente, google_event_id_profesional, meet_url } = req.body;

        if (!id_turno) {
            return res.status(400).json({ message: "id_turno es obligatorio" });
        }

        if (!google_event_id_paciente && !google_event_id_profesional && !meet_url) {
            return res.status(400).json({ message: "Se requiere al menos un Google Event ID o meet_url" });
        }

        const actualizado = await Turno.guardarGoogleEvent(id_turno, google_event_id_paciente, google_event_id_profesional, meet_url);

        if (actualizado) {
            return res.status(200).json({ message: "Datos de Google Calendar guardados correctamente" });
        } else {
            return res.status(404).json({ message: "No se encontró el turno o ya estaba actualizado" });
        }
    } catch (error) {
        console.error("❌ Error al guardar Google Event ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};




exports.obtenerHistorialUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        if (!id_usuario) {
            return res.status(400).json({ message: "ID de usuario es requerido" });
        }

        const historial = await Turno.obtenerHistorialUsuario(id_usuario);
        res.status(200).json(historial);
    } catch (error) {
        console.error("Error al obtener historial de sesiones:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.subirFactura = async (req, res) => {
    try {
        const { id_turno } = req.body;

        if (!id_turno) {
            return res.status(400).json({ error: 'id_turno es requerido' });
        }

        // Obtener la fecha del turno
        const turno = await Turno.obtenerPorId(id_turno);
        if (!turno) {
            return res.status(404).json({ error: 'Turno no encontrado' });
        }

        // Manejar fecha como objeto Date
        const fechaTurno = new Date(turno.fecha_turno);
        const year = fechaTurno.getFullYear().toString();
        const month = String(fechaTurno.getMonth() + 1).padStart(2, '0');

        console.log('Fecha del turno:', turno.fecha_turno, 'Year:', year, 'Month:', month);

        // Crear estructura de carpetas
        const targetDir = path.join('../storage/facturas', year, month);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Mover archivo de temp a carpeta correcta
        const oldPath = req.file.path;
        const newFilename = `turno_${id_turno}_factura.pdf`;
        const newPath = path.join(targetDir, newFilename);

        fs.renameSync(oldPath, newPath);

        const filepath = `/facturas/${year}/${month}/${newFilename}`;

        const actualizado = await Turno.subirFactura(id_turno, newFilename, filepath);

        if (actualizado) {
            res.json({ message: 'Factura subida', filename: newFilename });
        } else {
            res.status(404).json({ error: 'Turno no encontrado' });
        }
    } catch (error) {
        console.error('Error subiendo factura:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.obtenerTerapeutaUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        if (!id_usuario) {
            return res.status(400).json({ message: "ID de usuario es requerido" });
        }

        const terapeuta = await Turno.obtenerTerapeutaUsuario(id_usuario);
        res.status(200).json(terapeuta);
    } catch (error) {
        console.error("Error al obtener información del terapeuta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

