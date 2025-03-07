const express = require("express");
const router = express.Router();
const disponibilidadController = require("../controllers/disponibilidad.controller");

router.post("/", disponibilidadController.crearDisponibilidad);
router.get("/", disponibilidadController.obtenerDisponibilidad);

module.exports = router;
