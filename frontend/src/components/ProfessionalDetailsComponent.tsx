import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Para la redirección
import CalendarAvailability from "./CalendarAvailability";


interface Professional {
    id_profesional: number;
    nombre: string;
    foto_perfil_url: string;
    especialidades: string[];
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

    const handleOpenCalendar = () => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            // Guardamos la URL actual antes de redirigir al login
            localStorage.setItem("prevPath", location.pathname);
            navigate("/login");
            return;
        }
    
        // Si hay token, abrir el calendario
        setShowCalendar(true);
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
        <div className="container mt-5">
            <div className="row justify-content-center align-items-stretch">
                {/* Imagen */}
                <div className="col-12 col-md-4 d-flex justify-content-center">
                    <div className="card shadow-lg rounded-4 p-0 h-100" style={{ width: "300px", height: "300px", overflow: "hidden" }}>
                        <img
                            src={getGoogleDriveImageUrl(professional.foto_perfil_url)}
                            alt={professional.nombre}
                            className="w-100 h-100"
                            style={{ objectFit: "cover", maxWidth: "100%", maxHeight: "100%" }}
                        />
                    </div>
                </div>

                {/* Datos */}
                <div className="col-12 col-md-7 mt-4 mt-md-0 d-flex">
                    <div className="card shadow-lg rounded-4 p-4 text-white w-100 h-100" style={{ backgroundColor: "var(--verde)", minHeight: "300px" }}>
                        <p className="small text-light">{`Disponibilidad en ${professional.disponibilidad}`}</p>
                        <h2 className="fw-bold">
                            {professional.nombre} <span className="fw-normal text-light"> ${professional.valor}.-</span>
                        </h2>
                        <p className="fw-semibold">{professional.especialidades.join(" • ")}</p>
                        <p className="text-light">{professional.descripcion}</p>

                        {/* Botón para abrir el calendario flotante */}
                        <button className="btn btn-light fw-bold mt-3" onClick={handleOpenCalendar}>
                            Agendar turno
                        </button>
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