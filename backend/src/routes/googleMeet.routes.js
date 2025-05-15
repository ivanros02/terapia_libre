const express = require("express");
const router = express.Router();
const googleMeetController = require("../controllers/googleMeet.controller");

// Crear una videollamada de Meet
router.post("/crear-meet", googleMeetController.crearMeet);
// Guardar la URL del Meet en la base de datos
router.post("/guardar-meet", googleMeetController.guardarMeet);
// Obtener una videollamada existente
router.get("/:id_turno", googleMeetController.obtenerMeet);
// Registrar el fin de la llamada de Meet
router.post("/terminar-llamada", googleMeetController.terminarMeet);
module.exports = router;
