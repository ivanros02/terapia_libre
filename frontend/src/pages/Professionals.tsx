import React, { useState } from "react";
import Head from "../layouts/Header"; // Usa el mismo Head si es necesario
import Footer from "../layouts/Footer";
import ProfessionalList from "../components/ProfessionalList";
import FilterBar from "../components/FilterBar";

const Professionals: React.FC = () => {
    const menuLinks = [
        { name: "¿Necesito terapia?", href: "/necesito-terapia" },
        { name: "Buscar profesional", href: "/buscar-profesional" },
        { name: "Iniciar Sesión", href: "/Login" },
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
                    backgroundImage: "url('../src/assets/home.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    minHeight: "95vh", // Asegura que ocupe toda la pantalla
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    paddingTop: "6rem" // Ajusta según la altura del navbar
                }}
            >
                <h1 style={{ color: "var(--verde)" }}>PROFESIONALES</h1>
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
        </>
    );
};

export default Professionals;
