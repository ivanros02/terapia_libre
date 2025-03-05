import React from "react";
import "../styles/HeroSection.css";
import CustomButton from "./CustomButton";
import Head from "../layouts/Header"; // Importa el Head

const HeroSection: React.FC = () => {
  const menuLinks = [
    { name: "¿Necesito terapia?", href: "/necesito-terapia" },
    { name: "Buscar profesional", href: "/professionals" },
    { name: "Iniciar Sesión", href: "/Login" },
  ];

  return (
    <>
      <Head links={menuLinks} /> 
      <section className="hero-section d-flex flex-column align-items-center text-center">
        <h1 className="display-2">¿NECESITAS AYUDA?</h1>
        <p className="fs-5">
          Elegí entre <strong>1.000+</strong> especialistas y obtené asistencia terapéutica en 24 horas.
        </p>
        <CustomButton text="QUIERO INTENTARLO" href="/professionals" />
      </section>
    </>
  );
};

export default HeroSection;
