import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
const url = import.meta.env.VITE_API_BASE_URL;

interface Ausencia {
    id_ausencia: number;
    id_profesional: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    motivo?: string;
    creado_en?: string;
}

interface AusenciaListProps {
    onEdit: (ausencia: Ausencia) => void;
    onAdd: () => void;
    fetchAusencias: () => void;
}

function AusenciaList({ onEdit, onAdd }: AusenciaListProps) {
    const [ausencias, setAusencias] = useState<Ausencia[]>([]);
    const [loading, setLoading] = useState(true);
    const idProfesional = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    const fetchAusencias = async () => {
        if (!idProfesional) {
            toast.error("❌ No se encontró el ID del profesional");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${url}/ausencias/profesional/${idProfesional}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setAusencias(response.data.data || []);
        } catch (error) {
            console.error("Error al obtener ausencias:", error);
            toast.error("❌ Error al cargar las ausencias");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAusencias();
    }, [idProfesional]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Está seguro de eliminar esta ausencia?")) {
            return;
        }

        try {
            await axios.delete(`${url}/ausencias/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            toast.success("✅ Ausencia eliminada correctamente");
            fetchAusencias();
        } catch (error) {
            console.error("Error al eliminar ausencia:", error);
            toast.error("❌ Error al eliminar la ausencia");
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDayName = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { weekday: 'long' });
    };

    const isPastDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    if (loading) {
        return (
            <Card>
                <Card.Body className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div className="container mt-5 mb-5">
            {/* Contenedor flexible para el título y botón */}
            <div className="row align-items-center mb-3">
                <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start">
                    <h2 className="text-center text-md-start m-0 titulo-config">Ausencias</h2>
                </div>
                <div className="col-12 col-md-6 text-center text-md-end mt-2 mt-md-0">
                    <Button
                        variant="success"
                        onClick={onAdd}
                        className="btn-agregar"
                    >
                        Agregar
                    </Button>
                </div>
            </div>

            {/* Lista de ausencias */}
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </Spinner>
                </div>
            ) : ausencias.length === 0 ? (
                <Alert variant="info">
                    No hay ausencias registradas. 
                    <Button 
                        variant="link" 
                        onClick={onAdd}
                        className="p-0 ms-2"
                    >
                        Registrar la primera ausencia
                    </Button>
                </Alert>
            ) : (
                <ul className="list-group">
                    {ausencias.map((ausencia) => (
                        <li
                            key={ausencia.id_ausencia}
                            className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center"
                        >
                            <div className="text-disponibilidad mb-2 mb-md-0">
                                <span className="fw-bold">{formatDate(ausencia.fecha)}</span>
                                <span className="text-muted ms-2">({getDayName(ausencia.fecha)})</span>
                                <span className="ms-2">{ausencia.hora_inicio} - {ausencia.hora_fin}</span>
                                {ausencia.motivo && (
                                    <span className="text-muted ms-2">- {ausencia.motivo}</span>
                                )}
                                {isPastDate(ausencia.fecha) ? (
                                    <span className="badge bg-secondary ms-2">Pasada</span>
                                ) : (
                                    <span className="badge bg-warning ms-2">Próxima</span>
                                )}
                            </div>

                            <div>
                                <Button
                                    className="btn-editar me-2"
                                    size="sm"
                                    onClick={() => onEdit(ausencia)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    className="btn-eliminar"
                                    size="sm"
                                    onClick={() => handleDelete(ausencia.id_ausencia)}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AusenciaList;