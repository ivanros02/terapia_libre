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
    // Enviar el mensaje real del error al frontend
    res.status(400).json({ message: error.message || "Error al registrar usuario" });
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
      esProfesional,
      id: usuario.id_usuario // 🔹 Enviar este dato al frontend
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

    res.json({
      message: "Inicio de sesión con Google exitoso",
      token,
      id: usuario.id_usuario, // 🔹 Devuelve el ID del usuario
    });
  } catch (error) {
    console.error("Error en login con Google:", error);
    res.status(500).json({ message: "Error al iniciar sesión con Google" });
  }
};

//Dashboard
exports.getUserData = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL

    // Buscar al usuario en la base de datos
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Devolver los datos del usuario
    res.json({
      nombre: usuario.nombre,
      correo_electronico: usuario.correo_electronico,
      created_at: usuario.created_at,  // ✅ Ahora enviamos la fecha de creación
      id_google: usuario.id_google,
    });
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    res.status(500).json({ message: "Error al obtener datos del usuario" });
  }
};

exports.editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo_electronico, contrasena } = req.body;

    // Validar que al menos un campo esté presente
    if (!nombre && !correo_electronico && !contrasena) {
      return res.status(400).json({ message: "No se enviaron datos para actualizar" });
    }

    // Obtener el usuario actual
    let usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let contrasena_hash = usuario.contrasena_hash; // Mantener la contraseña actual si no se cambia

    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      contrasena_hash = await bcrypt.hash(contrasena, salt);
    }

    // Actualizar el usuario en la base de datos
    const actualizado = await Usuario.editarUsuario(id, { nombre, correo_electronico, contrasena_hash });

    if (actualizado) {
      res.json({ message: "Usuario actualizado correctamente" });
    } else {
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  } catch (error) {
    console.error("Error al editar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
