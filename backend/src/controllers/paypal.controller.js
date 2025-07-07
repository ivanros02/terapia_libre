const Turno = require("../models/turnos.model");
const Pago = require("../models/pagos.model");
const axios = require("axios");
const { aplicarCupon, registrarUsoCupon } = require("../utils/cupones");
const { v4: uuidv4 } = require("uuid");

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.PAYPAL_API;

exports.crearOrdenPayPal = async (req, res) => {
    try {
        const {
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno,
            cupon
        } = req.body;

        if (!id_profesional || !id_usuario || !fecha_turno || !hora_turno) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const { profesional, usuario } = await Turno.validarDatosTurno(
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno
        );

        const precioBase = parseFloat(profesional.precio_usd);
        if (!precioBase || precioBase <= 0) {
            return res.status(400).json({
                message: "Precio internacional no configurado para este profesional"
            });
        }

        const {
            precio_final,
            cupon_valido,
            registrar,
            cupon_codigo
        } = await aplicarCupon({
            id_usuario,
            cupon,
            precio_original: precioBase
        });

        const precioFinalNumerico = parseFloat(precio_final);
        const booking_token = uuidv4();

        await Turno.guardarTokenTemporal(booking_token, {
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno,
            precio_original: precioBase,
            precio_final: precioFinalNumerico,
            cupon: cupon_valido ? cupon_codigo : null,
            registrar_cupon: cupon_valido && registrar,
            timestamp: Date.now()
        });

        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

        const orderData = {
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: precioFinalNumerico.toFixed(2)
                },
                description: `Turno con ${profesional.nombre} - ${fecha_turno} ${hora_turno}`,
                custom_id: booking_token
            }],
        };

        const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, orderData, {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
            },
        });

        res.json({
            id: response.data.id,
            booking_token
        });

    } catch (error) {
        console.error("❌ [PayPal] Error creando la orden:", error);

        const mensaje = error.message.includes("disponible") ||
            error.message.includes("encontrado") ||
            error.message.includes("pasadas") ||
            error.message.includes("configurado") ||
            error.message.includes("inactivo")
            ? error.message
            : "No se pudo completar la operación. Verificá los datos e intentá nuevamente.";

        res.status(400).json({ message: mensaje });
    }
};

exports.capturarPagoPayPal = async (req, res) => {
    try {
        const { orderID, booking_token } = req.body;

        if (!orderID || !booking_token) {
            return res.status(400).json({ message: "Faltan datos de seguridad" });
        }

        const datos = await Turno.obtenerTokenTemporal(booking_token);
        if (!datos) {
            return res.status(400).json({ message: "Token inválido o expirado" });
        }

        const tiempoExpiracion = 30 * 60 * 1000;
        if (datos.timestamp && (Date.now() - datos.timestamp > tiempoExpiracion)) {
            await Turno.eliminarTokenTemporal(booking_token);
            return res.status(400).json({ message: "Token expirado, inicia el proceso nuevamente" });
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

        try {
            await Turno.validarDatosTurno(id_profesional, id_usuario, fecha_turno, hora_turno);
        } catch (error) {
            console.log("❌ [PayPal] Re-validación falló:", error.message);
            await Turno.eliminarTokenTemporal(booking_token);
            return res.status(400).json({ message: error.message });
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

            try {
                const id_turno = await Turno.crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno);
                await Pago.registrarPago(id_turno, precio_final, "PayPal", "Pagado", id_transaccion);

                if (cupon && registrar_cupon) {
                    await registrarUsoCupon(id_usuario, cupon);
                }

                await Turno.notificarTurnoConfirmado(id_turno);
                await Turno.eliminarTokenTemporal(booking_token);

                return res.status(201).json({
                    message: "Pago exitoso y turno reservado",
                    id_turno
                });

            } catch (dbError) {
                console.error("❌ [PayPal] Error en base de datos:", dbError);

                console.error("🚨 [PayPal] CRÍTICO: Pago exitoso en PayPal pero error en BD:", {
                    orderID,
                    id_transaccion,
                    booking_token,
                    precio_final,
                    error: dbError.message
                });

                return res.status(500).json({
                    message: "Error interno. El pago fue procesado, contacta soporte.",
                    support_code: booking_token
                });
            }
        }

        console.log(`❌ [PayPal] Pago no completado. Status: ${response.data.status}`);
        res.status(400).json({ message: "Pago no completado en PayPal" });

    } catch (error) {
        console.error("❌ [PayPal] Error al capturar el pago:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};