import React from "react";
import "../../styles/HeroSection.css";
import CustomButton from "./CustomButton";

const HeroSection: React.FC = () => {


  return (
    <>

      <section className="hero-section d-flex flex-column align-items-center text-center" style={{ paddingBottom: "650px" }}>
        <h1>¿NECESITAS AYUDA?</h1>
        <p>
          Conectate con un especialista y empezá terapia de forma inmediata.
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
