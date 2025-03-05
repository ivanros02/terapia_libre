const express = require("express");
const router = express.Router();
const profesionalController = require("../controllers/profesional.controller");


// Crear un nuevo profesional
router.post("/", profesionalController.createProfesional);
router.get("/", profesionalController.getProfesionales);
module.exports = router;
