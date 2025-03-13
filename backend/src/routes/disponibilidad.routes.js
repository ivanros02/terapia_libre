const express = require("express");
const router = express.Router();
const disponibilidadController = require("../controllers/disponibilidad.controller");

router.post("/", disponibilidadController.crearDisponibilidad);
router.get("/", disponibilidadController.obtenerDisponibilidades);
router.get("/horas", disponibilidadController.obtenerDisponibilidadesHoras); // Nueva ruta
router.put("/", disponibilidadController.actualizarDisponibilidad);
router.delete("/", disponibilidadController.eliminarDisponibilidad);

module.exports = router;