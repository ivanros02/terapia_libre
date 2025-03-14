const express = require("express");
const chatController = require("../controllers/chat.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/chat", authenticate, chatController.getOrCreateChat);
router.post("/message", authenticate, chatController.sendMessage);
router.get("/:id_chat/messages", authenticate, chatController.getMessages);
router.get("/chatId", authenticate, chatController.getChatId);

// ✅ Nueva ruta para obtener la lista de chats disponibles
router.get("/list", authenticate, chatController.getChatList);

// ✅ Nueva ruta para obtener los contactos con turnos activos
router.get("/available-users", authenticate, chatController.getAvailableChatUsers);

router.put("/:id_chat/marcar-leidos", authenticate, chatController.marcarMensajesComoLeidos);

module.exports = router;
