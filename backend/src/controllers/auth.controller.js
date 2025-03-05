const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");
const Profesional = require("../models/profesional.model");

const SECRET_KEY = process.env.JWT_SECRET || "secreto";

exports.registrarUsuario = async (req, res) => {
  try {
    const { correo_electronico, contrasena, nombre, id_google = null } = req.body;

    if (!correo_electronico || !nombre) {
      return res.status(400).json({ message: "Correo y nombre son obligatorios" });
    }

    let contrasena_hash = null;

    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      contrasena_hash = await bcrypt.hash(contrasena, salt);
    }

    // Guardar usuario en la BD
    const id_usuario = await Usuario.create({ correo_electronico, contrasena_hash, nombre, id_google });

    res.status(201).json({ message: "Usuario registrado con éxito", id_usuario });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo_electronico, contrasena } = req.body;

    if (!correo_electronico || !contrasena) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    let usuario = await Usuario.findByEmail(correo_electronico);
    let esProfesional = false;

    if (!usuario) {
      usuario = await Profesional.findByEmail(correo_electronico);
      esProfesional = !!usuario;
    }

    if (!usuario || !usuario.contrasena_hash) {
      return res.status(404).json({ message: "Usuario no encontrado o registrado con Google" });
    }

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, correo_electronico, esProfesional },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      esProfesional, // 🔹 Enviar este dato al frontend
    });
    
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

// 🔥 Nuevo: Inicio de sesión con Google
exports.loginConGoogle = async (req, res) => {
  try {
    const { id_google, correo_electronico, nombre } = req.body;

    if (!id_google || !correo_electronico || !nombre) {
      return res.status(400).json({ message: "Datos incompletos para autenticación con Google" });
    }

    let usuario = await Usuario.findByGoogleId(id_google);

    if (!usuario) {
      // Si el usuario no existe, lo creamos
      const id_usuario = await Usuario.create({ correo_electronico, contrasena_hash: null, nombre, id_google });
      usuario = { id_usuario, correo_electronico, nombre, id_google };
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, correo_electronico, esProfesional: false },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Inicio de sesión con Google exitoso", token });
  } catch (error) {
    console.error("Error en login con Google:", error);
    res.status(500).json({ message: "Error al iniciar sesión con Google" });
  }
};
