import { FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="py-4 border-top border-secondary" style={{ backgroundColor: "var(--verde-oscuro)" }}>
            <div className="container">
                <div className="row">
                    {/* Sección Izquierda */}
                    <div className="col-md-8 text-start">
                        <div className="d-flex flex-column align-items-start">
                            {/* Logo y título alineados en la misma fila */}
                            <div className="d-flex align-items-center">
                                <img
                                    src="/logo.png"
                                    alt="Logo Terapia Libre"
                                    className="me-2"
                                    style={{ width: "70px", height: "70px" }}
                                />
                                <h5 className="text-light mb-0" style={{ marginLeft: "10px" }}>
                                    Terapia Libre
                                </h5>
                            </div>

                            {/* Descripción debajo */}
                            <p className="text-light mt-2" style={{ maxWidth: "70%", lineHeight: "1.6", fontSize: "16px" }}>
                                Es una plataforma innovadora que te ofrece la libertad
                                de elegir al profesional de salud mental ideal para vos.
                                Con una amplia variedad de expertos, facilitamos la
                                búsqueda y selección de tu terapeuta, priorizando tu
                                bienestar emocional con tratamientos personalizados.
                            </p>

                            {/* Redes Sociales */}
                            <div className="d-flex align-items-center">
                                <a
                                    href="https://www.instagram.com/terapia.libre"
                                    className="text-light me-3"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaInstagram size={20} className="me-1" /> @terapia.libre
                                </a>
                            </div>
                            <div className="d-flex align-items-center mt-2">
                                <a
                                    href="https://www.linkedin.com/company/terapia-libre"
                                    className="text-light"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FaLinkedin size={20} className="me-1" /> Terapia Libre
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Sección Derecha */}
                    <div className="col-md-4 text-md-end mt-4 mt-md-0">
                        {/* Imagen Arriba de los Links */}
                        <img
                            src="/footer_image.png"
                            alt="Imagen decorativa"
                            className="mb-3 img-fluid"
                            style={{ width: "150px", height: "auto" }}
                        />
                        {/* Enlaces en columna */}
                        <div className="d-flex flex-column">
                            <a href="/formProfessionals" className="text-light fw-semibold mb-2">
                                Panel para profesionales
                            </a>
                            <a href="/admin" className="text-light fw-semibold">
                                Acceder como administrador
                            </a>
                        </div>
                    </div>

                    {/* Línea Divisoria */}
                    <hr className="border-light my-4" />

                    {/* Sección Derechos Reservados */}
                    <div className="text-center text-light mt-3" style={{ fontSize: "14px" }}>
                        © {new Date().getFullYear()} Terapia Libre. Todos los derechos reservados.
                        <a href="/terminos-y-condiciones" className="text-light fw-semibold mx-2">Términos y condiciones</a> |
                        <a href="/privacidad" className="text-light fw-semibold mx-2">Políticas de privacidad</a>
                    </div>
                </div>
            </div>
        </footer>

    );
};

export default Footer;
