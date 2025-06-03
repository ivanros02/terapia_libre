import React from "react";
import { Button } from "react-bootstrap";

interface TurnosHeaderProps {
    totalTurnos: number;
    onActualizar: () => void;
}

export const TurnosHeader: React.FC<TurnosHeaderProps> = ({ totalTurnos, onActualizar }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h3 className="mb-1">Gestión de Turnos</h3>
                <p className="text-muted mb-0">Total de turnos: {totalTurnos}</p>
            </div>
            <Button variant="outline-primary" onClick={onActualizar} size="sm">
                <i className="bi bi-arrow-clockwise me-1"></i>
                Actualizar
            </Button>
        </div>
    );
};