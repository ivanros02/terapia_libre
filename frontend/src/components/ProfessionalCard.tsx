import React from "react";
import { useNavigate } from "react-router-dom";

type ProfessionalCardProps = {
    id: number; // Agregamos el id del profesional
    name: string;
    image: string;
    specialties: string[];
    availability: string;
    price: string;
};

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ id, name, image, specialties, availability, price }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/profesional/${id}`); // Redirige a la página de detalles con el ID
    };

    return (
        <div className="card border-0  rounded-5 overflow-hidden position-relative" style={{
            width: "100%",
            height: "290px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.9)" // Sombra más notoria
        }}
            onClick={handleClick} // Añadimos el evento onClick
        >
            {/* Imagen de fondo */}
            <img src={image} alt={name} className="position-absolute w-100 h-100 object-cover" />

            {/* Contenido con fondo opaco más gris */}
            <div className="position-absolute bottom-0 w-100 p-1 text-white" style={{
                background: "rgba(var(--verde-rgb), 0.7)"
            }}>
                <h5 className="fw-bold mb-0">{name}</h5>

                {/* Especialidades */}
                <p className="mb-0 text-truncate" style={{ maxHeight: "40px", overflow: "hidden" }}>
                    {specialties.join(" • ")}
                </p>

                {/* Disponibilidad */}
                <p className=" mb-0">Disponibilidad en {availability}</p>

                {/* Precio ahora está aquí */}
                <p className=" fs-5 mb-0">{price}.-</p>
            </div>
        </div>
    );
};

export default ProfessionalCard;
