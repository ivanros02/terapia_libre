import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import axios from "axios";
import PacientesLista from "./PacientesLista";

const url = import.meta.env.VITE_API_BASE_URL;

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo_electronico: string;
  created_at: string;
  id_google: string | null;
}

const PacientesView = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        setError("No hay token de administrador disponible");
        return;
      }

      const response = await axios.get(`${url}/api/admin/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsuarios(response.data.users || []);
      setError("");
    } catch (error: any) {
      console.error("❌ Error al obtener usuarios:", error);
      setError(error.response?.data?.message || "Error al cargar la lista de usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <h3 className="mb-0 text-dark fw-normal">Usuarios</h3>
        <Button 
          variant="outline-primary"
          size="sm"
          onClick={fetchUsuarios}
          className="px-3"
        >
          Actualizar
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-4">
          {error}
        </Alert>
      )}

      {/* Lista de Pacientes */}
      <PacientesLista usuarios={usuarios} />

      {/* Footer */}
      {usuarios.length > 0 && (
        <div className="mt-4 pt-3 border-top">
          <small className="text-muted">
            Total: {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''}
          </small>
        </div>
      )}
    </div>
  );
};

export default PacientesView;