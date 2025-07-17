// components/dashboard/TablaFacturacion.tsx
import React from "react";

interface Session {
  id: string;
  date: string;
  time: string;
  patient: string;
  value: number;
  status: "cancelada" | "completada" | "pendiente";
  detail?: string;
}

interface Props {
  sessions: Session[];
  isMobile: boolean;
  uploading: boolean;
  expandedSessions: Set<string>;
  esProfesional: boolean;
  toggleExpanded: (id: string) => void;
  formatValue: (value: number) => string;
  getStatusDisplay: (status: string) => string;
  handleFileUpload: (id: string) => void;
  handleDownloadInvoice: (id: string, date: string) => void;
  formatDateForMobile: (date: string) => string;
}

const TablaFacturacion: React.FC<Props> = ({
  sessions,
  isMobile,
  uploading,
  expandedSessions,
  esProfesional,
  toggleExpanded,
  formatValue,
  getStatusDisplay,
  handleFileUpload,
  handleDownloadInvoice,
  formatDateForMobile,
}) => {
  return (
    <div className="table-body mt-3">
      {!esProfesional && isMobile && (
        <h1 style={{
          fontSize: '20px',
          fontWeight: '500',
          color: '#333'
        }}>
          Historial de sesiones
        </h1>
      )}
      {sessions.map((session) => (
        <div
          key={session.id}
          className="table-row-container"
          style={
            {
              border: '0.5px solid #616161',
              borderRadius: '18.5px',
              marginBottom: '1rem',
              padding: '0.1rem 1rem',
              backgroundColor: '#fff'
            }
          }
        >
          <div className="table-row" style={isMobile ? { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } : {}}>
            {isMobile ? (
              <>
                {esProfesional ? (
                  <>
                    <div className="cell" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      {session.patient}
                    </div>
                    <div className="cell" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      {formatDateForMobile(session.date)} - {session.time}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cell" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      {formatDateForMobile(session.date)} - {session.time}
                    </div>
                    <div className="cell" style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                      {formatValue(session.value)}
                    </div>
                  </>
                )}
                <div className="cell">
                  <button
                    className="expand-btn"
                    onClick={() => toggleExpanded(session.id)}
                  >
                    {expandedSessions.has(session.id) ? "⌄" : "⌃"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="cell">{session.date}</div>
                <div className="cell">{session.time}</div>
                <div className="cell">{session.patient}</div>
                <div className="cell">{formatValue(session.value)}</div>
                <div className="cell">
                  <span className={`status ${session.status}`}>
                    {getStatusDisplay(session.status)}
                  </span>
                </div>
                <div className="cell">
                  {esProfesional ? (
                    <button
                      className="detail-link"
                      onClick={session.status === 'completada' ? () => handleFileUpload(session.id) : undefined}
                      disabled={uploading || session.status !== 'completada'}
                      style={{
                        color: session.status === 'completada' ? 'var(--naranja)' : '#ccc',
                        cursor: session.status === 'completada' ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {uploading
                        ? "Subiendo..."
                        : session.detail
                          ? "Factura cargada"
                          : "Cargar factura"}
                    </button>
                  ) : session.detail ? (
                    <button
                      className="detail-link"
                      onClick={() =>
                        handleDownloadInvoice(session.id, session.date)
                      }
                    >
                      Descargar factura
                    </button>
                  ) : (
                    "-"
                  )}
                </div>
              </>
            )}
          </div>
          {isMobile && expandedSessions.has(session.id) && (
            <div className="expanded-content">
              <div className="expanded-row">
                <span className={`status ${session.status}`}>
                  {getStatusDisplay(session.status)}
                </span>
                <span>{esProfesional ? 'Pagó' : 'Pagaste'}: {formatValue(session.value)}</span>
              </div>
              <div className="cell">
                {esProfesional ? (
                  <button
                    className="detail-link"
                    onClick={session.status === 'completada' ? () => handleFileUpload(session.id) : undefined}
                    disabled={uploading || session.status !== 'completada'}
                    style={{
                      color: session.status === 'completada' ? 'var(--naranja)' : '#ccc',
                      cursor: session.status === 'completada' ? 'pointer' : 'not-allowed',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px'
                    }}
                  >
                    {uploading
                      ? "Subiendo..."
                      : session.detail
                        ? "Cambiar factura"
                        : "Cargar factura"}
                  </button>
                ) : (
                  <button
                    className="detail-link"
                    onClick={session.detail ? () => handleDownloadInvoice(session.id, session.date) : undefined}
                    disabled={!session.detail}
                    style={{
                      color: session.detail ? 'var(--verde)' : '#ccc',
                      cursor: session.detail ? 'pointer' : 'not-allowed',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px'
                    }}
                  >
                    Descargar factura
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TablaFacturacion;
