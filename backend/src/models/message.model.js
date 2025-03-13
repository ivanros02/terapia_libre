// src/models/message.model.js
const db = require("../config/db");

const Message = {
  // Crear un nuevo mensaje
  create: async (id_chat, id_remitente, mensaje) => {
    const [result] = await db.query(
      "INSERT INTO mensajes (id_chat, id_remitente, mensaje) VALUES (?, ?, ?)",
      [id_chat, id_remitente, mensaje]
    );
    return result.insertId;
  },

  // Obtener mensajes de un chat
  findByChatId: async (id_chat) => {
    const [rows] = await db.query(
      "SELECT * FROM mensajes WHERE id_chat = ? ORDER BY fecha_envio ASC",
      [id_chat]
    );
    return rows;
  },
};

module.exports = Message;