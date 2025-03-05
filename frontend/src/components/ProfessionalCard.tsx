import React from "react";

type ProfessionalCardProps = {
    name: string;
    image: string;
    specialties: string[];
    availability: string;
    price: string;
};

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ name, image, specialties, availability, price }) => {
    return (
        <div className="card border-0 shadow-lg rounded-5 overflow-hidden position-relative" style={{ width: "95%", height: "270px" }}>
            {/* Imagen de fondo */}
            <img src={image} alt={name} className="position-absolute w-100 h-100 object-cover" />

            {/* Contenido con fondo opaco más gris */}
            <div className="position-absolute bottom-0 w-100 p-1 text-white" style={{
                background: "rgba(171, 169, 166, 0.7)"
            }}>
                <h5 className="fw-bold mb-1">{name}</h5>

                {/* Especialidades */}
                <p className="mb-1 text-truncate" style={{ maxHeight: "40px", overflow: "hidden" }}>
                    {specialties.join(" • ")}
                </p>

                {/* Disponibilidad */}
                <p className=" mb-1">{availability}</p>

                {/* Precio ahora está aquí */}
                <p className=" fs-5">{price}</p>
            </div>
        </div>
    );
};

export default ProfessionalCard;
