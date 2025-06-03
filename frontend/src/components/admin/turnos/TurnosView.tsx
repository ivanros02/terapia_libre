import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { Turno, DetallesTurno, Filtros } from "./types/Turnos";
import { TurnosHeader } from "./TurnosHeader";
import { FiltrosTurnos } from "./FiltrosTurnos";
import { TablaTurnos } from "./TablaTurnos";
import { ModalDetallesTurno } from "./ModalDetallesTurno";

const url = import.meta.env.VITE_API_BASE_URL;

const TurnosView: React.FC = () => {
    const [turnos, setTurnos] = useState<Turno[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState<DetallesTurno | null>(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    const [filtros, setFiltros] = useState<Filtros>({
        estado: "",
        fecha_desde: "",
        fecha_hasta: ""
    });

    const fetchTurnos = async () => {
        try {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("adminToken");

            if (!token) {
                setError("No hay token de administrador disponible");
                return;
            }

            const params = new URLSearchParams();
            if (filtros.estado) params.append('estado', filtros.estado);
            if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
            if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);

            const response = await axios.get(`${url}/api/admin/turnos?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTurnos(response.data.turnos || []);
        } catch (error: any) {
            console.error("Error al obtener turnos:", error);
            setError(error.response?.data?.message || "Error al cargar la lista de turnos");
        } finally {
            setLoading(false);
        }
    };

    const verDetallesTurno = async (id_turno: number) => {
        try {
            setLoadingDetalle(true);
            const token = localStorage.getItem("adminToken");

            const response = await axios.get(`${url}/api/admin/turnos/${id_turno}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Detalles del turno:", response.data);
            setTurnoSeleccionado(response.data);
            setShowDetalleModal(true);
        } catch (error: any) {
            console.error("Error al obtener detalles del turno:", error);
            setError("Error al cargar los detalles del turno");
        } finally {
            setLoadingDetalle(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltros({ estado: "", fecha_desde: "", fecha_hasta: "" });
        // Refetch automáticamente después de limpiar
        setTimeout(fetchTurnos, 100);
    };

    useEffect(() => {
        fetchTurnos();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando turnos...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <TurnosHeader 
                totalTurnos={turnos.length} 
                onActualizar={fetchTurnos} 
            />

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-4">
                    {error}
                </Alert>
            )}

            <FiltrosTurnos
                filtros={filtros}
                onFiltrosChange={setFiltros}
                onFiltrar={fetchTurnos}
                onLimpiar={limpiarFiltros}
            />

            <TablaTurnos
                turnos={turnos}
                onVerDetalles={verDetallesTurno}
                loadingDetalle={loadingDetalle}
            />

            <ModalDetallesTurno
                show={showDetalleModal}
                onHide={() => setShowDetalleModal(false)}
                turno={turnoSeleccionado}
            />
        </div>
    );
};

export default TurnosView;