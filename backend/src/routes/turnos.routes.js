const express = require("express");
const router = express.Router();
const turnosController = require("../controllers/turnos.controller");


router.post("/reservar", turnosController.reservarTurno);
router.post("/paypal/create-order", turnosController.crearOrdenPayPal);
router.post("/paypal/capture-order", turnosController.capturarPagoPayPal);
router.get("/", turnosController.obtenerTurnos);
router.put("/cancelar", turnosController.cancelarTurno);
router.get("/usuario/:id_usuario", turnosController.obtenerTurnosPorUsuario);
router.get("/profesional/:id_profesional", turnosController.obtenerTurnosPorProfesional);


module.exports = router;
