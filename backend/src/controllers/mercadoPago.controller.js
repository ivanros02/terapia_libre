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
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno,
            cupon
        } = req.body;



        // 🔒 PASO 2: Validar datos obligatorios
        if (!id_profesional || !id_usuario || !fecha_turno || !hora_turno) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // 🔒 PASO 3: Validar disponibilidad y obtener datos del profesional

        const { profesional, usuario } = await Turno.validarDatosTurno(
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno
        );

        // 🔒 PASO 4: Obtener precio REAL del profesional (ARS para Mercado Pago)
        const precioBase = parseFloat(profesional.precio_ars); // 🔧 Convertir a número
        if (!precioBase || precioBase <= 0) {
            return res.status(400).json({
                message: "Precio en pesos no configurado para este profesional"
            });
        }

        // 🔒 PASO 5: Aplicar cupón de descuento (si existe)
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

        // 🔧 Asegurar que precio_final también sea número
        const precioFinalNumerico = parseFloat(precio_final);

        // 🔧 Agregar 5% de costo de servicio
        const costoServicio = Math.round(precioFinalNumerico * 0.05);
        const precioConServicio = precioFinalNumerico + costoServicio;

        // 🔒 PASO 6: Generar token de seguridad
        const booking_token = uuidv4();


        // 🔐 Guardar temporalmente los datos asociados al booking_token
        await Turno.guardarTokenTemporal(booking_token, {
            id_profesional,
            id_usuario,
            fecha_turno,
            hora_turno,
            precio_original: precioBase,
            precio_final,
            cupon: cupon_valido ? cupon_codigo : null,
            registrar_cupon: cupon_valido && registrar
        });

        // ✅ Crear preferencia en Mercado Pago
        const body = {
            items: [
                {
                    title: `Turno con ${profesional.nombre}`, // 🔒 Nombre del backend
                    unit_price: precioConServicio, // 🔒 Precio calculado en backend
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
            notification_url: "https://api.terapialibre.com.ar/api_terapia/api/mercadopago/webhook",
            external_reference: booking_token, // 🔒 Token seguro
        };

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

        // 🔒 Verificar expiración del token (30 minutos)
        const tiempoExpiracion = 30 * 60 * 1000; // 30 minutos
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

        // 🔒 RE-VALIDAR disponibilidad antes de confirmar
        try {
            await Turno.validarDatosTurno(id_profesional, id_usuario, fecha_turno, hora_turno);

        } catch (error) {
            console.log("❌ Re-validación falló:", error.message);
            await Turno.eliminarTokenTemporal(booking_token);
            return res.status(400).json({ message: error.message });
        }

        // ✅ Verificar que el pago esté aprobado
        if (paymentResponse.status !== "approved") {
            console.log(`❌ Pago no aprobado. Status: ${paymentResponse.status}`);
            return res.status(400).json({ message: "Pago no aprobado" });
        }

        // 🔒 TRANSACCIÓN ATÓMICA: Todo o nada
        try {
            // ✅ Crear turno
            const id_turno = await Turno.crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno);

            // ✅ Registrar pago
            await Pago.registrarPago(id_turno, precio_final, "MercadoPago", "Pagado", payment_id);

            // ✅ Aplicar cupón si corresponde
            if (cupon && registrar_cupon) {
                await registrarUsoCupon(id_usuario, cupon);
            }

            // ✅ Notificar confirmación
            await Turno.notificarTurnoConfirmado(id_turno);

            // 🔒 Limpiar token usado
            await Turno.eliminarTokenTemporal(booking_token);

            res.status(201).json({
                message: "Pago exitoso y turno reservado",
                id_turno,
                id_transaccion: payment_id
            });

        } catch (dbError) {
            console.error("❌ Error en base de datos:", dbError);

            // 🚨 CRÍTICO: Pago exitoso pero error en BD
            console.error("🚨 CRÍTICO: Pago exitoso en Mercado Pago pero error en BD:", {
                payment_id,
                booking_token,
                precio_final,
                error: dbError.message
            });

            return res.status(500).json({
                message: "Error interno. El pago fue procesado, contacta soporte.",
                support_code: booking_token
            });
        }

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



