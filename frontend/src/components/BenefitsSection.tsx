import React from "react";
import { FaArrowRight, FaClock, FaBalanceScale, FaMoneyBillWave, FaHeart } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import CustomButton from "./CustomButton";
const benefits = [
    { icon: <FaArrowRight size={40} className="text-black" />, text: <><strong>Facilidad de acceso:</strong>Permite encontrar profesionales fácilmente desde la comodidad de tu hogar, sin necesidad de desplazarte básicamente a una consulta.</> },
    { icon: <FaBalanceScale size={40} className="text-black" />, text: <><strong>Facilidad para comparar:</strong>Muchas plataformas permiten el contacto directo con el profesional antes de programar una cita, lo que te brinda la oportunidad de plantear tus dudas y conocer mejor al profesional.</> },
    { icon: <BsThreeDots size={40} className="text-black" />, text: <><strong>Amplia variedad de opciones :</strong>Al buscar en una plataforma, tendrás acceso a una amplia gama de profesionales de diferentes especialidades y experiencias.</> },
    { icon: <FaHeart size={40} className="text-black" />, text: <><strong>Posibilidad de contacto directo:</strong> Muchas plataformas permiten el contacto directo con el profesional antes de programar una cita, lo que te brinda la oportunidad de plantear tus dudas y conocer mejor al profesional.</> },
    { icon: <FaClock size={40} className="text-black" />, text: <><strong>Información detallada:</strong>Las plataformas suelen proporcionar información detallada sobre los profesionales, como su formación, áreas de especialización, opiniones de otros usuarios y tarifas.</> },
    { icon: <FaMoneyBillWave size={40} className="text-black" />, text: <><strong>Seguridad y confianza:</strong> Las plataformas suelen contar con sistemas de verificación y garantías de protección de datos para brindarte mayor seguridad al buscar profesionales.</> }
];

const BenefitsSection: React.FC = () => {
    return (
        <section className="container py-5">
            <h2 className="text-center mb-5" style={{ color: "var(--naranja)" }}>Beneficios</h2>
            <div className="row">
                {benefits.map((benefit, index) => (
                    <div key={index} className="col-md-6 d-flex align-items-center mb-4">
                        <div className="me-3">{benefit.icon}</div>
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
