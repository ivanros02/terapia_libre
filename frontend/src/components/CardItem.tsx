import React, { useState } from "react";
import styles from "../styles/CardItem.module.css"; // Asegúrate de que la ruta sea correcta

interface CardProps {
    image: string;
    title: string;
    card_text: React.ReactNode;
}

const CardItem: React.FC<CardProps> = ({ image, title, card_text }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={styles.cardContainer}
            style={{
                backgroundImage: `url(${image})`
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <img
                src={image}
                alt={title}
                className={styles.cardImage}
                style={{ opacity: hovered ? 0.3 : 1 }}
            />

            <div
                className={styles.overlay}
                style={{
                    backgroundColor: hovered ? "var(--verde)" : "transparent",
                    opacity: hovered ? 0.75 : 0
                }}
            >
                {hovered && (
                    <h4 className={styles.overlayText}>
                        {card_text}
                    </h4>
                )}
            </div>

            {!hovered && (
                <div className={styles.middleStripe}>
                    <h5 className="text-white mb-0">{title}</h5>
                </div>
            )}

        </div>
    );
};

export default CardItem;
