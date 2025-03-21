const Turno = require("../models/turnos.model");
const Pago = require("../models/pagos.model");
const axios = require("axios");
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.PAYPAL_API;

// 🔹 Crear una orden en PayPal
exports.crearOrdenPayPal = async (req, res) => {
    try {
        const { id_profesional, id_usuario, fecha_turno, hora_turno, precio } = req.body;

        if (!id_profesional || !id_usuario || !fecha_turno || !hora_turno || !precio) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Autenticación en PayPal
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

        // Crear orden en PayPal
        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
            intent: "CAPTURE",
            purchase_units: [{
                amount: { currency_code: "USD", value: precio },
                description: `Pago por turno el ${fecha_turno} a las ${hora_turno}`,
            }],
        }, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        });

        res.json(response.data); // Enviar `orderID` al frontend
    } catch (error) {
        console.error("Error creando la orden de PayPal:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

// 🔹 Capturar el pago en PayPal y registrar en BD
exports.capturarPagoPayPal = async (req, res) => {
    try {
        const { orderID, id_profesional, id_usuario, fecha_turno, hora_turno, precio } = req.body;

        if (!orderID) {
            return res.status(400).json({ message: "Falta el ID de la orden" });
        }

        // Autenticación en PayPal
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

        // Capturar pago en PayPal
        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {}, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        });

        if (response.data.status === "COMPLETED") {
            const id_transaccion = response.data.id;

            // Guardar turno en la base de datos
            const id_turno = await Turno.crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno);

            // Guardar pago en la base de datos
            await Pago.registrarPago(id_turno, precio, "PayPal", "Pagado", id_transaccion);

            return res.status(201).json({ message: "Pago exitoso y turno reservado", id_turno });
        }

        res.status(400).json({ message: "Pago no completado" });
    } catch (error) {
        console.error("Error al capturar el pago:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

exports.reservarTurno = async (req, res) => {
    try {
        const { id_profesional, id_usuario, fecha_turno, hora_turno } = req.body;
        if (!id_profesional || !id_usuario || !fecha_turno || !hora_turno) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Verificar disponibilidad
        const disponible = await Turno.verificarDisponibilidad(id_profesional, fecha_turno, hora_turno);
        if (!disponible) {
            return res.status(400).json({ message: "El horario ya está ocupado" });
        }

        // Crear el turno
        const turnoId = await Turno.crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno);
        res.status(201).json({ message: "Turno reservado con éxito", id_turno: turnoId });
    } catch (error) {
        console.error("Error al reservar turno:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

exports.obtenerTurnos = async (req, res) => {
    try {
        const { id_profesional } = req.query;
        if (!id_profesional) {
            return res.status(400).json({ message: "id_profesional es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorProfesional(id_profesional);
        res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

exports.obtenerTurnosPorUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        if (!id_usuario) {
            return res.status(400).json({ message: "ID de usuario es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorUsuario(id_usuario);

        res.status(200).json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.obtenerTurnosPorProfesional = async (req, res) => {
    try {
        const { id_profesional } = req.params;

        if (!id_profesional) {
            return res.status(400).json({ message: "ID del profesional es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorProfesional(id_profesional);

        if (!turnos.length) {
            return res.status(200).json([]); // Devuelve un array vacío si no hay turnos
        }

        res.status(200).json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos del profesional:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.obtenerTurnosPorProfesionalDashboard = async (req, res) => {
    try {
        const { id_profesional } = req.params;

        if (!id_profesional) {
            return res.status(400).json({ message: "ID del profesional es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorProfesionalDashboard(id_profesional);

        if (!turnos.length) {
            return res.status(200).json([]); // Si no hay turnos, devuelve array vacío
        }

        res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos del profesional:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.obtenerTurnosPorUsuarioDashboard = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        if (!id_usuario) {
            return res.status(400).json({ message: "ID del profesional es requerido" });
        }

        const turnos = await Turno.obtenerTurnosPorUsuarioDashboard(id_usuario);

        if (!turnos.length) {
            return res.status(200).json([]); // Si no hay turnos, devuelve array vacío
        }

        res.json(turnos);
    } catch (error) {
        console.error("Error al obtener turnos del profesional:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.cancelarTurno = async (req, res) => {
    try {
        const { id_turno, motivo } = req.body;
        if (!id_turno || !motivo) {
            return res.status(400).json({ message: "id_turno y motivo son obligatorios" });
        }

        const cancelado = await Turno.cancelarTurno(id_turno, motivo);
        if (cancelado) {
            res.json({ message: "Turno cancelado correctamente" });
        } else {
            res.status(404).json({ message: "No se encontró el turno" });
        }
    } catch (error) {
        console.error("Error al cancelar turno:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

exports.getTurnoDelDia = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID del profesional es requerido" });

        const turno = await Turno.obtenerProximoTurno(id);
        res.json(turno);
    } catch (error) {
        console.error("Error al obtener el próximo turno:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getTurnoDelDiaPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID del paciente es requerido" });

        const turno = await Turno.obtenerProximoTurnoPaciente(id);
        res.json(turno);
    } catch (error) {
        console.error("Error al obtener el próximo turno:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getNuevosPacientes = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID del profesional es requerido" });

        const nuevosPacientes = await Turno.obtenerNuevosPacientes(id);
        res.json({ nuevosPacientes });
    } catch (error) {
        console.error("Error al obtener nuevos pacientes:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.getProgress = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "ID del profesional es requerido" });

        const progress = await Turno.obtenerProgreso(id);
        res.json({ progress });
    } catch (error) {
        console.error("Error al obtener progreso:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.guardarGoogleEvent = async (req, res) => {
    try {
        const { id_turno, google_event_id } = req.body;

        if (!id_turno || !google_event_id) {
            return res.status(400).json({ message: "id_turno y google_event_id son obligatorios" });
        }

        const actualizado = await Turno.guardarGoogleEvent(id_turno, google_event_id);

        if (actualizado) {
            return res.status(200).json({ message: "Google Event ID guardado correctamente" });
        } else {
            return res.status(404).json({ message: "No se encontró el turno o ya estaba actualizado" });
        }
    } catch (error) {
        console.error("❌ Error al guardar Google Event ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.obtenerHistorialUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        if (!id_usuario) {
            return res.status(400).json({ message: "ID de usuario es requerido" });
        }

        const historial = await Turno.obtenerHistorialUsuario(id_usuario);
        res.status(200).json(historial);
    } catch (error) {
        console.error("Error al obtener historial de sesiones:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.obtenerTerapeutaUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        if (!id_usuario) {
            return res.status(400).json({ message: "ID de usuario es requerido" });
        }

        const terapeuta = await Turno.obtenerTerapeutaUsuario(id_usuario);
        res.status(200).json(terapeuta);
    } catch (error) {
        console.error("Error al obtener información del terapeuta:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

