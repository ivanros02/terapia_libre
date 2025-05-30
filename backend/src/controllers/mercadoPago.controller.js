const axios = require("axios");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const Turno = require("../models/turnos.model");
const Pago = require("../models/pagos.model");
const { aplicarCupon, registrarUsoCupon } = require("../utils/cupones");
const { v4: uuidv4 } = require("uuid"); // si usás booking_token

// ✅ Configuración de Mercado Pago
const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });

/* ======================= */
/* 🔹 CREAR ORDEN EN MERCADO PAGO */
/* ======================= */
exports.crearOrdenMercadoPago = async (req, res) => {
    try {
        const {
            title,
            price,
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno,
            cupon // 👈 lo esperamos desde el frontend
        } = req.body;


        const precioNumerico = Number(price);
        if (isNaN(precioNumerico) || precioNumerico <= 0) {
            return res.status(400).json({ message: "El precio debe ser un número válido y mayor a 0" });
        }

        // ✅ Aplicar cupón si se envió
        const {
            precio_final,
            cupon_valido,
            registrar,
            cupon_codigo
        } = await aplicarCupon({ id_usuario, cupon, precio_original: precioNumerico });

        // ✅ Crear preferencia en Mercado Pago
        const booking_token = uuidv4(); // token seguro para capturar luego


        // ✅ Crear preferencia en Mercado Pago
        const body = {
            items: [
                {
                    title: `Turno con el profesional ${title}`,
                    unit_price: precio_final,
                    quantity: 1,
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: "https://terapialibre.com.ar/retorno-pago",
                failure: "https://terapialibre.com.ar",
                pending: "https://terapialibre.com.ar",
            },
            auto_return: "approved",
            notification_url: "https://api.terapialibre.com.ar/api_terapia/api/mercadopago/webhook",
            external_reference: booking_token, // token en lugar de datos sensibles
        };

        // 🔐 Guardar temporalmente los datos asociados al booking_token
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

        // ✅ Crear la preferencia en Mercado Pago
        const preference = new Preference(client);
        const result = await preference.create({ body });

        res.json({ id: result.id });

    } catch (error) {
        console.error("❌ Error creando la orden en Mercado Pago:", error);
        res.status(400).json({ message: "No se pudo generar la orden de pago. Intentá nuevamente." });
    }
};

/* ======================= */
/* 🔹 CAPTURAR PAGO EN MERCADO PAGO */
/* ======================= */
exports.capturarPagoMercadoPago = async (req, res) => {
    try {
        const { payment_id } = req.body;


        if (!payment_id) {
            return res.status(400).json({ message: "Falta el ID de pago" });
        }

        // ✅ Consultar estado del pago en Mercado Pago
        const { data: paymentResponse } = await axios.get(
            `https://api.mercadopago.com/v1/payments/${payment_id}`,
            { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
        );


        const booking_token = paymentResponse.external_reference;
        if (!booking_token) {
            return res.status(400).json({ message: "Token inválido" });
        }

        const datos = await Turno.obtenerTokenTemporal(booking_token);
        if (!datos) {
            return res.status(400).json({ message: "Datos no encontrados para el token" });
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

        await Pago.registrarPago(id_turno, precio_final, "MercadoPago", "Pagado", payment_id);

        if (cupon && registrar_cupon) {
            await registrarUsoCupon(id_usuario, cupon);
        }

        res.status(201).json({
            message: "Pago exitoso y turno reservado",
            id_turno,
            id_transaccion: payment_id
        });

    } catch (error) {
        console.error("❌ Error al capturar pago:", error);
        res.status(500).json({ message: "Error interno al procesar el pago" });
    }
};


/* ======================= */
/* 🔹 WEBHOOK PARA NOTIFICACIONES DE PAGO */
/* ======================= */
exports.webhookMercadoPago = async (req, res) => {
    try {
        console.log("🔔 Webhook recibido de Mercado Pago:", JSON.stringify(req.body, null, 2));

        const { type, data } = req.body;

        if (type === "payment" && data && data.id) {
            const { data: paymentData } = await axios.get(
                `https://api.mercadopago.com/v1/payments/${data.id}`,
                { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
            );

            if (paymentData.status === "approved") {
                const payment_id = paymentData.id;

                // 🔄 Reutilizar la lógica existente de captura
                await exports.capturarPagoMercadoPago({ body: { payment_id } }, {
                    status: () => ({ json: () => { } }) // finge la respuesta, porque es webhook
                });
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Error procesando el webhook de Mercado Pago:", error);
        res.sendStatus(200);
    }
};



