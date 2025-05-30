// components/RutaProtegida.tsx
import React from "react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const RutaProtegida: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");

  if (!token || !id) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RutaProtegida;
