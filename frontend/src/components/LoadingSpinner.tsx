import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "200px", width: "100%" }}
    >
      <div
        className="spinner-border mb-3"
        role="status"
        style={{
          width: "3rem",
          height: "3rem",
          color: "var(--verde)", // 🟢 color personalizado
          borderColor: "var(--verde) transparent var(--verde) transparent", // para animar
        }}
      >
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p className="fw-bold text-secondary">Cargando, por favor esperá...</p>
    </div>
  );
};

export default LoadingSpinner;
