import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import axios from "axios";

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

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoRegistro = (id_google: string | null) => {
    return id_google ? "Google" : "Email";
  };

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

      {/* Users List */}
      {usuarios.length > 0 ? (
        <div className="row g-3">
          {usuarios.map((usuario) => (
            <div key={usuario.id_usuario} className="col-12">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3">
                  <div className="row align-items-center">
                    
                    {/* Nombre */}
                    <div className="col-12 col-lg-4 mb-2 mb-lg-0">
                      <div className="fw-medium text-dark mb-1">{usuario.nombre}</div>
                      <div className="text-muted small">{usuario.correo_electronico}</div>
                    </div>

                    {/* Fecha */}
                    <div className="col-6 col-lg-4 mb-2 mb-lg-0">
                      <div className="text-muted small">Registrado</div>
                      <div className="text-dark small">{formatearFecha(usuario.created_at)}</div>
                    </div>

                    {/* Tipo */}
                    <div className="col-6 col-lg-4 text-lg-end">
                      <span className={`badge ${usuario.id_google ? 'bg-info' : 'bg-secondary'} bg-opacity-75`}>
                        {getTipoRegistro(usuario.id_google)}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="text-muted">
            <i className="bi bi-people fs-1 mb-3 d-block"></i>
            <p className="mb-0">No hay usuarios registrados</p>
          </div>
        </div>
      )}

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