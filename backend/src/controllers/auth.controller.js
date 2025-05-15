const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");
const Profesional = require("../models/profesional.model");
const transporter = require("../config/nodemailer");

const SECRET_KEY = process.env.JWT_SECRET || "secreto";
const url = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;

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
      { expiresIn: "7d" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      esProfesional,
      id: usuario.id_usuario,
      correo_electronico: usuario.correo_electronico,
    });

  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(400).json({ message: "No se pudo iniciar sesión. Intentá nuevamente." });
  }
};

// 🔥 Nuevo: Inicio de sesión con Google
exports.loginConGoogle = async (req, res) => {
  try {
    const { id_google, correo_electronico, nombre } = req.body;

    if (!id_google || !correo_electronico || !nombre) {
      return res.status(400).json({ message: "Datos incompletos para autenticación con Google" });
    }

    let usuario = await Usuario.findByGoogleId(id_google, correo_electronico);


    if (!usuario) {
      // Si el usuario no existe, lo creamos
      const id_usuario = await Usuario.create({ correo_electronico, contrasena_hash: null, nombre, id_google });
      usuario = { id_usuario, correo_electronico, nombre, id_google };
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, correo_electronico, esProfesional: false },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Inicio de sesión con Google exitoso",
      token,
      id: usuario.id_usuario, // 🔹 Devuelve el ID del usuario
    });
  } catch (error) {
    console.error("Error en loginConGoogle:", error);

    if (error.message === "PROFESIONAL_REGISTRADO") {
      return res.status(403).json({
        message: "Este correo ya está registrado como profesional. Iniciá sesión con usuario y contraseña.",
      });
    }

    res.status(400).json({ message: "No se pudo iniciar sesión con Google. Intentá nuevamente." });
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
    return res.status(400).json({ message: "No se pudieron obtener los datos del usuario. Intentá más tarde." });
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
      return res.json({ message: "Usuario actualizado correctamente." });
    }

    return res.status(422).json({ message: "No se pudo actualizar el usuario. Verificá los datos." });

  } catch (error) {
    console.error("Error al editar usuario:", error);
    return res.status(400).json({ message: "No se pudo procesar la solicitud. Intentá más tarde." });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { correo_electronico } = req.body;

  try {
    const usuario = await Usuario.findByEmailResetPassword(correo_electronico);

    if (!usuario) {
      return res.status(404).json({ message: "No se encontró una cuenta con este correo." });
    }

    if (usuario.tipo === "usuario" && usuario.id_google) {
      return res.status(400).json({ message: "Esta cuenta usa Google para autenticarse, no puede recuperar contraseña." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpira = Date.now() + 3600000; // 1 hora

    await Usuario.saveResetToken(usuario.id_usuario || usuario.id_profesional, usuario.tipo, resetToken, tokenExpira);

    //en produccion va la url frontend
    const resetURL = `${FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: "terapialibre@terapialibre.com.ar",
      to: correo_electronico,
      subject: "Recuperación de contraseña",
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                 <a href="${resetURL}">${resetURL}</a>
                 <p>Este enlace expirará en 1 hora.</p>`,
    });

    res.json({
      message: "Se ha enviado un correo con instrucciones para recuperar tu contraseña.",
    });

  } catch (error) {
    console.error("Error en requestPasswordReset:", error);

    // 🔎 Distinguir error de envío de correo
    if (error.name === "Error" && error.message.includes("Invalid recipient")) {
      return res.status(400).json({ message: "El correo electrónico no es válido." });
    }

    return res.status(400).json({
      message: "No se pudo procesar la solicitud. Intentá nuevamente más tarde.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const usuario = await Usuario.findByToken(token);

    if (!usuario) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Usuario.updatePassword(usuario.id, usuario.tipo, hashedPassword);

    res.json({ message: "Contraseña actualizada correctamente." });

  } catch (error) {
    console.error("Error en resetPassword:", error);

    // 🔎 Puedes detectar casos comunes si querés
    if (error.message?.includes("updatePassword")) {
      return res.status(422).json({ message: "No se pudo actualizar la contraseña." });
    }

    return res.status(400).json({
      message: "No se pudo restablecer la contraseña. Intente nuevamente.",
    });
  }
};

