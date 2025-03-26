import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const url = import.meta.env.VITE_API_BASE_URL;

interface Suscripcion {
    estado: string;
    monto: number;
    proxima_factura: string;
}

interface SuscripcionInfoProps {
    email: string; // ✅ Ahora recibe el email
}

const SuscripcionInfo: React.FC<SuscripcionInfoProps> = ({ email }) => {
    const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);

    const fetchSuscripcion = useCallback(async () => {
        try {
            const response = await axios.get<Suscripcion>(`${url}/api/suscripcion/${email}`);
            setSuscripcion(response.data);
        } catch (error) {
            console.error("Error al obtener datos de suscripción:", error);
            setError("No se pudo cargar la información de suscripción.");
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        fetchSuscripcion();
    }, [fetchSuscripcion]);

    if (loading) return <p className="text-center">Cargando suscripción...</p>;

    return (
        <div className="subscription-container p-3 shadow-sm rounded-3 d-flex justify-content-between align-items-center">
            {suscripcion?.estado === "active" ? (
                <div>
                    <strong>Estado:</strong> ✅ Activa &nbsp;&nbsp;
                    <strong>Monto:</strong> ${suscripcion?.monto} ARS &nbsp;&nbsp;
                    <strong>Próxima Factura:</strong> {suscripcion?.proxima_factura}
                </div>
            ) : (
                <div className="d-flex flex-column align-items-center w-100">
                    <p className="text-danger text-center">⚠️ No tienes una suscripción activa</p>
                    <a
                        href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808495b859210195ce76babf0bf7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        Suscribirme
                    </a>
                </div>
            )}
        </div>
    );
};

export default SuscripcionInfo;
