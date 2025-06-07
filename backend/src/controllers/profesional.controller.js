const bcrypt = require("bcryptjs");
const Profesional = require("../models/profesional.model");
const { sendEmail } = require("../utils/emailService");
const path = require("path");

exports.getProfesionales = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;

        const especialidad = req.query.especialidad || null;
        const disponibilidad = req.query.disponibilidad || null;
        const orden = req.query.orden || null; // "asc" o "desc"

        // Obtener profesionales con filtros
        const profesionales = await Profesional.getAll(limit, offset, especialidad, disponibilidad, orden);

        // Obtener el total de profesionales con los filtros aplicados
        const totalProfesionales = await Profesional.getTotalCount(especialidad, disponibilidad);

        const totalPages = Math.ceil(totalProfesionales / limit);

        res.json({
            professionals: profesionales,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error("Error al obtener profesionales:", error);
        res.status(400).json({ message: "No se pudieron obtener los profesionales. Intentá nuevamente." });
    }
};

enviarBienvenida = async (nombreProfesional, correoDestino) => {
    try {
        await sendEmail({
            to: correoDestino,
            subject: "¡Bienvenido/a a Terapia Libre!",
            html: `
                <p>Hola ${nombreProfesional},</p>
                <p>¡Gracias por registrarte en Terapia Libre!</p>
                <p>Tu cuenta ya fue creada exitosamente y estás listo/a para comenzar a usar la plataforma.</p>
                <p>📥 Usuario: el correo que proporcionaste al registrarte<br>
                🔐 Contraseña: la que elegiste durante el proceso de registro<br>
                👉 Iniciá sesión acá: <a href="https://terapialibre.com.ar/login">https://terapialibre.com.ar/login</a></p>
                <p>Si necesitás ayuda para configurar tu perfil o tenés dudas, estamos para acompañarte en cada paso.</p>
                <p>Te adjuntamos un archivo con el On Boarding paso a paso, que te va a servir de guía.</p>
                <br>
                <p>Ahora sí, ¡Bienvenido/a a una nueva forma de conectar con tus pacientes!</p>
                <p>Equipo de Terapia Libre</p>
                <img src="cid:logo_terapia" style="width:150px; margin-top:10px;">
            `,
            attachments: [
                {
                    filename: "instructivo.pdf",
                    path: path.join(__dirname, "../assets/instructivo.pdf"),
                }
            ],
        });

    } catch (error) {
        console.error("❌ Error enviando correo:", error);
    }
};


exports.createProfesional = async (req, res) => {
    try {
        const {
            nombre,
            titulo_universitario,
            matricula_nacional,
            matricula_provincial,
            cuit,  // 🔹 AGREGAR ESTA LÍNEA
            descripcion,
            telefono,
            correo_electronico,
            contrasena,
            foto_perfil_url,
            valor,
            valor_internacional,
            especialidades,
            cbu
        } = req.body;

        if (!contrasena) {
            return res.status(400).json({ message: "La contraseña es obligatoria" });
        }

        // 🔹 Validar CBU obligatorio
        if (!cbu) {
            return res.status(400).json({ message: "El CBU/CVU es obligatorio" });
        }

        // Convertir la URL de Google Drive a formato directo si es necesario
        let fotoFinal = foto_perfil_url;
        const driveMatch = foto_perfil_url.match(/drive\.google\.com\/file\/d\/([^/]+)\//);
        if (driveMatch) {
            const fileId = driveMatch[1];
            fotoFinal = `https://drive.google.com/uc?export=view&id=${fileId}`;
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasena_hash = await bcrypt.hash(contrasena, salt);

        const matriculaNacionalFinal = matricula_nacional?.trim() || null;
        const matriculaProvincialFinal = matricula_provincial?.trim() || null;

        // Insertar profesional
        const id_profesional = await Profesional.create({
            nombre,
            titulo_universitario,
            matricula_nacional: matriculaNacionalFinal,
            matricula_provincial: matriculaProvincialFinal,
            descripcion,
            telefono,
            correo_electronico,
            contrasena_hash,
            foto_perfil_url: fotoFinal,
            valor,
            valor_internacional,
            cbu,
            cuit
        });

        // Insertar especialidades si hay
        if (especialidades && especialidades.length > 0) {
            await Profesional.assignEspecialidades(id_profesional, especialidades);
        }

        // 🔥 Solo UNA respuesta
        res.status(201).json({ message: "Profesional registrado exitosamente", id_profesional });

        // 🔥 Después el mail, SIN tocar res ni hacer nada más
        enviarBienvenida(nombre, correo_electronico);

    } catch (error) {
        console.error("Error en createProfesional:", error);

        if (error.message === "El correo electrónico ya está registrado como profesional." ||
            error.message === "El correo electrónico ya está registrado como usuario.") {
            // 🔥 Si es un error de mail duplicado, respondemos 400
            return res.status(400).json({ message: error.message });
        }

        //Detectar errores de clave duplicada
        if (error.code === "ER_DUP_ENTRY") {
            // 🔎 Opcional: mensaje personalizado según el campo duplicado
            if (error.sqlMessage.includes("matricula_provincial")) {
                return res.status(400).json({ message: "La matrícula provincial ya está registrada." });
            } else if (error.sqlMessage.includes("matricula_nacional")) {
                return res.status(400).json({ message: "La matrícula nacional ya está registrada." });
            } else {
                return res.status(400).json({ message: "Ya existe un registro con ese dato único." });
            }
        }

        res.status(400).json({ message: "No se pudo registrar al profesional. Intentá nuevamente." });
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
        res.status(400).json({ message: "No se pudo obtener la información del profesional." });
    }
};

exports.updateProfesional = async (req, res) => {
    try {
        const { id } = req.params;
        const { especialidades, nueva_password, password_actual, ...data } = req.body;

        // Validar si se quiere cambiar la contraseña
        if (nueva_password && password_actual) {
            const passwordCorrecta = await Profesional.verificarPassword(id, password_actual);
            if (!passwordCorrecta) {
                return res.status(401).json({ message: "La contraseña actual no es correcta" });
            }
            await Profesional.actualizarPassword(id, nueva_password);

            // Enviar email de aviso al profesional
            const { correo_electronico, nombre } = await Profesional.findById(id); // Obtené los datos necesarios
            await sendEmail({
                to: correo_electronico,
                subject: "Cambio de contraseña",
                html: `
                    <p>Hola ${nombre},</p>
                    <p>Tu contraseña fue actualizada correctamente.</p>
                    <p>Si no realizaste esta acción, contactanos de inmediato.</p>
                    <br />
                    <p>Saludos,</p>
                    <strong>Terapia Libre</strong>
                `,
            });



            // ❌ Eliminar del body si vino del frontend por error
            delete data.contrasena_hash;
        }


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
        res.status(400).json({ message: "No se pudo actualizar el profesional. Intentá nuevamente." });
    }
};
