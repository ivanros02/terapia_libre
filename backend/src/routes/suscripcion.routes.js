const express = require("express");
const router = express.Router();
const suscripcionController = require("../controllers/suscripcion.controller");

// 📌 Ruta para obtener la suscripción de un usuario por email
router.get("/:email", suscripcionController.obtenerSuscripcion);
module.exports = router;
