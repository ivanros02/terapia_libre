import React from "react";
import CardItem from "./CardItem";
import CustomButton from "./CustomButton";
import "../../styles/NeedTherapy.css"; // Asegúrate de tener este archivo CSS para los estilos personalizados

const NeedTherapy: React.FC = () => {
    return (
        <section
            className="container-fluid py-5"
            style={{
                position: "relative",
                minHeight: "55vh",
                backgroundImage: "url('/garabatos.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Degradado superior */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "20%", // Ajusta según el tamaño del degradado que desees
                    background: "linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
                    pointerEvents: "none",
                }}
            />

            <div className="container">
                <div className="row align-items-center">
                    {/* Texto a la izquierda */}
                    <div className="col-lg-5 text-white text-lg-start text-center mb-4 mb-lg-0">
                        <h2 className="h2-custom-need">
                            ¿Necesito <br /> terapia?
                        </h2>
                        <p style={{ fontSize: "16px", color: "black", fontWeight: "500" }}>
                            EN QUÉ SITUACIONES DEBERÍAS ACUDIR A <br />
                            NUESTROS PROFESIONALES DE SALUD MENTAL
                        </p>
                        <div className="d-lg-inline-block d-flex justify-content-center">
                            <CustomButton text="QUIERO INTENTARLO" href="/professionals" />
                        </div>

                    </div>

                    {/* Cards a la derecha */}
                    <div className="col-lg-7">
                        <div className="row g-3 justify-content-center">
                            {[
                                { image: "/cuandoAcudir/card1.jpg", title: "Ansiedad", text: <><strong>Cuando sientas niveles altos de ansiedad y estrés <br /></strong> La ansiedad puede afectar tu vida diaria y tus relaciones personales. Nuestros profesionales están capacitados para ayudarte a gestionarla.</> },
                                { image: "/cuandoAcudir/card2.jpg", title: "Depresión", text: <><strong>Cuando experimentes sentimientos persistentes de tristeza<br /></strong> La depresión no debe ser enfrentada sola. Nuestros terapeutas ofrecen un ambiente seguro y profesional para apoyarte en tu recuperación.</> },
                                { image: "/cuandoAcudir/card3.jpg", title: "Problemas de relación", text: <><strong>Cuando enfrentes dificultades en tus relaciones<br /></strong> Las relaciones pueden ser complicadas. La terapia te puede ayudar a resolver conflictos y mejorar tus habilidades de comunicación.</> },
                                { image: "/cuandoAcudir/card4.jpg", title: "Estrés laboral", text: <><strong>Cuando el trabajo sea abrumador y afecte tu salud mental<br /></strong> Nuestros terapeutas pueden guiarte en el manejo del estrés y en cómo balancear mejor tu vida personal y profesional.</> },
                                { image: "/cuandoAcudir/card5.jpg", title: "Autoestima baja", text: <><strong>Cuando sientas inseguridades que afecten tu autovaloración<br /></strong> La autoestima es crucial para tu bienestar. Trabaja en mejorar tu autoconfianza con la guía de un terapeuta.</> },
                                { image: "/cuandoAcudir/card6.jpg", title: "Duelo", text: <><strong>Cuando enfrentes la pérdida de un ser querido<br /></strong> El proceso de duelo puede ser abrumador, pero con el apoyo adecuado puedes encontrar formas saludables de sobrellevar la pérdida.</> }
                            ].map((card, index) => (
                                <div key={index} className="col-6 col-md-4 d-flex justify-content-center">
                                    <CardItem image={card.image} title={card.title} card_text={card.text} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Degradado inferior (transparente a blanco hacia abajo) */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "15%", // Ajusta la altura del degradado inferior
                    background: "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))",
                    pointerEvents: "none",
                }}
            />
        </section>

    );
};

export default NeedTherapy;
