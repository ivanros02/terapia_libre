import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/CustomButton.module.css";

interface ButtonProps {
  text: string;
  href: string;
  hoverText?: string; // <- prop opcional
}

const CustomButton: React.FC<ButtonProps> = ({ text, href, hoverText }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={href}
      className={styles.customButton}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && hoverText ? hoverText : text}
    </Link>
  );
};

export default CustomButton;
