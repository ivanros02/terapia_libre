import React from "react";
import "../../styles/HeroSection.css";
import CustomButton from "./CustomButton";

const HeroSection: React.FC = () => {


  return (
    <>

      <section className="hero-section d-flex flex-column align-items-center text-center" style={{ paddingBottom: "650px" }}>
        <h1>¿NECESITAS AYUDA?</h1>
        <p>
          Elegí entre <strong>1.000+</strong> especialistas y obtené asistencia terapéutica en 24 horas.
        </p>
        <CustomButton
          text="QUIERO INTENTARLO"
          hoverText="BUSCAR PROFESIONAL"
          href="/professionals"
        />

      </section>
    </>
  );
};

export default HeroSection;
