// src/routes/chat.routes.js
const express = require("express");
const chatController = require("../controllers/chat.controller");
const { authenticate } = require("../middlewares/auth.middleware"); // Importar correctamente

const router = express.Router();

// Obtener o crear un chat
router.post("/chat", authenticate, chatController.getOrCreateChat); // Usar authenticate

// Enviar un mensaje
router.post("/message", authenticate, chatController.sendMessage); // Usar authenticate

// Obtener mensajes de un chat
router.get("/:id_chat/messages", authenticate, chatController.getMessages); // Usar authenticate

// Nueva ruta para obtener el chatId
router.get("/chatId", authenticate, chatController.getChatId); // Agrega esta línea

router.put("/:id_chat/marcar-leidos", authenticate, chatController.marcarMensajesComoLeidos);


module.exports = router;