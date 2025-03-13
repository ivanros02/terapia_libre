import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const url = import.meta.env.VITE_API_BASE_URL;

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
            await obtenerDisponibilidades();
        } catch (error) {
            console.error("Error al eliminar disponibilidad", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Disponibilidades</h2>
                <Button variant="success" onClick={onAdd}>Agregar Disponibilidad</Button>
            </div>
            <ul className="list-group">
                {disponibilidades.map((disp) => (
                    <li key={disp.id_disponibilidad} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{disp.dia_semana}: {disp.hora_inicio} - {disp.hora_fin}</span>
                        <div>
                            <Button variant="primary" size="sm" className="me-2" onClick={() => onEdit(disp)}>Editar</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(disp.id_disponibilidad)}>Eliminar</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DisponibilidadList;