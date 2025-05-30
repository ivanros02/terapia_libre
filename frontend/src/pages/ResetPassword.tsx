import { useState } from "react";
import { useParams } from "react-router-dom";

import Head from "../layouts/Header"; // Usa el mismo Head si es necesario
import Footer from "../layouts/Footer";
import LegalPopup from "../layouts/LegalPopup";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const url = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [message,] = useState("");
    const menuLinks = [
        { name: "¿Necesito terapia?", href: "/necesito-terapia" },
        { name: "Buscar profesional", href: "/professionals" },
    ];
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/auth/reset-password`, {
                token,
                newPassword: password,
            });
            toast.success(response.data.message || "Contraseña restablecida con éxito");
            setPassword(""); // opcional: limpiar campo
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Error al restablecer la contraseña."
            );
        }
    };

    return (
        <>
            <Head links={menuLinks} />
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
                    <h2>Restablecer Contraseña</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Restablecer</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
            <Footer />
            <LegalPopup />
        </>
    );
};

export default ResetPassword;
