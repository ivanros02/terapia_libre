import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import "../../../styles/DisponibilidadList.css"
const url = import.meta.env.VITE_API_BASE_URL;
import { toast } from "react-toastify";

interface Disponibilidad {
    id_disponibilidad: number;
    id_profesional: number;
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    creado_en: string;
}

interface DisponibilidadListProps {
    onEdit: (disponibilidad: Disponibilidad) => void;
    onAdd: () => void;
    fetchDisponibilidades: () => void;
}

function DisponibilidadList({ onEdit, onAdd, fetchDisponibilidades }: DisponibilidadListProps) {
    const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([]);
    const idProfesional = localStorage.getItem("id");

    const obtenerDisponibilidades = async () => {
        try {
            const response = await axios.get<Disponibilidad[]>(`${url}/disponibilidad?id_profesional=${idProfesional}`);
            setDisponibilidades(response.data);
        } catch (error) {
            console.error("Error al obtener disponibilidades", error);
        }
    };

    useEffect(() => {
        if (idProfesional) {
            obtenerDisponibilidades();
        }
    }, [idProfesional, fetchDisponibilidades]);

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${url}/disponibilidad`, {
                data: { id_disponibilidad: id, id_profesional: idProfesional }
            });

            toast.success("✅ Disponibilidad eliminada correctamente");

            await obtenerDisponibilidades();
        } catch (error) {
            console.error("Error al eliminar disponibilidad", error);
            toast.error("❌ Error al eliminar la disponibilidad");
        }
    };


    return (
        <div className="container">
            {/* Contenedor flexible para el título y botón */}
            <div className="row align-items-center mb-3">
                <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start">
                    <h2 className="text-center text-md-start m-0 titulo-config">Disponibilidades</h2>
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

            {/* Lista de disponibilidades */}
            <ul className="list-group">
                {disponibilidades.map((disp) => (
                    <li
                        key={disp.id_disponibilidad}
                        className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-center"
                    >
                        <span className="text-disponibilidad mb-2 mb-md-0">
                            {disp.dia_semana}: {disp.hora_inicio} - {disp.hora_fin}
                        </span>

                        <div>
                            <Button
                                className="btn-editar me-2"
                                size="sm"
                                onClick={() => onEdit(disp)}
                            >
                                Editar
                            </Button>
                            <Button
                                className="btn-eliminar"
                                size="sm"
                                onClick={() => handleDelete(disp.id_disponibilidad)}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    );
}

export default DisponibilidadList;