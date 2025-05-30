import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfessionalCard.css"; // Asegúrate de que la ruta sea correcta

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
    
    const formattedPrice = parseFloat(price).toLocaleString("es-AR");


    return (
        <div className="card border-0 professional-card overflow-hidden position-relative" style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.9)" // Sombra más notoria
        }}
            onClick={handleClick} // Añadimos el evento onClick
        >
            {/* Imagen de fondo */}
            <img src={image} alt={name} className="position-absolute w-100 h-100 object-cover" />

            {/* Contenido con fondo opaco más gris */}
            <div
                className="card-footer-custom"
            >
                <h5 className="card-footer-title mb-0 text-truncate">{name}</h5>

                {/* Especialidades */}
                <p className="mb-0 text-truncate card-footer-specialties" >
                    {specialties.join(" - ")}
                </p>

                {/* Disponibilidad */}
                <p className="mb-0 card-footer-availability d-none d-sm-block">
                    Disponibilidad en {availability}
                </p>

                {/* Precio ahora está aquí */}
                <p className="mb-0 card-footer-price">
                    {formattedPrice}.-
                </p>

            </div>
        </div>
    );
};

export default ProfessionalCard;
