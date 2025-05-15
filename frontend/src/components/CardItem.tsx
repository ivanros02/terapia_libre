import React, { useState } from "react";

interface CardProps {
    image: string;
    title: string;
    card_text: React.ReactNode;
}

const CardItem: React.FC<CardProps> = ({ image, title, card_text }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="card overflow-hidden position-relative border-0 shadow-sm mx-auto w-100 shadow-lg"
            style={{
                height: "270px",
                width: "95%",
                cursor: "pointer",
                borderRadius: "25px" // Más redondeado
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img src={image} className="card-img" alt={title} style={{ opacity: hovered ? 0.3 : 1 }} />

            {/* Overlay que cubre toda la card al hacer hover */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{
                    backgroundColor: hovered ? "var(--verde)" : "transparent",
                    opacity: hovered ? 0.75 : 0,
                    transition: "opacity 0.3s ease-in-out",
                }}
            >
                {/* Texto que se muestra al hacer hover */}
                {hovered && <h4
                    className="text-white"
                    style={{
                        fontSize: "clamp(12px, 2vw, 16px)", // Tamaño flexible
                        lineHeight: "1.2",  // Espaciado entre líneas
                        textAlign: "center",
                        maxWidth: "90%",
                        maxHeight: "80%",
                        overflow: "hidden", // Oculta cualquier desbordamiento
                        WebkitBoxOrient: "vertical", // Mantiene el texto en bloque vertical
                    }}
                >
                    {card_text}
                </h4>
                }
            </div>

            {/* Franja que se oculta al hacer hover */}
            {!hovered && (
                <div
                    className="position-absolute top-50 start-0 translate-middle-y w-100 text-center py-2"
                    style={{ backgroundColor: "var(--verde)", opacity: 0.75, transition: "opacity 0.3s ease-in-out",height:"71px" }}
                >
                    <h5 className="text-white mb-0">{title}</h5>
                </div>
            )}
        </div>
    );
};

export default CardItem;
