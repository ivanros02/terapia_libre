import React from "react";

const AboutSection: React.FC = () => {
    return (
        <section className="container py-5">
            <div className="row align-items-center">
                {/* Imagen */}
                <div className="col-lg-5 d-flex justify-content-center">
                    <img
                        src="/quienes_somos.png"
                        alt="Imagen de Quienes Somos"
                        className="img-fluid"
                    />
                </div>

                {/* Texto */}
                <div className="col-lg-7">
                    <h2 className="text-start mb-2" style={{ color: "var(--naranja)" }}>
                        Quiénes Somos
                    </h2>
                    <p className="fs-5 text-dark">
                        En nuestra plataforma web, nos encargamos de{" "}
                        <strong>conectar</strong> a los usuarios que requieren{" "}
                        <strong>atención terapéutica</strong> con{" "}
                        <strong>profesionales altamente competentes</strong>.
                        Buscamos <strong>facilitar el acceso</strong> a servicios de
                        psicoterapia individual de forma conveniente, contando con una{" "}
                        <strong>amplia variedad de profesionales</strong> que ofrecen
                        diferentes especialidades y enfoques terapéuticos.
                        De esta manera, los usuarios tienen la oportunidad de seleccionar al
                        terapeuta que mejor se ajuste a sus necesidades y{" "}
                        <strong>les acompañe en el proceso de recuperación</strong>.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
