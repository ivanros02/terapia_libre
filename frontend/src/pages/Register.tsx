import React from "react";
import Head from "../layouts/Header"; // Usa el mismo Head si es necesario
import Footer from "../layouts/Footer";
import RegisterComponent from "../components/login/RegisterComponent"; // Asegúrate de tener este componente

const Register: React.FC = () => {
    const menuLinks = [ 
        { name: "Buscar profesional", href: "/professionals" },
    ];

    return (
        <>
            <Head links={menuLinks} />
            <RegisterComponent />
            <Footer />
        </>
    );
}

export default Register;