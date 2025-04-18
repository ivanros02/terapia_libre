import React from "react";
import Head from "../layouts/Header"; // Usa el mismo Head si es necesario
import Footer from "../layouts/Footer";
import LoginComponente from "../components/LoginComponent"; // Asegúrate de tener este componente
import LegalPopup from "../layouts/LegalPopup";
const Login: React.FC = () => {
    const menuLinks = [
        { name: "¿Necesito terapia?", href: "/necesito-terapia" },
        { name: "Buscar profesional", href: "/professionals" },
    ];

    return (
        <>
            <Head links={menuLinks} />
            <LoginComponente />
            <Footer />
            <LegalPopup/>
        </>
    );
}

export default Login;