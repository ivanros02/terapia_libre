const axios = require("axios");
const MERCADO_PAGO_URL = "https://api.mercadopago.com/preapproval";
const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

// 🔹 Obtener el estado y monto de la suscripción por correo electrónico
exports.obtenerSuscripcion = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Se requiere el correo electrónico." });
        }

        // 🔹 Consultar directamente a Mercado Pago usando el email del usuario
        const response = await axios.get(`${MERCADO_PAGO_URL}?email=${email}`, {
            headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
        });

        // 📌 Si no hay suscripciones activas
        if (!response.data.results || response.data.results.length === 0) {
            return res.status(200).json({ estado: "inexistente", monto: 0, proxima_factura: "N/A" });
        }

        // 📌 Tomamos la primera suscripción activa encontrada
        const suscripcion = response.data.results[0];

        res.json({
            estado: suscripcion.status || "inactive", // Estado de la suscripción (active, cancelled, paused, etc.)
            monto: suscripcion.auto_recurring.transaction_amount || 0,
            proxima_factura: suscripcion.auto_recurring.next_payment_date?.split("T")[0] || "N/A"
        });

    } catch (error) {
        console.error("Error al obtener suscripción en Mercado Pago:", error.response?.data || error.message);
        res.status(500).json({ message: "Error al obtener la suscripción." });
    }
};
