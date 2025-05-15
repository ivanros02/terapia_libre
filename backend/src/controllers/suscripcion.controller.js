const axios = require("axios");
const MERCADO_PAGO_URL = "https://api.mercadopago.com/preapproval/search";
const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

exports.obtenerSuscripcion = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Se requiere el correo electrónico." });
        }

        console.log("🔹 Buscando suscripción activa para:", email);

        const response = await axios.get(`${MERCADO_PAGO_URL}?payer_email=${email}`, {
            headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
        });

        const suscripciones = response.data.results;

        // 🔹 Buscar una suscripción activa
        const suscripcion = suscripciones.find(sub =>
            sub.status === "authorized" || sub.status === "active"
        );

        if (!suscripcion) {
            console.log(`⚠️ No se encontró una suscripción activa para: ${email}`);
            return res.status(200).json({ estado: "inexistente", monto: 0, proxima_factura: "N/A" });
        }

        console.log(`✅ Suscripción activa encontrada:`, suscripcion.id);

        res.json({
            estado: suscripcion.status,
            monto: suscripcion.auto_recurring?.transaction_amount || 0,
            proxima_factura: suscripcion.next_payment_date?.split("T")[0] || "N/A",
            fecha_inicio: suscripcion.date_created?.split("T")[0] || "N/A",
            metodo_pago: suscripcion.payment_method_id || "Desconocido"
        });


    } catch (error) {
        console.error("❌ Error al obtener suscripción:", error.response?.data || error.message);
        res.status(400).json({ message: "No se pudo obtener la suscripción. Intentá nuevamente." });
    }
};