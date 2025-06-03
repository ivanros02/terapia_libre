import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import "../../styles/DashboardUsuarioConfig.css";
import { toast } from "react-toastify";

const url = import.meta.env.VITE_API_BASE_URL;

interface Usuario {
    id_usuario: number;
    correo_electronico: string;
    nombre: string;
    telefono: string | null; // 🔹 Agregado campo teléfono
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
        telefono: "", // 🔹 Agregado teléfono al estado del formulario
    });
    const token = localStorage.getItem("token");
    const [mostrarPasswordForm, setMostrarPasswordForm] = useState(false);
    const [contrasenaActual, setContrasenaActual] = useState("");
    const [nuevaContrasena, setNuevaContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

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
                    telefono: response.data.telefono || "", // 🔹 Cargar teléfono (vacío si es null)
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

        if (mostrarPasswordForm) {
            if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
                toast.error("❌ Completá todos los campos de contraseña");
                setSaving(false);
                return;
            }

            if (nuevaContrasena !== confirmarContrasena) {
                toast.error("❌ Las contraseñas no coinciden");
                setSaving(false);
                return;
            }
        }

        try {
            const dataEnviar = {
                ...formData,
                telefono: formData.telefono || null, // 🔹 Enviar null si está vacío
                contrasena: mostrarPasswordForm ? nuevaContrasena : undefined,
                contrasena_actual: mostrarPasswordForm ? contrasenaActual : undefined,
            };

            await axios.put(`${url}/api/auth/usuario/${userId}`, dataEnviar, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("✅ Datos actualizados correctamente.");
            onHide();
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            toast.error("❌ Error al actualizar los datos. Intenta de nuevo.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title className="titulo-config">Editar Perfil</Modal.Title>
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
                                readOnly
                                placeholder="correo@ejemplo.com"
                            />
                        </Form.Group>

                        {/* 🔹 Nuevo campo para teléfono */}
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Ingresá tu número de teléfono (opcional)"
                            />
                            <Form.Text className="text-muted">
                                Opcional. Ej: +54 9 11 1234-5678
                            </Form.Text>
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
                                }
                                readOnly
                            />
                        </Form.Group>

                        {/* 🔹 Solo mostrar cambio de contraseña si NO es usuario de Google */}
                        {!usuario.id_google && (
                            <Button
                                variant="outline-secondary"
                                className="mb-3"
                                onClick={() => setMostrarPasswordForm(!mostrarPasswordForm)}
                            >
                                {mostrarPasswordForm ? "Cancelar cambio de contraseña" : "¿Cambiar contraseña?"}
                            </Button>
                        )}

                        {/* 🔹 Mostrar mensaje informativo para usuarios de Google */}
                        {usuario.id_google && (
                            <div className="mb-3 p-2 bg-light rounded">
                                <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Cuenta registrada con Google. La contraseña se gestiona desde tu cuenta de Google.
                                </small>
                            </div>
                        )}

                        {mostrarPasswordForm && !usuario.id_google && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña actual</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={contrasenaActual}
                                        onChange={(e) => setContrasenaActual(e.target.value)}
                                        placeholder="Ingresá tu contraseña actual"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nueva Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={nuevaContrasena}
                                        onChange={(e) => setNuevaContrasena(e.target.value)}
                                        placeholder="Nueva contraseña"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirmar Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={confirmarContrasena}
                                        onChange={(e) => setConfirmarContrasena(e.target.value)}
                                        placeholder="Confirmá la nueva contraseña"
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Button variant="primary" className="w-100 btn-edit" onClick={handleSave} disabled={saving}>
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