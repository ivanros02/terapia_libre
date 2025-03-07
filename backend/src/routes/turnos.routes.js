const express = require("express");
const router = express.Router();
const turnoController = require("../controllers/turnos.controller");

router.post("/", turnoController.reservarTurno);
router.get("/", turnoController.obtenerTurnosDisponibles);
router.put("/estado", turnoController.actualizarEstadoTurno); // Nueva ruta PUT para actualizar el estado

module.exports = router;
