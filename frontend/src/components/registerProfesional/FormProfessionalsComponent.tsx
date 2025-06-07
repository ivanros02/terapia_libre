import { Card, Form, Row, Col, Container, Modal, Button } from "react-bootstrap";
import "../../styles/FormProfessionalsComponent.css"; // Ajusta la ruta según corresponda
import EspecialidadSelect from "../EspecialidadSelect";
import axios from "axios";
import React, { useState, useEffect } from "react";
const url = import.meta.env.VITE_API_BASE_URL;
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TermsAndConditions from "../TermsAndConditions";
import { useNavigate } from "react-router-dom";
import SubscriptionInfo from "./SubscriptionInfo";

const FormProfessionalsComponent = () => {

    const [termsChecked, setTermsChecked] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [descripcionAviso, setDescripcionAviso] = useState("");
    const MAX_CARACTERES = 315;
    const navigate = useNavigate();



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
                cuit: "",
                descripcion: "",
                valor: "",
                valor_internacional: "",
                especialidades: [] as number[],
                foto_perfil_url: "",
                cbu: "",
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

            // 🔹 Abrir MercadoPago en nueva pestaña después del registro exitoso
            const mercadoPagoUrl = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084955cc4800195a48f3aa61f98";
            window.open(mercadoPagoUrl, "_blank");

            // 🔹 Redirigir a /login después de un pequeño delay
            setTimeout(() => {
                navigate("/successfulProfessionalRegister");
            }, 2000); // Aumenté a 2 segundos para que el usuario vea el toast

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
            "cuit",
            "descripcion",
            "valor",
            "valor_internacional",
            "cbu",
        ];

        for (const field of requiredFields) {
            const fieldValue = formData[field as keyof typeof formData];

            // Verificar si el campo existe y no está vacío (sin .toString() directo)
            if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === "") ||
                (typeof fieldValue === 'number' && fieldValue === 0)) {
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

                            {/* Sección: Datos personales */}
                            <h5>Datos personales</h5>
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="formName" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre y Apellido"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="formPhone" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="telefono"
                                            placeholder="Teléfono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Sección: Creación de cuenta */}
                            <h5>Creación de cuenta</h5>
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Control
                                            type="email"
                                            name="correo_electronico"
                                            placeholder="Correo electrónico"
                                            value={formData.correo_electronico}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="formPassword" className="mb-3">
                                        <Form.Control
                                            type="password"
                                            name="contrasena"
                                            placeholder="Contraseña"
                                            value={formData.contrasena}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Sección: Datos profesionales */}
                            <h5>Datos profesionales</h5>
                            <Row>
                                <Col xs={12}>
                                    <Form.Group controlId="formTitulo" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="titulo_universitario"
                                            placeholder="Titulo"
                                            value={formData.titulo_universitario}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="formMatriculaProvincial" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="matricula_provincial"
                                            placeholder="Matrícula Provincial"
                                            value={formData.matricula_provincial}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="formMatriculaNacional" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="matricula_nacional"
                                            placeholder="Matrícula Nacional"
                                            value={formData.matricula_nacional}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Sección: Especialidades */}
                            <h5>Especialidades</h5>
                            <EspecialidadSelect onChange={handleEspecialidadChange} />

                            {/* Sección: Descripción */}
                            <Form.Group controlId="formDescripcion" className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Descripción personal"
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

                            {/* Valores */}
                            <Row>
                                <Col xs={12} md={8}>
                                    <Form.Group controlId="formValorNacional" className="mb-3">
                                        <Form.Control
                                            type="number"
                                            name="valor"
                                            placeholder="Valor Nacional"
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
                                        <Form.Control
                                            type="number"
                                            name="valor_internacional"
                                            placeholder="Valor Internacional"
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
                            <Row>
                                <Col xs={12} md={8}>
                                    <Form.Group controlId="formCbu" className="mb-3">
                                        <Form.Control
                                            type="number"
                                            name="cbu"
                                            placeholder="CBU/CVU"
                                            value={formData.cbu}
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
                                    <Form.Group controlId="formCuit" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="cuit"
                                            placeholder="CUIT"
                                            value={formData.cuit}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>


                            <SubscriptionInfo /> {/* 🔹 Componente de información de suscripción modularizado */}

                            {/* Checkbox: Aceptar términos y condiciones */}
                            <Form.Group controlId="formTerms" className="mb-3 d-flex justify-content-center mt-3">
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="checkbox"
                                        checked={termsChecked}
                                        disabled={!termsAccepted}
                                        onChange={(e) => setTermsChecked(e.target.checked)}
                                        className="me-2"
                                    />
                                    <span style={{ color: '#242424', fontSize: '0.9rem' }}>
                                        He leído y acepto los{' '}
                                        <span
                                            style={{
                                                color: '#242424',
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                fontSize: '0.9rem'
                                            }}
                                            onClick={() => setShowTermsModal(true)}
                                        >
                                            Términos y Condiciones
                                        </span>
                                    </span>
                                </div>
                            </Form.Group>


                            {/* Botón Enviar */}
                            <div className="d-flex justify-content-center mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="boton-enviar"
                                    style={{
                                        width: '100%',
                                        maxWidth: '297px',
                                        whiteSpace: 'nowrap',
                                        display: 'flex',           // 🔹 Para centrar el contenido
                                        alignItems: 'center',      // 🔹 Centrar verticalmente
                                        justifyContent: 'center'   // 🔹 Centrar horizontalmente
                                    }}
                                >
                                    {loading ? (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Enviando...
                                        </div>
                                    ) : (
                                        "Suscribirme"
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
