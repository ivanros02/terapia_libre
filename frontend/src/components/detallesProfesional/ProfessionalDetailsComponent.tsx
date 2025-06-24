import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Para la redirección
import CalendarAvailability from "./CalendarAvailability";
import "../../styles/ProfessionalDetailsComponent.css"; // Asegúrate de que la ruta sea correcta
import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL;

interface Professional {
    id_profesional: number;
    nombre: string;
    foto_perfil_url: string;
    especialidades: {
        id_especialidad: number;
        nombre: string;
    }[];
    disponibilidad: string;
    valor: number;
    descripcion: string;
}

interface ProfessionalDetailsComponentProps {
    professional: Professional;
}

const ProfessionalDetailsComponent: React.FC<ProfessionalDetailsComponentProps> = ({ professional }) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const navigate = useNavigate();
    const formattedPrice = Number(professional.valor).toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const handleOpenCalendar = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("No hay token, redirigiendo a login...");
            localStorage.setItem("prevPath", location.pathname);
            navigate("/login");
            return;
        }

        try {
            const id = localStorage.getItem("id"); // 🔥 Acordate que también guardás el id
            if (!id) {
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }

            // 🔥 Validar contra backend
            await axios.get(`${url}/api/auth/usuario/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // ✅ Si todo bien, mostrar el calendario
            setShowCalendar(true);
        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            navigate("/login");
        }
    };

    const getGoogleDriveImageUrl = (url: string) => {
        if (!url) return "/placeholder.jpg"; // 🔹 Si no hay URL, muestra un placeholder

        let fileId = "";

        // Detectar diferentes formatos de URL de Google Drive
        if (url.includes("/d/")) {
            fileId = url.split("/d/")[1]?.split("/")[0]; // Extraer ID de formato "/d/"
        } else if (url.includes("id=")) {
            fileId = url.split("id=")[1]?.split("&")[0]; // Extraer ID de formato "id="
        }

        return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=s220` : "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png";
    };

    return (
        <div className="container mt-5 ">
            <div className="row justify-content-center align-items-stretch ">
                {/* Imagen */}
                <div className="col-12 col-md-4 d-flex justify-content-center tu-contenedor-flex">
                    <div className="card shadow-lg p-0" style={{
                        width: "231px",
                        height: "275px",
                        overflow: "hidden",
                        borderRadius: "32px",
                    }}>
                        <img
                            src={getGoogleDriveImageUrl(professional.foto_perfil_url)}
                            alt={professional.nombre}
                            className="w-100 h-100"
                            style={{ objectFit: "cover", maxWidth: "100%", maxHeight: "100%" }}
                        />
                    </div>
                </div>

                {/* Datos */}
                <div className="col-12 col-md-7 mt-4 mt-md-0 d-flex justify-content-center">
                    <div className="card-datos-wrapper">
                        <div className="card-datos card shadow-lg text-white p-3">

                            <div className="d-flex flex-column align-items-center justify-content-center mb-3 datos-header text-center">

                                <div className="datos-centrales flex-grow-1 text-center">
                                    <h2 className="titulo-datos mb-1">
                                        {professional.nombre} <span> ${formattedPrice}.-</span>
                                    </h2>
                                    <p className="especialidad-datos mb-0">
                                        {professional.especialidades.map((e) => e.nombre).join(" • ")}
                                    </p>
                                </div>
                            </div>


                            <p
                                className="descripcion-datos descripcion-ajustada"
                                title={professional.descripcion}
                            >
                                {professional.descripcion}
                            </p>


                            <div className="text-center">
                                <button className="btn btn-agendar btn-link mt-3" onClick={handleOpenCalendar}>
                                    Agendar turno
                                </button>
                            </div>

                        </div>
                    </div>
                </div>


            </div>

            {/* Calendario flotante */}
            {showCalendar && (
                <div className="floating-calendar-overlay" onClick={() => setShowCalendar(false)}>
                    <div className="floating-calendar-container" onClick={(e) => e.stopPropagation()}>
                        <CalendarAvailability id_profesional={professional.id_profesional} showModal={showCalendar} />
                        <button className="btn btn-danger mt-3" onClick={() => setShowCalendar(false)}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalDetailsComponent;