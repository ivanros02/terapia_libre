const axios = require("axios");
const MERCADO_PAGO_URL = "https://api.mercadopago.com/preapproval/search";
const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const PLAN_ID = process.env.MP_SUSCRIPTION_ID;

exports.obtenerSuscripcion = async (req, res) => {
    try {
        const { email } = req.params;
        
        console.log("🔹 Buscando suscripción activa para:", email);
        
        // Buscar directamente por email
        const responseEmail = await axios.get(`${MERCADO_PAGO_URL}?payer_email=${email}`, {
            headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` }
        });

        console.log("📋 Suscripciones por email:", responseEmail.data.results.length);

        // Filtrar por plan específico y estado activo
        const suscripcion = responseEmail.data.results.find(sub => 
            sub.preapproval_plan_id === PLAN_ID &&
            (sub.status === "authorized" || sub.status === "active")
        );

        if (!suscripcion) {
            console.log(`⚠️ No se encontró suscripción activa para ${email} en el plan ${PLAN_ID}`);
            return res.status(200).json({ estado: "inexistente", monto: 0, proxima_factura: "N/A" });
        }

        console.log(`✅ Suscripción encontrada:`, {
            id: suscripcion.id,
            status: suscripcion.status,
            plan_id: suscripcion.preapproval_plan_id
        });

        return res.json({
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