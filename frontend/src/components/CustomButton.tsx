import React from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  text: string;
  href: string;
}

const CustomButton: React.FC<ButtonProps> = ({ text, href }) => {
  return (
    <Link
      to={href} 
      className="btn btn-lg fw-bold px-5 py-1"
      style={{
        backgroundColor: "var(--verde)",
        color: "white",
        borderRadius: "30px",
        fontSize:"16px"
      }}
    >
      {text}
    </Link>
  );
};

export default CustomButton;
