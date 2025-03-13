const express = require("express");
const router = express.Router();
const turnosController = require("../controllers/turnos.controller");

router.post("/reservar", turnosController.reservarTurno);
router.get("/", turnosController.obtenerTurnos);
router.put("/cancelar", turnosController.cancelarTurno);

module.exports = router;
