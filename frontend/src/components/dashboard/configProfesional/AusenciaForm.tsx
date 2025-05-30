import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
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

interface AusenciaFormProps {
    show: boolean;
    handleClose: () => void;
    ausencia?: Ausencia;
    onSave: () => void;
    fetchAusencias: () => void;
}

function AusenciaForm({ show, handleClose, ausencia, onSave, fetchAusencias }: AusenciaFormProps) {
    const idProfesional = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    const [formData, setFormData] = useState<Ausencia>({
        id_ausencia: 0,
        id_profesional: Number(idProfesional),
        fecha: new Date().toISOString().split('T')[0],
        hora_inicio: "08:00",
        hora_fin: "17:00",
        motivo: ""
    });

    useEffect(() => {
        if (ausencia) {
            setFormData({
                ...ausencia,
                fecha: ausencia.fecha.split('T')[0] // Asegurar formato de fecha correcto
            });
        } else {
            setFormData({
                id_ausencia: 0,
                id_profesional: Number(idProfesional),
                fecha: new Date().toISOString().split('T')[0],
                hora_inicio: "08:00",
                hora_fin: "17:00",
                motivo: ""
            });
        }
    }, [ausencia, idProfesional]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        if (!formData.fecha || !formData.hora_inicio || !formData.hora_fin) {
            toast.error("❌ Por favor complete todos los campos obligatorios");
            return false;
        }

        if (formData.hora_inicio >= formData.hora_fin) {
            toast.error("❌ La hora de fin debe ser posterior a la hora de inicio");
            return false;
        }

        // Validar que la fecha no sea anterior a hoy
        const today = new Date().toISOString().split('T')[0];
        if (formData.fecha < today) {
            toast.warning("⚠️ Está registrando una ausencia en fecha pasada");
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!idProfesional) {
            toast.error("❌ No se encontró el ID del profesional");
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (!token) {
            toast.error("❌ No se encontró el token de autenticación");
            return;
        }

        const dataToSend = { ...formData, id_profesional: Number(idProfesional) };

        try {
            if (ausencia) {
                await axios.put(
                    `${url}/ausencias/${ausencia.id_ausencia}`,
                    dataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                toast.success("✅ Ausencia actualizada correctamente");
            } else {
                await axios.post(
                    `${url}/ausencias`,
                    dataToSend,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                toast.success("✅ Ausencia registrada correctamente");
            }

            onSave(); // Cierra el modal
            fetchAusencias(); // Refresca la lista
        } catch (error: any) {
            console.error("Error al guardar ausencia:", error);

            if (error.response?.status === 409) {
                toast.error("❌ Ya existe una ausencia registrada en ese horario");
            } else {
                toast.error("❌ Error al guardar la ausencia");
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{ausencia ? "Editar" : "Registrar"} Ausencia</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">
                            Fecha: <span className="text-danger">*</span>
                        </label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Hora inicio: <span className="text-danger">*</span>
                        </label>
                        <input
                            type="time"
                            name="hora_inicio"
                            value={formData.hora_inicio}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Hora fin: <span className="text-danger">*</span>
                        </label>
                        <input
                            type="time"
                            name="hora_fin"
                            value={formData.hora_fin}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Motivo (opcional):</label>
                        <textarea
                            name="motivo"
                            value={formData.motivo || ""}
                            onChange={handleChange}
                            className="form-control"
                            rows={3}
                            placeholder="Ingrese el motivo de la ausencia..."
                        />
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            style={{
                                backgroundColor: "var(--naranja)",
                                borderColor: "var(--naranja)",
                                color: "white"
                            }}
                            variant="primary"
                        >
                            {ausencia ? "Actualizar" : "Guardar"}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default AusenciaForm;