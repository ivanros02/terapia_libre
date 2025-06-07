// 1. AGREGAR TELÉFONO A LA INTERFACE
interface Usuario {
  id_usuario: number;
  nombre: string;
  correo_electronico: string;
  telefono?: string | null; // 🔹 AGREGAR ESTA LÍNEA
  created_at: string;
  id_google: string | null;
}

interface PacientesListaProps {
  usuarios: Usuario[];
}

const PacientesLista = ({ usuarios }: PacientesListaProps) => {
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

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="text-muted">
          <i className="bi bi-people fs-1 mb-3 d-block"></i>
          <p className="mb-0">No hay usuarios registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {usuarios.map((usuario) => (
        <div key={usuario.id_usuario} className="col-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="row align-items-center">
                
                {/* Nombre y Correo */}
                <div className="col-12 col-lg-3 mb-2 mb-lg-0">
                  <div className="fw-medium text-dark mb-1">{usuario.nombre}</div>
                  <div className="text-muted small">{usuario.correo_electronico}</div>
                </div>
                
                {/* 🔹 NUEVA COLUMNA PARA TELÉFONO */}
                <div className="col-12 col-lg-2 mb-2 mb-lg-0">
                  <div className="text-muted small">Teléfono</div>
                  <div className="text-dark small">
                    {usuario.telefono || 'No registrado'}
                  </div>
                </div>
                
                {/* Fecha */}
                <div className="col-6 col-lg-4 mb-2 mb-lg-0">
                  <div className="text-muted small">Registrado</div>
                  <div className="text-dark small">{formatearFecha(usuario.created_at)}</div>
                </div>
                
                {/* Tipo */}
                <div className="col-6 col-lg-3 text-lg-end">
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
  );
};

export default PacientesLista;