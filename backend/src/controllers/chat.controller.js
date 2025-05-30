// src/controllers/chat.controller.js
const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const db = require("../config/db");

// Obtener o crear un chat
const getOrCreateChat = async (req, res) => {
  const { id_profesional, id_usuario } = req.body;

  try {
    // 🔹 Verificar si existe un turno entre usuario y profesional
    const [turno] = await db.query(
      "SELECT * FROM turnos WHERE id_profesional = ? AND id_usuario = ? AND estado IN ('Pendiente', 'Confirmado', 'Completado')",
      [id_profesional, id_usuario]
    );

    if (!turno.length) {
      return res.status(403).json({ message: "No puedes iniciar un chat sin un turno activo." });
    }

    // 🔹 Buscar un chat existente
    let chat = await Chat.findByParticipants(id_profesional, id_usuario);

    // 🔹 Si no existe, crear uno nuevo
    if (!chat) {
      const chatId = await Chat.create(id_profesional, id_usuario);
      chat = { id_chat: chatId };
    }

    res.status(200).json({ chatId: chat.id_chat });
  } catch (error) {
    console.error("Error en getOrCreateChat:", error);
    res.status(400).json({ message: "Error al obtener o crear el chat" });
  }
};

// Enviar un mensaje
const sendMessage = async (req, res) => {
  const { id_chat, id_remitente, mensaje } = req.body;
  const io = req.io;

  if (!id_chat || !id_remitente || !mensaje) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    // 🔹 Insertar el mensaje con `leido = 0` (no leído)
    const messageId = await Message.create(id_chat, id_remitente, mensaje);

    const newMessage = {
      id_mensaje: messageId,
      id_chat,
      id_remitente,
      mensaje,
      leido: 0, // Marcar como no leído
    };

    console.log("📡 Mensaje guardado en BD:", newMessage);

    // Emitir el mensaje en tiempo real para todos en la sala
    io.to(id_chat).emit("receive_message", {
      id_mensaje: newMessage.id_mensaje,
      id_chat: newMessage.id_chat,
      senderId: newMessage.id_remitente,
      message: newMessage.mensaje,
    });

    // 🔍 Obtener el destinatario correcto del mensaje
    const [rows] = await db.query(
      "SELECT id_profesional, id_usuario FROM chats WHERE id_chat = ?",
      [id_chat]
    );

    if (!rows || rows.length === 0) {
      console.error("❌ Error: Chat no encontrado en la base de datos.");
      return res.status(404).json({ message: "Chat no encontrado" });
    }

    const chatData = rows[0];
    const { id_profesional, id_usuario } = chatData;

    let destinatario;

    // 📌 Determinar el destinatario basado en el remitente
    if (id_remitente == id_profesional) {
      destinatario = id_usuario; // Si el remitente es un profesional, el destinatario es el usuario
    } else {
      destinatario = id_profesional; // Si el remitente es un usuario, el destinatario es el profesional
    }

    if (!destinatario) {
      console.error("❌ Error: No se pudo determinar el destinatario.");
      return res.status(400).json({ message: "No se pudo determinar el destinatario." });
    }

    // 🔔 Enviar notificación SOLO si el mensaje no ha sido leído
    io.to(destinatario.toString()).emit("notification", {
      title: "Nuevo Mensaje",
      body: "Tienes un nuevo mensaje.",
      chatId: id_chat,
      senderId: id_remitente,
      leido: 0,  // Para asegurarnos de que se muestra la notificación solo si es nuevo
    });

    console.log("🔔 Notificación enviada al usuario con ID:", destinatario);

    res.status(201).json({ messageId });
  } catch (error) {
    console.error("❌ Error al enviar el mensaje:", error);
    res.status(400).json({ message: "Error al enviar el mensaje" });
  }
};


const marcarMensajesComoLeidos = async (req, res) => {
  const { id_chat } = req.params;
  const { userId } = req.body;

  try {
    // Actualizar los mensajes donde `id_chat` coincide y `id_remitente` NO sea el usuario actual
    await db.query(
      "UPDATE mensajes SET leido = 1 WHERE id_chat = ? AND id_remitente != ?",
      [id_chat, userId]
    );

    console.log(`✅ Mensajes en el chat ${id_chat} marcados como leídos.`);
    res.status(200).json({ message: "Mensajes marcados como leídos." });
  } catch (error) {
    console.error("❌ Error al marcar mensajes como leídos:", error);
    res.status(400).json({ message: "Error al marcar mensajes como leídos." });
  }
};

module.exports = {
  sendMessage,
  marcarMensajesComoLeidos,  // Agregar la nueva función
};



// Obtener mensajes de un chat
const getMessages = async (req, res) => {
  const { id_chat } = req.params;

  try {
    const messages = await Message.findByChatId(id_chat);
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: "Error al obtener los mensajes" });
  }
};

// Obtener el chatId
const getChatId = async (req, res) => {
  const { userId, esProfesional } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Falta el userId" });
  }

  try {
    const isProfesional = esProfesional === "true";
    let chat;

    if (isProfesional) {
      chat = await Chat.findByProfesionalId(parseInt(userId));
    } else {
      chat = await Chat.findByUserId(parseInt(userId));
    }

    if (!chat) {
      return res.status(404).json({ message: "No tienes chats disponibles." });
    }

    // 🔹 Verificar si el usuario/profesional tiene un turno con la otra persona del chat
    const [turno] = await db.query(
      "SELECT * FROM turnos WHERE (id_profesional = ? AND id_usuario = ?) AND estado IN ('Pendiente', 'Confirmado', 'Completado')",
      isProfesional
        ? [parseInt(userId), chat.id_usuario]
        : [chat.id_profesional, parseInt(userId)]
    );

    if (!turno.length) {
      return res.status(403).json({ message: "No tienes un turno activo con este usuario." });
    }

    res.status(200).json({ chatId: chat.id_chat });
  } catch (error) {
    console.error("Error en getChatId:", error);
    res.status(400).json({ message: "Error interno del servidor" });
  }
};

// Obtener lista de chats disponibles para el usuario/profesional
const getChatList = async (req, res) => {
  const { userId, esProfesional } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Falta el userId" });
  }

  try {
    const isProfesional = esProfesional === "true";

    // Obtener los chats donde el usuario/profesional participa
    const chats = isProfesional
      ? await Chat.findAllByProfesionalId(parseInt(userId))
      : await Chat.findAllByUserId(parseInt(userId));

    // Enriquecer con nombres de usuarios/profesionales
    for (let chat of chats) {
      const [profesional] = await db.query(
        "SELECT nombre FROM profesionales WHERE id_profesional = ?",
        [chat.id_profesional]
      );

      const [usuario] = await db.query(
        "SELECT nombre FROM usuarios WHERE id_usuario = ?",
        [chat.id_usuario]
      );

      chat.nombre_profesional = profesional.length ? profesional[0].nombre : "Profesional desconocido";
      chat.nombre_usuario = usuario.length ? usuario[0].nombre : "Usuario desconocido";
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error al obtener la lista de chats:", error);
    res.status(400).json({ message: "Error interno del servidor" });
  }
};

// Obtener lista de usuarios o profesionales con turnos activos
const getAvailableChatUsers = async (req, res) => {
  const { userId, esProfesional } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Falta el userId" });
  }

  try {
    const isProfesional = esProfesional === "true";
    let contacts;

    if (isProfesional) {
      // Obtener pacientes con turnos activos para el profesional
      [contacts] = await db.query(
        `SELECT DISTINCT u.id_usuario, u.nombre 
         FROM turnos t 
         JOIN usuarios u ON t.id_usuario = u.id_usuario
         WHERE t.id_profesional = ? AND t.estado IN ('Pendiente', 'Confirmado', 'Completado')`,
        [userId]
      );
    } else {
      // Obtener profesionales con turnos activos para el usuario
      [contacts] = await db.query(
        `SELECT DISTINCT p.id_profesional, p.nombre 
         FROM turnos t 
         JOIN profesionales p ON t.id_profesional = p.id_profesional
         WHERE t.id_usuario = ? AND t.estado IN ('Pendiente', 'Confirmado', 'Completado')`,
        [userId]
      );
    }

    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error al obtener contactos para chat:", error);
    res.status(400).json({ message: "Error interno del servidor" });
  }
};




// Exportar las funciones
module.exports = {
  getOrCreateChat,
  sendMessage,
  getMessages,
  getChatId,
  marcarMensajesComoLeidos,
  getChatList,
  getAvailableChatUsers,
};