import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner'; // Asegurate que el path sea correcto
const url = import.meta.env.VITE_API_BASE_URL;
const id = import.meta.env.VITE_MP_SUSCRIPTION_ID;
interface SuscripcionInfoProps {
    email: string;
}

const SuscripcionInfo: React.FC<SuscripcionInfoProps> = ({ email }) => {
    const [estado, setEstado] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [monto, setMonto] = useState<number | null>(null);
    const [proximaFactura, setProximaFactura] = useState<string | null>(null);
    const [fechaInicio, setFechaInicio] = useState<string | null>(null);
    const [metodoPago, setMetodoPago] = useState<string | null>(null);

    useEffect(() => {
        const fetchEstado = async () => {
            try {
                const res = await axios.get(`${url}/api/suscripcion/${email}`);
                setEstado(res.data.estado);
                setMonto(res.data.monto);
                setProximaFactura(res.data.proxima_factura);
                setFechaInicio(res.data.fecha_inicio);
                setMetodoPago(res.data.metodo_pago);
            } catch (error) {
                setEstado('no_encontrado');
            } finally {
                setLoading(false);
            }
        };

        fetchEstado();
    }, [email]);

    return (
        <div className="container" style={{ marginTop: '-30px' }}>
            <h1 style={{ fontSize: '20px' }} className="mb-3">Suscripción</h1>

            <div
                className="d-flex flex-wrap align-items-center justify-content-center shadow-sm p-3 rounded-3"
                style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '23px',
                    gap: '20px'
                }}
            >
                {loading ? (
                    <LoadingSpinner />
                ) : estado === 'authorized' ? (
                    <>
                        <p className="mb-0"><strong>Inicio:</strong> {fechaInicio}</p>
                        <p className="mb-0"><strong>Renovación:</strong> {proximaFactura}</p>
                        <p className="mb-0"><strong>Medio de pago:</strong> {metodoPago}</p>
                        <p className="mb-0"><strong>Monto:</strong> ${monto}</p>
                    </>
                ) : (
                    <a
                        href={`https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        Suscribirme
                    </a>
                )}
            </div>
        </div>
    );
};

export default SuscripcionInfo;
