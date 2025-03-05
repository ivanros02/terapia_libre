const Especialidad = require("../models/especialidad.model");

exports.createEspecialidad = async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }
    const id = await Especialidad.create({ nombre });
    res.status(201).json({ message: "Especialidad creada", id });
  } catch (error) {
    console.error("Error al crear especialidad:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.getAllEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.getAll();
    res.status(200).json(especialidades);
  } catch (error) {
    console.error("Error al obtener especialidades:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.getEspecialidadById = async (req, res) => {
  try {
    const { id } = req.params;
    const especialidad = await Especialidad.getById(id);
    if (!especialidad) {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }
    res.status(200).json(especialidad);
  } catch (error) {
    console.error("Error al obtener especialidad:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.updateEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }
    const updated = await Especialidad.update(id, { nombre });
    if (!updated) {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }
    res.status(200).json({ message: "Especialidad actualizada" });
  } catch (error) {
    console.error("Error al actualizar especialidad:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.deleteEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Especialidad.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Especialidad no encontrada" });
    }
    res.status(200).json({ message: "Especialidad eliminada" });
  } catch (error) {
    console.error("Error al eliminar especialidad:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
