import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import "../styles/LoginComponent.css";
import GoogleLoginButton from "./GoogleLoginButton";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<{ correo_electronico: string; contrasena: string }>({
        correo_electronico: "",
        contrasena: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", formData);

            // Guardar el token, esProfesional y el ID en el localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("esProfesional", response.data.esProfesional);
            localStorage.setItem("id", response.data.id); // 🔹 Asegúrate de que el backend devuelva el ID

            // Redirigir dinámicamente
            const dashboardRoute = response.data.esProfesional ? "/dashboard/profesional" : "/dashboard/usuario";
            navigate(dashboardRoute);
        } catch (error: any) {
            alert(error.response?.data?.message || "Error en el inicio de sesión");
        }
    };

    return (
        <Container fluid className="login-container mt-5">
            <Row className="shadow-lg overflow-hidden p-3 align-items-center bg-white rounded" style={{ maxWidth: "900px", width: "100%" }}>
                {/* Sección Izquierda */}
                <Col md={5} className="d-none d-md-flex align-items-center justify-content-center rounded-personalizado h-100" style={{ background: "var(--verde)" }}>
                    <Card className="border-0 bg-transparent text-center">
                        <Card.Body className="d-flex flex-column align-items-center">
                            <img src="/footer_image.png" alt="Hola" className="img-fluid mb-3" style={{ maxWidth: "150px" }} />
                            <h3 className="fw-bold">Hola! 👋</h3>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Sección Derecha */}
                <Col md={6} className="p-5 h-100 d-flex flex-column justify-content-center">
                    <h2 className="fw-bold">Iniciar sesión</h2>
                    <p>Si no tenés una cuenta, ¡creá la tuya <a href="/register">acá!</a></p>

                    {/* Formulario */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="correo_electronico" placeholder="Ingresá tu correo de email" onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" name="contrasena" placeholder="Ingresá tu contraseña" onChange={handleChange} required />
                        </Form.Group>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <Form.Check type="checkbox" label="Recordarme" />
                            <a href="#" className="text-muted">¿Olvidaste tu contraseña?</a>
                        </div>

                        <div className="d-flex justify-content-center">
                            {/* Botón Enviar */}
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: "var(--verde)",
                                    color: "white",
                                    borderRadius: "30px",
                                    padding: "10px 30px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Enviar
                            </button>

                        </div>
                    </Form>

                    <div className="text-center mt-4">
                        <p>o continuá con</p>
                        <div>
                            <GoogleLoginButton />
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
