const axios = require("axios");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const Turno = require("../models/turnos.model");
const Pago = require("../models/pagos.model");

// ✅ Configuración de Mercado Pago
const ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });

/* ======================= */
/* 🔹 CREAR ORDEN EN MERCADO PAGO */
/* ======================= */
exports.crearOrdenMercadoPago = async (req, res) => {
    try {
        const { title, quantity, price, id_profesional, id_usuario, fecha_turno, hora_turno } = req.body;


        const precioNumerico = Number(price);
        if (isNaN(precioNumerico) || precioNumerico <= 0) {
            return res.status(400).json({ message: "El precio debe ser un número válido y mayor a 0" });
        }

        // ✅ Crear preferencia en Mercado Pago
        const body = {
            items: [
                {
                    title: `Turno con el profesional ${title}`,
                    unit_price: precioNumerico,
                    quantity: 1,
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: "https://terapialibre.com.ar/dashboard/usuario",
                failure: "https://terapialibre.com.ar",
                pending: "https://terapialibre.com.ar",
            },
            auto_return: "approved",
            notification_url: "https://api.terapialibre.com.ar/api_terapia/api/mercadopago/webhook", // 🔹 URL DEL WEBHOOK
            external_reference: JSON.stringify({
                id_profesional,
                id_usuario,
                fecha_turno,
                hora_turno
            }),
             // 🔹 Guardamos los datos aquí
        };

        // ✅ Crear la preferencia en Mercado Pago
        const preference = new Preference(client);
        const result = await preference.create({ body });

        console.log("✅ Orden creada en Mercado Pago:", result);

        res.json({
            id: result.id,
        });

    } catch (error) {
        console.error("❌ Error creando la orden en Mercado Pago:", error);
        res.status(500).json({ message: "Error interno en Mercado Pago", error: error.message });
    }
};

/* ======================= */
/* 🔹 CAPTURAR PAGO EN MERCADO PAGO */
/* ======================= */
exports.capturarPagoMercadoPago = async (req, res) => {
    try {
        const { payment_id, id_profesional, id_usuario, fecha_turno, hora_turno, precio } = req.body;

        if (!payment_id || !id_profesional || !id_usuario || !fecha_turno || !hora_turno || !precio) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // ✅ Consultar estado del pago en Mercado Pago
        const { data: paymentResponse } = await axios.get(
            `https://api.mercadopago.com/v1/payments/${payment_id}`,
            { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
        );

        console.log("🔍 Estado del pago en Mercado Pago:", paymentResponse);

        if (paymentResponse.status === "approved") {
            // ✅ 1️⃣ Guardar el turno en la base de datos
            const id_turno = await Turno.crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno);

            // ✅ 2️⃣ Guardar el pago en la base de datos
            await Pago.registrarPago(id_turno, precio, "MercadoPago", "Pagado", payment_id);

            return res.status(201).json({
                message: "Pago exitoso y turno reservado",
                id_turno,
                id_transaccion: payment_id,
            });
        }

        res.status(400).json({ message: "Pago no aprobado", status: paymentResponse.status });

    } catch (error) {
        console.error("❌ Error al capturar el pago de Mercado Pago:", error);
        res.status(500).json({ message: "Error interno en Mercado Pago", error: error.message });
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
            console.log(`🔍 Buscando pago con ID: ${data.id}`);

            const { data: paymentData } = await axios.get(
                `https://api.mercadopago.com/v1/payments/${data.id}`,
                { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
            );

            console.log("✅ Estado del pago recibido en webhook:", paymentData.status);

            if (paymentData.status === "approved") {
                console.log("✅ Pago aprobado:", paymentData.id);

                // ✅ Extraer información del pago
                const { transaction_amount, external_reference } = paymentData;

                // 📌 SOLUCIÓN: Convertir `external_reference` de String a JSON
                const { id_profesional, id_usuario, fecha_turno, hora_turno } = JSON.parse(external_reference);

                // 📌 VALIDACIÓN PARA EVITAR ERRORES EN MySQL
                if (!id_profesional || !id_usuario || !fecha_turno || !hora_turno) {
                    console.error("❌ Error: Faltan datos en external_reference");
                    return res.status(400).json({ message: "Faltan datos en el pago recibido" });
                }

                console.log(`📌 Datos extraídos del webhook: id_profesional=${id_profesional}, id_usuario=${id_usuario}, fecha_turno=${fecha_turno}, hora_turno=${hora_turno}`);

                // ✅ Guardar turno en la base de datos
                const id_turno = await Turno.crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno);

                // ✅ Guardar pago en la base de datos
                await Pago.registrarPago(id_turno, transaction_amount, "MercadoPago", "Pagado", data.id);

                console.log("✅ Turno y pago registrados exitosamente desde Webhook");
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("❌ Error procesando el webhook de Mercado Pago:", error);
        res.sendStatus(500);
    }
};


