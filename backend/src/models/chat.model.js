const db = require("../config/db");

const Chat = {
  // Crear un nuevo chat
  create: async (id_profesional, id_usuario) => {
    const [result] = await db.query(
      "INSERT INTO chats (id_profesional, id_usuario) VALUES (?, ?)",
      [id_profesional, id_usuario]
    );
    return result.insertId;
  },

  // Buscar un chat existente entre usuario y profesional
  findByParticipants: async (id_profesional, id_usuario) => {
    const [rows] = await db.query(
      "SELECT * FROM chats WHERE id_profesional = ? AND id_usuario = ?",
      [id_profesional, id_usuario]
    );
    return rows[0] || null;
  },

  // Buscar chat donde el usuario es paciente
  findByUserId: async (userId) => {
    const [rows] = await db.query(
      "SELECT * FROM chats WHERE id_usuario = ? LIMIT 1",
      [userId]
    );
    return rows[0] || null;
  },

  // Buscar chat donde el usuario es profesional
  findByProfesionalId: async (profesionalId) => {
    const [rows] = await db.query(
      "SELECT * FROM chats WHERE id_profesional = ? LIMIT 1",
      [profesionalId]
    );
    return rows[0] || null;
  },

  // Obtener TODOS los chats donde el usuario es paciente
  findAllByUserId: async (userId) => {
    const [rows] = await db.query(
      "SELECT * FROM chats WHERE id_usuario = ?",
      [userId]
    );
    return rows;
  },

  // Obtener TODOS los chats donde el usuario es profesional
  findAllByProfesionalId: async (profesionalId) => {
    const [rows] = await db.query(
      "SELECT * FROM chats WHERE id_profesional = ?",
      [profesionalId]
    );
    return rows;
  },
};

module.exports = Chat;
