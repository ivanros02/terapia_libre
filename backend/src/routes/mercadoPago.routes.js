const express = require("express");
const router = express.Router();
const mercadoPagoController = require("../controllers/mercadoPago.controller");

// Rutas de Mercado Pago
router.post("/create-order", mercadoPagoController.crearOrdenMercadoPago);
router.post("/capture-order", mercadoPagoController.capturarPagoMercadoPago);
router.post("/webhook", mercadoPagoController.webhookMercadoPago);

module.exports = router;
