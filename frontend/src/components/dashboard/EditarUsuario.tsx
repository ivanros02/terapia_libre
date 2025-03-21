import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";

const url = import.meta.env.VITE_API_BASE_URL;

interface Usuario {
    id_usuario: number;
    correo_electronico: string;
    nombre: string;
    id_google: string | null;
    created_at: string;
}

const EditarUsuario: React.FC<{ userId: number; show: boolean; onHide: () => void }> = ({ userId, show, onHide }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        correo_electronico: "",
    });
    const token = localStorage.getItem("token");

    // 🔹 Cargar datos del usuario
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                if (!token) {
                    throw new Error("No se encontró el token de autenticación.");
                }

                const response = await axios.get(`${url}/api/auth/usuario/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsuario(response.data);
                setFormData({
                    nombre: response.data.nombre || "",
                    correo_electronico: response.data.correo_electronico || "",
                });
            } catch (error) {
                console.error("Error al obtener usuario:", error);
            } finally {
                setLoading(false);
            }
        };

        if (show) fetchUsuario();
    }, [userId, show]);

    // 🔹 Manejar cambios en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔹 Guardar cambios
    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.put(`${url}/api/auth/usuario/${userId}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Datos actualizados correctamente.");
            onHide();
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
        } finally {
            setSaving(false);
        }
    };


    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Perfil</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : usuario ? (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="correo_electronico"
                                value={formData.correo_electronico}
                                readOnly // 🔹 Ahora usa `readOnly` en lugar de `disabled`
                                placeholder="correo@ejemplo.com"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>ID de Google</Form.Label>
                            <Form.Control
                                type="text"
                                value={usuario.id_google || "No registrado con Google"}
                                readOnly
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Creación</Form.Label>
                            <Form.Control
                                type="text"
                                value={
                                    usuario.created_at
                                        ? new Date(usuario.created_at.replace(" ", "T")).toLocaleDateString("es-ES", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "Fecha no disponible"
                                } // ✅ Convierte correctamente la fecha
                                readOnly
                            />
                        </Form.Group>


                        <Button variant="primary" className="w-100" onClick={handleSave} disabled={saving}>
                            {saving ? <Spinner size="sm" animation="border" /> : "Guardar Cambios"}
                        </Button>
                    </Form>
                ) : (
                    <p className="text-danger text-center">No se encontró el usuario</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EditarUsuario;
