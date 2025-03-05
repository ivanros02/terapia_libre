const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/registro", authController.registrarUsuario);
router.post("/login", authController.login);
router.post("/google-login", authController.loginConGoogle); // 🚀 Nueva ruta para Google

module.exports = router;
