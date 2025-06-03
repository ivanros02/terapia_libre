import React from "react";
import { Button } from "react-bootstrap";

interface ReportesHeaderProps {
  onExportar: () => void;
  onActualizar: () => void;
  loading: boolean;
  tieneData: boolean;
}

export const ReportesHeader: React.FC<ReportesHeaderProps> = ({
  onExportar,
  onActualizar,
  loading,
  tieneData
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 className="mb-1">Reportes y Análisis</h3>
        <p className="text-muted mb-0">Análisis detallado del rendimiento del sistema</p>
      </div>
      <div className="d-flex gap-2">
        <Button variant="outline-success" onClick={onExportar} size="sm" disabled={!tieneData}>
          <i className="bi bi-download me-1"></i>
          Exportar CSV
        </Button>
        <Button variant="outline-primary" onClick={onActualizar} size="sm" disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1"></i>
          Actualizar
        </Button>
      </div>
    </div>
  );
};