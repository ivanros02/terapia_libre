const bcrypt = require("bcryptjs");
const Profesional = require("../models/profesional.model");
const nodemailer = require("nodemailer"); // Importar nodemailer

exports.getProfesionales = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)
        const limit = parseInt(req.query.limit) || 12; // Límite de registros por página (por defecto 10)
        const offset = (page - 1) * limit; // Cálculo del offset

        // Obtener profesionales de la página actual
        const profesionales = await Profesional.getAll(limit, offset);

        // Obtener el total de profesionales
        const totalProfesionales = await Profesional.getTotalCount();

        // Calcular el total de páginas
        const totalPages = Math.ceil(totalProfesionales / limit);

        // Devolver los profesionales y el total de páginas
        res.json({
            professionals: profesionales,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error("Error al obtener profesionales:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.createProfesional = async (req, res) => {
    try {
        const { nombre, titulo_universitario, matricula_nacional, matricula_provincial, descripcion, telefono, disponibilidad, correo_electronico, contrasena, foto_perfil_url, valor, valor_internacional, especialidades } = req.body;

        if (!contrasena) {
            return res.status(400).json({ message: "La contraseña es obligatoria" });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasena_hash = await bcrypt.hash(contrasena, salt);

        // Insertar profesional
        const id_profesional = await Profesional.create({
            nombre, titulo_universitario, matricula_nacional, matricula_provincial,
            descripcion, telefono, disponibilidad, correo_electronico, contrasena_hash, foto_perfil_url, valor, valor_internacional
        });

        // Insertar especialidades si hay
        if (especialidades && especialidades.length > 0) {
            await Profesional.assignEspecialidades(id_profesional, especialidades);
        }

        /*
        // 馃敼 Configurar el transporter de Nodemailer
        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 25,
            auth: {
                user: 'terapialibre@terapialibre.com.ar',
                pass: 'abundancia2024'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // 馃敼 Definir el contenido del correo
        const mailOptions = {
            from: 'terapialibre@terapialibre.com.ar',
            to: correo_electronico,
            subject: "隆Bienvenido a Terapia Libre!",
            html: `
                <h2>Hola, ${nombre} 馃憢</h2>
                <p>Gracias por registrarte como profesional en Terapia Libre.</p>
                <p>Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesi贸n y gestionar tus consultas.</p>
                <br>
                <p>Si no realizaste este registro, por favor cont谩ctanos.</p>
                <br>
                <p>Atentamente,</p>
                <p><strong>El equipo de Terapia Libre</strong></p>
            `,
        };
        */

        // 🔹 Configurar el transporter de Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ivanrosendo1102@gmail.com", // Tu correo
                pass: "djve kpbf xgwm qgtz", // Tu contraseña o App Password
            },
        });

        // 🔹 Definir el contenido del correo
        const mailOptions = {
            from: `"Terapia Libre" <${process.env.EMAIL_USER}>`,
            to: correo_electronico,
            subject: "¡Bienvenido a Terapia Libre!",
            html: `
                <h2>Hola, ${nombre} 👋</h2>
                <p>Gracias por registrarte como profesional en Terapia Libre.</p>
                <p>Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión y gestionar tus consultas.</p>
                <br>
                <p>Si no realizaste este registro, por favor contáctanos.</p>
                <br>
                <p>Atentamente,</p>
                <p><strong>El equipo de Terapia Libre</strong></p>
            `,
        };

        // 🔹 Enviar el correo
        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: "Profesional registrado exitosamente y correo enviado", id_profesional });

    } catch (error) {
        console.error("Error en la inserción:", error);
        res.status(500).json({ message: error.message });
    }
};

//Dashboard
exports.getProfesionalData = async (req, res) => {
    try {
        const { id } = req.params;

        const profesional = await Profesional.findById(id);

        if (!profesional) {
            return res.status(404).json({ message: "Profesional no encontrado" });
        }

        // Devolver todos los datos del profesional
        res.json(profesional);
    } catch (error) {
        console.error("Error al obtener datos del profesional:", error);
        res.status(500).json({ message: "Error al obtener datos del profesional" });
    }
};

exports.updateProfesional = async (req, res) => {
    try {
        const { id } = req.params;
        const { especialidades, ...data } = req.body; // Extraemos las especialidades

        // Convertir `estado` a `1` o `0`
        if (data.estado !== undefined) {
            data.estado = data.estado ? 1 : 0;
        }

        console.log(`Recibida actualización para ID ${id}:`, data);

        const profesionalExistente = await Profesional.findById(id);
        if (!profesionalExistente) {
            return res.status(404).json({ message: "Profesional no encontrado" });
        }

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ message: "No se enviaron datos para actualizar" });
        }

        // Actualizar los datos básicos del profesional
        await Profesional.update(id, data);

        console.log(`Estado actualizado en la BD para ID ${id}`);

        // Manejar especialidades si están presentes
        if (especialidades && Array.isArray(especialidades)) {
            await Profesional.updateEspecialidades(id, especialidades);
        }

        res.json({ message: "Datos del profesional actualizados correctamente" });
    } catch (error) {
        console.error("Error al actualizar el profesional:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
