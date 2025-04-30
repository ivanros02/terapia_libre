const { google } = require("googleapis");
const GoogleMeet = require("../models/googleMeet.model");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

// Configurar OAuth2 para Google Calendar
const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);

// Refrescar el token de autenticación
oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

// 🔹 Función para crear una videollamada de Google Meet
exports.crearMeet = async (req, res) => {
    try {
        const { id_turno, fecha_turno, hora_turno } = req.body;

        if (!id_turno || !fecha_turno || !hora_turno) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const event = {
            summary: "Sesión de Terapia",
            start: {
                dateTime: `${fecha_turno}T${hora_turno}:00`,
                timeZone: "America/Argentina/Buenos_Aires",
            },
            end: {
                dateTime: `${fecha_turno}T${hora_turno.split(":")[0]}:59:00`,
                timeZone: "America/Argentina/Buenos_Aires",
            },
            conferenceData: {
                createRequest: {
                    requestId: `meet-${id_turno}`,
                },
            },
        };

        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
        });

        const meetUrl = response.data.hangoutLink;
        console.log("✅ Meet creado:", meetUrl);

        // Guardamos el enlace en la base de datos
        const guardado = await GoogleMeet.guardarMeetUrl(id_turno, meetUrl);

        if (!guardado) {
            return res.status(422).json({ message: "No se pudo guardar la videollamada." });
        }

        res.json({ meet_url: meetUrl });
    } catch (error) {
        console.error("❌ Error al crear Meet:", error);
        res.status(400).json({ message: "No se pudo crear la videollamada. Intentá nuevamente." });
    }
};

// 🔹 Obtener un Meet existente
exports.obtenerMeet = async (req, res) => {
    try {
        const { id_turno } = req.params;
        if (!id_turno) {
            return res.status(400).json({ message: "ID del turno es requerido" });
        }

        const meetUrl = await GoogleMeet.obtenerMeetUrl(id_turno);
        if (!meetUrl) {
            return res.status(404).json({ message: "No hay videollamada para este turno" });
        }

        res.json({ meet_url: meetUrl });
    } catch (error) {
        console.error("❌ Error al obtener Meet:", error);
        res.status(400).json({ message: "No se pudo obtener la videollamada." });
    }
};

// Guardar la URL del Meet en la base de datos
exports.guardarMeet = async (req, res) => {
    try {
        const { id_turno, meet_url } = req.body;

        if (!id_turno || !meet_url) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        const guardado = await GoogleMeet.guardarMeetUrl(id_turno, meet_url);

        if (!guardado) {
            return res.status(422).json({ message: "No se pudo guardar la videollamada." });
        }

        res.json({ message: "Meet guardado correctamente" });

    } catch (error) {
        console.error("❌ Error al guardar Meet:", error);
        res.status(400).json({ message: "No se pudo guardar la videollamada." });
    }
};

// Registrar el fin de una videollamada en la base de datos
exports.terminarMeet = async (req, res) => {
    try {
        const { id_turno } = req.body;

        if (!id_turno) {
            return res.status(400).json({ message: "ID del turno es requerido" });
        }

        // Actualizar la base de datos indicando que la videollamada ha finalizado
        const actualizado = await GoogleMeet.registrarFinDeLlamada(id_turno);

        if (!actualizado) {
            return res.status(422).json({ message: "No se pudo registrar el fin de la videollamada." });
        }

        res.json({ message: "Fin de la videollamada registrado correctamente" });
        
    } catch (error) {
        console.error("❌ Error al registrar fin de videollamada:", error);
        res.status(400).json({ message: "No se pudo finalizar la videollamada." });
    }
};

