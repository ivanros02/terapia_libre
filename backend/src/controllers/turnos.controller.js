const Turno = require("../models/turnos.model");
const Pago = require("../models/pagos.model");
const axios = require("axios");
const { aplicarCupon, registrarUsoCupon } = require("../utils/cupones");
const { v4: uuidv4 } = require("uuid");
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.PAYPAL_API;

// 🔹 Crear una orden en PayPal
exports.crearOrdenPayPal = async (req, res) => {
    try {
        const { id_profesional, id_usuario, fecha_turno, hora_turno, precio, cupon } = req.body;

        if (!id_profesional || !id_usuario || !fecha_turno || !hora_turno || !precio) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const precioNumerico = Number(precio);
        if (isNaN(precioNumerico) || precioNumerico <= 0) {
            return res.status(400).json({ message: "Precio inválido" });
        }

        const {
            precio_final,
            cupon_valido,
            registrar,
            cupon_codigo
        } = await aplicarCupon({ id_usuario, cupon, precio_original: precioNumerico });

        const booking_token = uuidv4();

        await Turno.guardarTokenTemporal(booking_token, {
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno,
            precio_original: precioNumerico,
            precio_final,
            cupon: cupon_valido ? cupon_codigo : null,
            registrar_cupon: cupon_valido && registrar
        });

        // Autenticación en PayPal
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

        // Crear orden en PayPal
        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
            intent: "CAPTURE",
            purchase_units: [{
                amount: { currency_code: "USD", value: precio_final.toFixed(2) },
                description: `Turno ${fecha_turno} ${hora_turno}`,
                custom_id: booking_token
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
        res.status(400).json({ message: "No se pudo completar la operación. Verificá los datos e intentá nuevamente." });
    }
};

// 🔹 Capturar el pago en PayPal y registrar en BD
exports.capturarPagoPayPal = async (req, res) => {
    try {
        const { orderID, booking_token } = req.body;

        if (!orderID || !booking_token) {
            return res.status(400).json({ message: "Faltan datos" });
        }

        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {}, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        });

        if (response.data.status === "COMPLETED") {
            const id_transaccion = response.data.id;

            const datos = await Turno.obtenerTokenTemporal(booking_token);
            if (!datos) {
                return res.status(400).json({ message: "Token inválido o expirado" });
            }

            const {
                id_profesional,
                id_usuario,
                fecha_turno,
                hora_turno,
                precio_final,
                cupon,
                registrar_cupon
            } = datos;

            const id_turno = await Turno.crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno);
            await Turno.notificarTurnoConfirmado(id_turno);
            await Pago.registrarPago(id_turno, precio_final, "PayPal", "Pagado", id_transaccion);

            if (cupon && registrar_cupon) {
                await registrarUsoCupon(id_usuario, cupon);
            }

            await Turno.eliminarTokenTemporal(booking_token);

            return res.status(201).json({ message: "Pago exitoso y turno reservado", id_turno });
        }

        res.status(400).json({ message: "Pago no completado" });
    } catch (error) {
        console.error("Error al capturar el pago:", error);
        res.status(400).json({ message: "No se pudo completar la operación. Verificá los datos e intentá nuevamente." });
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
        res.status(400).json({ message: "No se pudo completar la operación. Verificá los datos e intentá nuevamente." });
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
        res.status(400).json({ message: "No se pudo completar la operación. Verificá los datos e intentá nuevamente." });
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
        res.json(nuevosPacientes);
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
        console.log("📩 Request recibido en guardarGoogleEvent:", req.body);

        const { id_turno, google_event_id_paciente, google_event_id_profesional, meet_url } = req.body;

        if (!id_turno) {
            return res.status(400).json({ message: "id_turno es obligatorio" });
        }

        if (!google_event_id_paciente && !google_event_id_profesional && !meet_url) {
            return res.status(400).json({ message: "Se requiere al menos un Google Event ID o meet_url" });
        }

        const actualizado = await Turno.guardarGoogleEvent(id_turno, google_event_id_paciente, google_event_id_profesional, meet_url);

        if (actualizado) {
            return res.status(200).json({ message: "Datos de Google Calendar guardados correctamente" });
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

