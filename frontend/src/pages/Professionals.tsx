import React, { useState } from "react";
import Head from "../layouts/Header"; // Usa el mismo Head si es necesario
import Footer from "../layouts/Footer";
import ProfessionalList from "../components/ProfessionalList";
import FilterBar from "../components/FilterBar";
import "../styles/Professionals.css";
import LegalPopup from "../layouts/LegalPopup";
const Professionals: React.FC = () => {
    const menuLinks = [
        { name: "¿Necesito terapia?", href: "/necesito-terapia" },
        { name: "Buscar profesional", href: "/professionals" },
    ];

    const [selectedEspecialidad, setSelectedEspecialidad] = useState<string>("");
    const [selectedDisponibilidad, setSelectedDisponibilidad] = useState<string>("");
    const [selectedOrden, setSelectedOrden] = useState<string>("");

    return (
        <>
            <Head links={menuLinks} />
            <main
                className="text-center"
                style={{
                    backgroundImage: "url('/papel.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    minHeight: "83vh", // Asegura que ocupe toda la pantalla
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    paddingTop: "16rem" // Ajusta según la altura del navbar
                }}
            >
                <h1 className="h1-custom-profs">PROFESIONALES</h1>
                {/* Filtros */}
                <FilterBar
                    selectedEspecialidad={selectedEspecialidad}
                    setSelectedEspecialidad={setSelectedEspecialidad}
                    selectedDisponibilidad={selectedDisponibilidad}
                    setSelectedDisponibilidad={setSelectedDisponibilidad}
                    selectedOrden={selectedOrden}
                    setSelectedOrden={setSelectedOrden}
                />
                <ProfessionalList
                    selectedEspecialidad={selectedEspecialidad}
                    selectedDisponibilidad={selectedDisponibilidad}
                    selectedOrden={selectedOrden}
                />
            </main >
            <Footer />
            <LegalPopup/>
        </>
    );
};

export default Professionals;
