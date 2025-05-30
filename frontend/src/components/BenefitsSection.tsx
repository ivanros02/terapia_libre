import React from "react";
import CustomButton from "./CustomButton";
import "../styles/BenefitsSection.css";
const benefits = [
    { image: "/benefs/facil_acceso.png", text: <><strong>Acceso sin barreras:</strong>Encontrá profesionales desde cualquier lugar, sin traslados ni esperas. Todo desde la comodidad de tu hogar.</> },
    { image: "/benefs/facilidad_compra.png", text: <><strong>Variedad de opciones:</strong> Accedé a una amplia red de profesionales con distintas especialidades, enfoques y trayectorias, para que puedas elegir quién mejor se adapta a vos.</> },
    { image: "/benefs/amplia_variedad.png", text: <><strong>Perfiles transparentes y detallados:</strong>Conocé la formación, experiencia, modalidad de atención y valores de cada profesional antes de reservar una sesión.</> },
    { image: "/benefs/posibilidad_contacto.png", text: <><strong>Comparación sencilla:</strong>Navegá entre profesionales, leé valoraciones y elegí a quien más resuene con tus necesidades emocionales.</> },
    { image: "/benefs/info_detallada.png", text: <><strong>Seguridad y confidencialidad:</strong>Toda la plataforma cuenta con protección de datos y verificación de profesionales, para que tu experiencia sea segura y confiable.</> },
    { image: "/benefs/seguro_confienza.png", text: <><strong>Flexibilidad en turnos:</strong>Encontrá disponibilidad horaria acorde a tus tiempos, incluso con opciones de atención en menos de 24 hs.</> }
];

const BenefitsSection: React.FC = () => {
    return (
        <section className="container py-5">
            <h2 className="text-center mb-5 h2-custom-benef">Beneficios</h2>
            <div className="row">
                {benefits.map((benefit, index) => (
                    <div key={index} className="col-md-6 d-flex align-items-center mb-4">
                        <img src={benefit.image} alt="benefit-icon" width={50} height={50} className="me-3" />
                        <p className="mb-0">{benefit.text}</p>
                    </div>
                ))}
            </div>
            <div className="d-flex justify-content-center mt-4">
                <CustomButton text="QUIERO INTENTARLO" href="/professionals" />
            </div>
        </section>
    );
};

export default BenefitsSection;
