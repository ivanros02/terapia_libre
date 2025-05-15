import { Card, Form, Row, Col, Container, Modal, Button } from "react-bootstrap";
import "../styles/FormProfessionalsComponent.css"; // Ajusta la ruta según corresponda
import EspecialidadSelect from "./EspecialidadSelect";
import axios from "axios";
import React, { useState, useEffect } from "react";
const url = import.meta.env.VITE_API_BASE_URL;
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TermsAndConditions from "./TermsAndConditions";

const FormProfessionalsComponent = () => {

    const [termsChecked, setTermsChecked] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [descripcionAviso, setDescripcionAviso] = useState("");
    const MAX_CARACTERES = 430; // por ejemplo


    const [formData, setFormData] = useState(() => {
        const savedForm = localStorage.getItem("formProfesional");
        return savedForm
            ? JSON.parse(savedForm)
            : {
                nombre: "",
                telefono: "",
                correo_electronico: "",
                contrasena: "",
                titulo_universitario: "",
                matricula_nacional: "",
                matricula_provincial: "",
                descripcion: "",
                disponibilidad: "",
                valor: "",
                valor_internacional: "",
                especialidades: [] as number[],
                foto_perfil_url: "",
            };
    });

    useEffect(() => {
        localStorage.setItem("formProfesional", JSON.stringify(formData));
    }, [formData]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (e.target.type === "file") {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setFormData({ ...formData, foto_perfil_url: file.name }); // Guardamos solo el nombre del archivo
            }
        } else {
            const { name, value } = e.target;

            if (name === "descripcion") {
                const cantidad = value.length;

                if (cantidad > MAX_CARACTERES) {
                    setDescripcionAviso(`⚠️ Has alcanzado el límite de ${MAX_CARACTERES} caracteres.`);
                    return; // opcional: evitar que escriba más
                } else {
                    setDescripcionAviso("");
                }
            }


            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleEspecialidadChange = (selected: number[]) => {
        setFormData({ ...formData, especialidades: selected });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!termsChecked) {
            toast.warning("Debes aceptar los Términos y Condiciones para continuar.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!validateForm()) {
            toast.error("Por favor, complete todos los campos obligatorios.", {
                position: "top-center",
                autoClose: 3000,
            });
            return;
        }

        if (!navigator.onLine) {
            toast.error("Estás desconectado de Internet.");
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${url}/api/profesionales`, formData);
            toast.success("Profesional registrado con éxito 🎉");
            localStorage.removeItem("formProfesional");
        } catch (error: any) {
            if (error.message === "Network Error") {
                toast.error("No se pudo conectar al servidor. Verificá tu conexión a Internet.");
            } else {
                toast.error(error.response?.data?.message || "Error inesperado");
            }
        } finally {
            setLoading(false);
        }
    };

    // Función de validación
    const validateForm = () => {
        const requiredFields = [
            "nombre",
            "telefono",
            "correo_electronico",
            "contrasena",
            "titulo_universitario",
            "descripcion",
            "disponibilidad",
            "valor",
            "valor_internacional",
        ];

        for (const field of requiredFields) {
            if (!formData[field as keyof typeof formData].toString().trim()) {
                return false;
            }
        }

        return true;
    };


    return (
        <Container fluid className="form-container">
            <div className="form-card">
                <Card
                    className="mx-auto my-4 p-4"
                    style={{
                        maxWidth: "800px",
                        backgroundColor: "rgba(255, 255, 255, 0.61)", // Fondo blanco con transparencia
                        borderRadius: "10px",
                    }}
                >
                    <Card.Body>
                        <Card.Title className="text-center mb-4 form-title">
                            Registro de profesionales
                        </Card.Title>
                        <Form onSubmit={handleSubmit}>
                            {/* Sección: Foto de perfil */}
                            <Form.Group controlId="formProfilePicture" className="mb-3">
                                <h5>Foto de perfil</h5>
                                <Form.Control
                                    type="text"
                                    name="foto_perfil_url"
                                    placeholder="Ingrese la URL de su foto de perfil"
                                    value={formData.foto_perfil_url}
                                    onChange={handleChange}
                                />
                            </Form.Group>



                            <hr />

                            {/* Sección: Datos personales */}
                            <h5>Datos personales</h5>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="formName" className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            placeholder="Ingrese su nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="formPhone" className="mb-3">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telefono"
                                            placeholder="Ingrese su teléfono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            {/* Sección: Creación de cuenta */}
                            <h5>Creación de cuenta</h5>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label>Correo</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="correo_electronico"
                                            placeholder="Ingrese su correo"
                                            value={formData.correo_electronico}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="formPassword" className="mb-3">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="contrasena"
                                            placeholder="Ingrese su contraseña"
                                            value={formData.contrasena}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            {/* Sección: Datos profesionales */}
                            <h5>Datos profesionales</h5>
                            <Row>
                                <Col xs={12} md={4}>
                                    <Form.Group controlId="formTitulo" className="mb-3">
                                        <Form.Label>Título</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="titulo_universitario"
                                            placeholder="Ingrese su título"
                                            value={formData.titulo_universitario}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Form.Group controlId="formMatriculaProvincial" className="mb-3">
                                        <Form.Label>Matrícula Provincial</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="matricula_provincial"
                                            placeholder="Ingrese su matrícula provincial"
                                            value={formData.matricula_provincial}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Form.Group controlId="formMatriculaNacional" className="mb-3">
                                        <Form.Label>Matrícula Nacional</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="matricula_nacional"
                                            placeholder="Ingrese su matrícula nacional"
                                            value={formData.matricula_nacional}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            {/* Sección: Especialidades */}
                            <h5>Especialidades</h5>
                            <EspecialidadSelect onChange={handleEspecialidadChange} />

                            {/* Sección: Descripción */}
                            <h5>Descripción del Profesional</h5>
                            <Form.Group controlId="formDescripcion" className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Ejemplo: Médico con 10 años de experiencia en cardiología..."
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            {formData.descripcion && (
                                <div className="d-flex justify-content-between">
                                    <small className="text-muted">
                                        {formData.descripcion.length} / {MAX_CARACTERES} caracteres
                                    </small>
                                    {descripcionAviso && <small className="text-danger">{descripcionAviso}</small>}
                                </div>
                            )}




                            <hr />

                            {/* Sección: Disponibilidad y Valores */}
                            <h5>Disponibilidad y Valores</h5>
                            <Row>
                                <Col xs={12} md={4}>
                                    <Form.Group controlId="formDisponibilidad" className="mb-3">
                                        <Form.Label>Disponibilidad</Form.Label>
                                        <Form.Select name="disponibilidad" value={formData.disponibilidad} onChange={handleChange}>
                                            <option value="">Seleccione disponibilidad</option>
                                            <option value="24 horas">24 horas</option>
                                            <option value="48 horas">48 horas</option>
                                            <option value="72 horas">72 horas</option>
                                            <option value="96 horas">96 horas</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={4}>
                                    <Form.Group controlId="formValorNacional" className="mb-3">
                                        <Form.Label>Valor Nacional</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="valor"
                                            placeholder="Ingrese valor nacional"
                                            value={formData.valor}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === '-' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Form.Group controlId="formValorInternacional" className="mb-3">
                                        <Form.Label>Valor Internacional</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="valor_internacional"
                                            placeholder="Ingrese valor internacional"
                                            value={formData.valor_internacional}
                                            onChange={handleChange}
                                            onKeyDown={(e) => {
                                                if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === '-' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Checkbox: Aceptar términos y condiciones */}
                            <Form.Group controlId="formTerms" className="mb-3 d-flex justify-content-center mt-3">
                                <Form.Check
                                    type="checkbox"
                                    label={
                                        <div className="text-center">
                                            He leído y acepto los{" "}
                                            <span
                                                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                                                onClick={() => setShowTermsModal(true)}
                                            >
                                                Términos y Condiciones
                                            </span>
                                        </div>
                                    }
                                    checked={termsChecked}
                                    disabled={!termsAccepted}
                                    onChange={(e) => setTermsChecked(e.target.checked)}
                                />
                            </Form.Group>

                            {/* Botón Enviar */}
                            <div className="d-flex justify-content-center mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="boton-enviar"
                                >
                                    {loading ? (
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Enviando...
                                        </div>
                                    ) : (
                                        "Enviar"
                                    )}
                                </button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>


            {/* Modal de Términos y Condiciones */}
            <Modal show={showTermsModal} onHide={() => setShowTermsModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Términos y Condiciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TermsAndConditions /> {/* 🔹 Aquí se renderiza el contenido modularizado */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
                        Cerrar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setTermsAccepted(true);
                            setTermsChecked(true); // 🔹 Marcar automáticamente el checkbox
                            setShowTermsModal(false);
                        }}
                        style={{ backgroundColor: "var(--verde)", borderColor: "var(--verde)" }}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default FormProfessionalsComponent;
