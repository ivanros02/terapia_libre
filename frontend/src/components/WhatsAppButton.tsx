import React from "react";

const WhatsAppButton: React.FC = () => {
  const phoneNumbers = [
    "+5491144482738",
    "+5491166677788",
    "+5491199990000"
  ]; // ← Tus 3 números

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * phoneNumbers.length);
    const selectedNumber = phoneNumbers[randomIndex];
    window.open(`https://wa.me/${selectedNumber}`, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="btn btn-success rounded-circle shadow-lg"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#25D366",
        borderColor: "#25D366",
        alignItems: "center",
        zIndex: 1000,
        fontSize: "24px"
      }}
    >
      <i className="bi bi-whatsapp"></i>
    </button>
  );
};

export default WhatsAppButton;
