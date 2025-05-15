const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth.middleware"); // 🔹 Asegúrate de importar el middleware de autenticación

router.post("/registro", authController.registrarUsuario);
router.post("/login", authController.login);
router.post("/google-login", authController.loginConGoogle); // 🚀 Nueva ruta para Google
// Ruta para obtener datos del usuario
router.get("/usuario/:id", authenticate, authController.getUserData);
router.put("/usuario/:id", authenticate, authController.editarUsuario);
router.post("/forgot-password", authController.requestPasswordReset);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
