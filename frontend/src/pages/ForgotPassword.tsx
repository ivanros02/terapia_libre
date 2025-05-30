import { useState } from "react";
import axios from "axios";
import Head from "../layouts/Header"; // Usa el mismo Head si es necesario
import Footer from "../layouts/Footer";
import LegalPopup from "../layouts/LegalPopup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const url = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, ] = useState("");
    const menuLinks = [
        { name: "¿Necesito terapia?", href: "/necesito-terapia" },
        { name: "Buscar profesional", href: "/professionals" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/auth/forgot-password`, {
                correo_electronico: email,
            });
            toast.success(response.data.message || "Correo enviado con éxito");
            setEmail(""); // opcional: limpiar el campo
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Error al enviar la solicitud."
            );
        }
    };


    return (
        <>
            <Head links={menuLinks} />
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
                    <h2 className="text-center mb-4">Recuperar Contraseña</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Enviar
                            </button>
                        </div>
                    </form>
                    {message && (
                        <div className="alert alert-info mt-3 text-center">
                            {message}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
            <LegalPopup />
        </>
    );
};

export default ForgotPassword;
