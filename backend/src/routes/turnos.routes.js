const express = require("express");
const router = express.Router();
const turnosController = require("../controllers/turnos.controller");


router.post("/reservar", turnosController.reservarTurno);
router.post("/paypal/create-order", turnosController.crearOrdenPayPal);
router.post("/paypal/capture-order", turnosController.capturarPagoPayPal);
router.post("/mercadopago/create-order", turnosController.crearOrdenMercadoPago);
router.post("/mercadopago/capture-order", turnosController.capturarPagoMercadoPago);
router.post("/mercadopago/webhook", turnosController.webhookMercadoPago);
router.get("/", turnosController.obtenerTurnos);
router.put("/cancelar", turnosController.cancelarTurno);

module.exports = router;
