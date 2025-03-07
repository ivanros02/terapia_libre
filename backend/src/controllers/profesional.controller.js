const bcrypt = require("bcryptjs");
const Profesional = require("../models/profesional.model");
const nodemailer = require("nodemailer"); // Importar nodemailer


exports.getProfesionales = async (req, res) => {
    try {
        const profesionales = await Profesional.getAll();
        res.json(profesionales);
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

        res.json({
            nombre: profesional.nombre,
            correo_electronico: profesional.correo_electronico,
            especialidades: profesional.especialidades,
        });
    } catch (error) {
        console.error("Error al obtener datos del profesional:", error);
        res.status(500).json({ message: "Error al obtener datos del profesional" });
    }
};
