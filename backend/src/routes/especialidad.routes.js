const express = require("express");
const router = express.Router();
const especialidadController = require("../controllers/especialidad.controller");

// Rutas CRUD para Especialidad
router.post("/", especialidadController.createEspecialidad);
router.get("/", especialidadController.getAllEspecialidades);
router.get("/:id", especialidadController.getEspecialidadById);
router.put("/:id", especialidadController.updateEspecialidad);
router.delete("/:id", especialidadController.deleteEspecialidad);

module.exports = router;
