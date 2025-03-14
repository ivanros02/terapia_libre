const express = require("express");
const router = express.Router();
const profesionalController = require("../controllers/profesional.controller");
const { authenticate } = require("../middlewares/auth.middleware"); // 🔹 Asegúrate de importar el middleware de autenticación

// Crear un nuevo profesional
router.post("/", profesionalController.createProfesional);
router.get("/", profesionalController.getProfesionales);
router.get("/:id", profesionalController.getProfesionalData);
router.put("/:id", profesionalController.updateProfesional);
router.get("/:id/turno-hoy", authenticate, profesionalController.getTurnoDelDia);
router.get("/:id/proximos-turnos", authenticate, profesionalController.getProximosTurnos);

module.exports = router;