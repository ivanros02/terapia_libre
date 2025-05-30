import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const url = import.meta.env.VITE_API_BASE_URL;

interface Disponibilidad {
    id_disponibilidad: number;
    id_profesional: number;
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    creado_en: string;
}

interface DisponibilidadFormProps {
    show: boolean;
    handleClose: () => void;
    disponibilidad?: Disponibilidad;
    onSave: () => void;
    fetchDisponibilidades: () => void;
}

function DisponibilidadForm({ show, handleClose, disponibilidad, onSave, fetchDisponibilidades }: DisponibilidadFormProps) {
    const idProfesional = localStorage.getItem("id");
    const [formData, setFormData] = useState<Disponibilidad>(
        disponibilidad ?? { id_disponibilidad: 0, id_profesional: Number(idProfesional), dia_semana: "Lunes", hora_inicio: "08:00", hora_fin: "17:00", creado_en: "" }
    );

    useEffect(() => {
        setFormData(
            disponibilidad ?? { id_disponibilidad: 0, id_profesional: Number(idProfesional), dia_semana: "Lunes", hora_inicio: "08:00", hora_fin: "17:00", creado_en: "" }
        );
    }, [disponibilidad, idProfesional]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!idProfesional) {
            alert("No se encontró el ID del profesional.");
            return;
        }

        const dataToSend = { ...formData, id_profesional: Number(idProfesional) };

        try {
            if (disponibilidad) {
                await axios.put(`${url}/disponibilidad`, dataToSend);
                toast.success("✅ Disponibilidad actualizada correctamente");
            } else {
                await axios.post(`${url}/disponibilidad`, dataToSend);
                toast.success("✅ Disponibilidad agregada correctamente");
            }

            fetchDisponibilidades();
            onSave();
            handleClose();
        } catch (error) {
            console.error("Error al guardar disponibilidad", error);
            toast.error("❌ Error al guardar disponibilidad");
        }
    };


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton >
                <Modal.Title>{disponibilidad ? "Editar" : "Agregar"} Disponibilidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Día de la semana:</label>
                        <select name="dia_semana" value={formData.dia_semana} onChange={handleChange} className="form-select">
                            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Hora inicio:</label>
                        <input type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChange} className="form-control" />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Hora fin:</label>
                        <input type="time" name="hora_fin" value={formData.hora_fin} onChange={handleChange} className="form-control" />
                    </div>
                    <Button type="submit" style={{ backgroundColor: "var(--naranja)", borderColor: "var(--naranja)", paddingLeft: "20px", paddingRight: "20px", color: "white" }} variant="success">Guardar</Button>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default DisponibilidadForm;