import React from "react";
import Head from "../layouts/Header";
import Footer from "../layouts/Footer";
import { Container, Row, Col } from "react-bootstrap";
import '../styles/RegisterSuccess.css';

const RegisterProfExitoso: React.FC = () => {
    return (
        <>
            <Head />

            <Container fluid className="register-success-container d-flex align-items-center justify-content-center">
                <Row className="w-100 justify-content-center">
                    <Col xs={11} sm={10} md={8} lg={6} xl={5} className="register-success-content">
                        {/* Título principal */}
                        <div className="register-success-title">
                            ¡Registro exitoso!
                        </div>

                        {/* Subtítulo */}
                        <div className="register-success-subtitle">
                            YA SOS PARTE DE TERAPIA LIBRE
                        </div>

                        {/* Mensaje principal */}
                        <div className="register-success-message">
                            <span className="register-success-message-line register-success-message-normal">
                                Chequeá tu casilla de mail para conocer los pasos a seguir
                            </span>
                            <span className="register-success-message-line register-success-message-bold">
                                ¡Gracias por sumarte!
                            </span>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Footer />
        </>
    );
};

export default RegisterProfExitoso;