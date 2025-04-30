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

        // 🔹 Consultar TODAS las suscripciones
        const response = await axios.get("https://api.mercadopago.com/preapproval/search?limit=100", {
            headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
        });

        console.log("🔹 TODAS LAS SUSCRIPCIONES RECIBIDAS:");
        console.log(JSON.stringify(response.data.results, null, 2));

        const suscripciones = response.data.results;

        // 🔹 FILTRAR solo las suscripciones activas
        const suscripcion = suscripciones.find(sub =>
            (sub.status === "authorized" || sub.status === "active") &&
            sub.payer_first_name.toLowerCase().includes("monica") // 🔹 Filtra por nombre ya que el email no aparece
        );

        if (!suscripcion) {
            console.log(`⚠️ No se encontró una suscripción activa para: ${email}`);
            return res.status(200).json({ estado: "inexistente", monto: 0, proxima_factura: "N/A" });
        }

        console.log(`✅ Suscripción activa encontrada:`, suscripcion);

        res.json({
            estado: suscripcion.status || "inactive",
            monto: suscripcion.auto_recurring?.transaction_amount || 0,
            proxima_factura: suscripcion.next_payment_date?.split("T")[0] || "N/A"
        });

    } catch (error) {
        console.error("❌ Error al obtener suscripción:", error.response?.data || error.message);
        res.status(400).json({ message: "No se pudo obtener la suscripción. Intentá nuevamente." });
    }
};