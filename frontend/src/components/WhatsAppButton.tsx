import React from "react";

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "+5491144482738"; // <- Reemplazalo con tu número

  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      className="btn btn-success rounded-circle shadow-lg"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#25D366", // ✅ color WhatsApp
        borderColor: "#25D366",
        alignItems: "center",
        zIndex: 1000,
        fontSize: "24px"
      }}
    >
      <i className="bi bi-whatsapp"></i>
    </a>
  );
};

export default WhatsAppButton;
