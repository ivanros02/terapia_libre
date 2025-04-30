import React, { useState, useEffect } from "react";

const LegalPopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("acceptedTerms");
    if (!hasAccepted) {
      setShowPopup(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("acceptedTerms", "true");
    setShowPopup(false);
  };

  if (!showPopup) return null; // No renderiza si ya aceptó

  return (
    <div
      className="legal-popup"
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        backgroundColor: "var(--degrade-verde-oscuro)", // Verde semi-transparente
        color: "white",
        textAlign: "center",
        padding: "15px",
        fontSize: "14px",
        lineHeight: "1.6",
        zIndex: "1000",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <p style={{ marginBottom: "10px" }}>
        Al continuar en este sitio, aceptas nuestros
        <a href="/terminos-y-condiciones" className="fw-semibold mx-1" style={{ color: "#fff", textDecoration: "underline" }}>
          Términos y Condiciones
        </a>
        y nuestra
        <a href="/privacidad" className="fw-semibold mx-1" style={{ color: "#fff", textDecoration: "underline" }}>
          Política de Privacidad
        </a>.
      </p>
      <button
        onClick={handleAccept}
        style={{
          backgroundColor: "var(--verde)",
          color: "white",
          border: "none",
          padding: "8px 20px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        Aceptar
      </button>
    </div>
  );
};

export default LegalPopup;
