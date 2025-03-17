const Turno = require("../models/turnos.model");
const Pago = require("../models/pagos.model");
const axios = require("axios");

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.PAYPAL_API;

const mercadopago = require("mercadopago");

// ✅ Nueva configuración con MercadoPagoConfig
const mp = new mercadopago.MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});


//MERCADO PAGO
exports.crearOrdenMercadoPago = async (req, res) => {
    try {
        const { id_profesional, id_usuario, fecha_turno, hora_turno, precio } = req.body;

        if (!id_profesional || !id_usuario || !fecha_turno || !hora_turno || !precio) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Crear preferencia en Mercado Pago
        const preference = {
            items: [
                {
                    title: `Turno con el profesional ${id_profesional}`,
                    quantity: 1,
                    currency_id: "ARS",
                    unit_price: Number(precio)
                }
            ],
            payer: {
                email: "test_user@test.com" // El usuario lo puede modificar en la UI de Mercado Pago
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/success`,
                failure: `${process.env.FRONTEND_URL}/failure`,
                pending: `${process.env.FRONTEND_URL}/pending`
            },
            notification_url: `${process.env.BACKEND_URL}/api/turnos/mercadopago/webhook`,
            auto_return: "approved"
        };

        // ✅ Nuevo método para crear la orden en Mercado Pago
        const preferenceClient = new mercadopago.Preference(mp);
        const response = await preferenceClient.create({ body: preference });

        res.json({ id: response.id, init_point: response.init_point }); // Enviamos la URL de pago al frontend
    } catch (error) {
        console.error("Error creando la orden en Mercado Pago:", error);
        res.status(500).json({ message: "Error interno en Mercado Pago" });
    }
};


exports.capturarPagoMercadoPago = async (req, res) => {
    try {
        const { payment_id, id_profesional, id_usuario, fecha_turno, hora_turno, precio } = req.body;

        if (!payment_id) {
            return res.status(400).json({ message: "Falta el ID del pago" });
        }

        // ✅ Obtener el estado del pago con el nuevo SDK
        const paymentClient = new mercadopago.Payment(mp);
        const response = await paymentClient.get({ id: payment_id });

        if (response.status === "approved") {
            // Guardar turno en la base de datos
            const id_turno = await Turno.crearTurno(id_profesional, id_usuario, fecha_turno, hora_turno);

            // Guardar pago en la base de datos
            await Pago.registrarPago(id_turno, precio, "MercadoPago", "Pagado", payment_id);

            return res.status(201).json({ message: "Pago exitoso y turno reservado", id_turno });
        }

        res.status(400).json({ message: "Pago no aprobado" });
    } catch (error) {
        console.error("Error al capturar el pago de Mercado Pago:", error);
        res.status(500).json({ message: "Error interno en Mercado Pago" });
    }
};


exports.webhookMercadoPago = async (req, res) => {
    try {
        const payment = req.body;

        console.log("🔔 Webhook recibido de Mercado Pago:", payment);

        if (payment.type === "payment") {
            const paymentClient = new mercadopago.Payment(mp);
            const paymentData = await paymentClient.get({ id: payment.data.id });

            if (paymentData.status === "approved") {
                console.log("✅ Pago aprobado:", paymentData.id);
                // Aquí podrías actualizar el estado en la base de datos si es necesario
            }
        }

        res.sendStatus(200); // Enviar respuesta a Mercado Pago
    } catch (error) {
        console.error("Error procesando el webhook de Mercado Pago:", error);
        res.sendStatus(500);
    }
};




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
