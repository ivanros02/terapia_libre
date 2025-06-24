import React from "react";
import Head from "../layouts/Header"; // Usa el mismo Head si es necesario
import Footer from "../layouts/Footer";
import LoginComponente from "../components/login/LoginComponent"; // Asegúrate de tener este componente
import LegalPopup from "../layouts/LegalPopup";
const Login: React.FC = () => {
    const menuLinks = [
        { name: "Buscar profesional", href: "/professionals" },
    ];

    return (
        <div
            style={{
                backgroundImage: "url('/papel.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh" // 🔹 Asegura que cubra toda la altura de la pantalla
            }}
        >
            <Head links={menuLinks} />
            <LoginComponente />
            <Footer />
            <LegalPopup />
        </div>
    );

}

export default Login;