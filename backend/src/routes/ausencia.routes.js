const express = require("express");
const router = express.Router();
const ausenciaController = require("../controllers/ausencia.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// Rutas públicas (si las necesitas)
// router.get("/public", ausenciaController.getPublicAusencias);

// Rutas protegidas - requieren autenticación
router.use(authenticate); // Protege todas las rutas siguientes

// Crear una nueva ausencia
router.post("/", ausenciaController.createAusencia);

// Obtener todas las ausencias de un profesional
router.get("/profesional/:id", ausenciaController.getAusenciasByProfesional);

// Obtener ausencias por rango de fechas
router.get("/profesional/:id/rango", ausenciaController.getAusenciasByDateRange);

// Obtener una ausencia específica
router.get("/:id", ausenciaController.getAusenciaById);

// Actualizar una ausencia
router.put("/:id", ausenciaController.updateAusencia);

// Eliminar una ausencia
router.delete("/:id", ausenciaController.deleteAusencia);

module.exports = router;