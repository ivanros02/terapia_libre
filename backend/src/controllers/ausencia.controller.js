const AusenciaModel = require("../models/ausencia.model");

// Crear una nueva ausencia
exports.createAusencia = async (req, res) => {
    try {
        const { id_profesional, fecha, hora_inicio, hora_fin, motivo } = req.body;

        // Validaciones básicas
        if (!id_profesional || !fecha || !hora_inicio || !hora_fin) {
            return res.status(400).json({
                success: false,
                message: "Los campos id_profesional, fecha, hora_inicio y hora_fin son obligatorios"
            });
        }

        // Validar que hora_fin sea posterior a hora_inicio
        if (hora_inicio >= hora_fin) {
            return res.status(400).json({
                success: false,
                message: "La hora de fin debe ser posterior a la hora de inicio"
            });
        }

        // Verificar conflictos de horario
        const hasConflict = await AusenciaModel.checkConflict(
            id_profesional,
            fecha,
            hora_inicio,
            hora_fin
        );

        if (hasConflict) {
            return res.status(409).json({
                success: false,
                message: "Ya existe una ausencia registrada en ese horario"
            });
        }

        // Crear la ausencia
        const nuevaAusencia = await AusenciaModel.create({
            id_profesional,
            fecha,
            hora_inicio,
            hora_fin,
            motivo
        });

        res.status(201).json({
            success: true,
            message: "Ausencia creada exitosamente",
            data: nuevaAusencia
        });
    } catch (error) {
        console.error("Error al crear ausencia:", error);
        res.status(500).json({
            success: false,
            message: "Error al crear la ausencia",
            error: error.message
        });
    }
};

// Obtener todas las ausencias de un profesional
exports.getAusenciasByProfesional = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "El ID del profesional es requerido"
            });
        }

        const ausencias = await AusenciaModel.getByProfesionalId(id);

        res.status(200).json({
            success: true,
            data: ausencias
        });
    } catch (error) {
        console.error("Error al obtener ausencias:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las ausencias",
            error: error.message
        });
    }
};

// Obtener una ausencia específica
exports.getAusenciaById = async (req, res) => {
    try {
        const { id } = req.params;

        const ausencia = await AusenciaModel.getById(id);

        if (!ausencia) {
            return res.status(404).json({
                success: false,
                message: "Ausencia no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            data: ausencia
        });
    } catch (error) {
        console.error("Error al obtener ausencia:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener la ausencia",
            error: error.message
        });
    }
};

// Actualizar una ausencia
exports.updateAusencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, hora_inicio, hora_fin, motivo } = req.body;

        // Validaciones básicas
        if (!fecha || !hora_inicio || !hora_fin) {
            return res.status(400).json({
                success: false,
                message: "Los campos fecha, hora_inicio y hora_fin son obligatorios"
            });
        }

        // Validar que hora_fin sea posterior a hora_inicio
        if (hora_inicio >= hora_fin) {
            return res.status(400).json({
                success: false,
                message: "La hora de fin debe ser posterior a la hora de inicio"
            });
        }

        // Obtener la ausencia actual para verificar el id_profesional
        const ausenciaActual = await AusenciaModel.getById(id);
        
        if (!ausenciaActual) {
            return res.status(404).json({
                success: false,
                message: "Ausencia no encontrada"
            });
        }

        // Verificar conflictos de horario
        const hasConflict = await AusenciaModel.checkConflict(
            ausenciaActual.id_profesional,
            fecha,
            hora_inicio,
            hora_fin,
            id
        );

        if (hasConflict) {
            return res.status(409).json({
                success: false,
                message: "Ya existe una ausencia registrada en ese horario"
            });
        }

        // Actualizar la ausencia
        const ausenciaActualizada = await AusenciaModel.update(id, {
            fecha,
            hora_inicio,
            hora_fin,
            motivo
        });

        if (!ausenciaActualizada) {
            return res.status(404).json({
                success: false,
                message: "Ausencia no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ausencia actualizada exitosamente",
            data: ausenciaActualizada
        });
    } catch (error) {
        console.error("Error al actualizar ausencia:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar la ausencia",
            error: error.message
        });
    }
};

// Eliminar una ausencia
exports.deleteAusencia = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await AusenciaModel.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Ausencia no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ausencia eliminada exitosamente"
        });
    } catch (error) {
        console.error("Error al eliminar ausencia:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar la ausencia",
            error: error.message
        });
    }
};

// Obtener ausencias por rango de fechas
exports.getAusenciasByDateRange = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                message: "Las fechas de inicio y fin son requeridas"
            });
        }

        const ausencias = await AusenciaModel.getByDateRange(
            id,
            fecha_inicio,
            fecha_fin
        );

        res.status(200).json({
            success: true,
            data: ausencias
        });
    } catch (error) {
        console.error("Error al obtener ausencias por rango:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las ausencias",
            error: error.message
        });
    }
};