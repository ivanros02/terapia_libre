import React from "react";
import Head from "../layouts/Header"; // Usa el mismo Head si es necesario
import Footer from "../layouts/Footer";
import FormProfessionalsComponent from "../components/FormProfessionalsComponent"; // Asegúrate de tener este componente

const FormProfessionals: React.FC = () => {
    const menuLinks = [
        { name: "Buscar profesional", href: "/professionals" },
    ];

    return (
        <>
            <Head links={menuLinks} />
            <FormProfessionalsComponent />
            <Footer />
        </>
    );
}

export default FormProfessionals;