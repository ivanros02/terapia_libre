const express = require("express");
const router = express.Router();
const profesionalController = require("../controllers/profesional.controller");
const { authenticate } = require("../middlewares/auth.middleware"); // 🔹 Asegúrate de importar el middleware de autenticación

// Crear un nuevo profesional
router.post("/", profesionalController.createProfesional);
router.get("/", profesionalController.getProfesionales);
router.get("/:id", authenticate, profesionalController.getProfesionalData); // 🔹 Nueva ruta para obtener datos de un profesional

module.exports = router;