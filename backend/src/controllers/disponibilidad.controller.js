const Disponibilidad = require("../models/disponibilidad.model");

exports.crearDisponibilidad = async (req, res) => {
  try {
    const { id_profesional, fecha, hora_inicio, hora_fin } = req.body;
    if (!id_profesional || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const id = await Disponibilidad.crearDisponibilidad(id_profesional, fecha, hora_inicio, hora_fin);
    res.status(201).json({ message: "Disponibilidad creada", id });
  } catch (error) {
    console.error("Error al crear disponibilidad:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

exports.obtenerDisponibilidad = async (req, res) => {
  try {
    const { id_profesional, fecha } = req.query;
    if (!id_profesional || !fecha) {
      return res.status(400).json({ message: "id_profesional y fecha son requeridos" });
    }

    const horarios = await Disponibilidad.obtenerDisponibilidad(id_profesional, fecha);
    res.json(horarios);
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);
    res.status(500).json({ message: "Error interno" });
  }
};
