import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

interface Profesional {
    id_profesional: number;
    nombre: string;
    titulo_universitario: string;
    matricula_nacional: string;
    matricula_provincial?: string | null;
    descripcion?: string | null;
    telefono?: string | null;
    disponibilidad: "24 horas" | "48 horas" | "72 horas" | "96 horas";
    correo_electronico: string;
    foto_perfil_url?: string | null;
    valor: number;
    valor_internacional: number;
    creado_en: string;
}

const url = import.meta.env.VITE_API_BASE_URL;

interface ProfesionalFormProps {
    show: boolean;
    handleClose: () => void;
    profesional: Profesional;
    onSave: () => void;
    fetchProfesionalData: () => void;  // 🔹 Agregamos esta función
}


function ProfesionalForm({ show, handleClose, profesional, onSave, fetchProfesionalData }: ProfesionalFormProps) {

    // 🔹 Inicialización segura del estado
    const [formData, setFormData] = useState<Profesional>({
        id_profesional: 0,
        nombre: "",
        titulo_universitario: "",
        matricula_nacional: "",
        matricula_provincial: "",
        descripcion: "",
        telefono: "",
        disponibilidad: "24 horas",
        correo_electronico: "",
        foto_perfil_url: "",
        valor: 0.0,
        valor_internacional: 0.0,
        creado_en: ""
    });

    // 🔹 Actualiza `formData` cuando cambia `profesional`
    useEffect(() => {
        if (profesional) {
            setFormData({
                ...profesional,
                descripcion: profesional.descripcion ?? "",
                telefono: profesional.telefono ?? "",
                matricula_provincial: profesional.matricula_provincial ?? "",
                foto_perfil_url: profesional.foto_perfil_url ?? ""
            });
        }
    }, [profesional]);

    // 🔹 Manejo seguro de los cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value || ""
        }));
    };

    // 🔹 Guardar cambios en la API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`${url}/api/profesionales/${profesional.id_profesional}`, formData);
            onSave();
            fetchProfesionalData(); // 🔹 Ahora sí se refresca la vista
            handleClose();
        } catch (error) {
            console.error("Error al actualizar datos del profesional", error);
        }
    };



    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Datos del Profesional</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Título Universitario</Form.Label>
                        <Form.Control type="text" name="titulo_universitario" value={formData.titulo_universitario} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Matrícula Nacional</Form.Label>
                        <Form.Control type="text" name="matricula_nacional" value={formData.matricula_nacional} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control as="textarea" name="descripcion" value={formData.descripcion ?? ""} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control type="text" name="telefono" value={formData.telefono ?? ""} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Disponibilidad</Form.Label>
                        <Form.Select name="disponibilidad" value={formData.disponibilidad} onChange={handleChange}>
                            <option value="24 horas">24 horas</option>
                            <option value="48 horas">48 horas</option>
                            <option value="72 horas">72 horas</option>
                            <option value="96 horas">96 horas</option>
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit" variant="success">Guardar</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ProfesionalForm;
