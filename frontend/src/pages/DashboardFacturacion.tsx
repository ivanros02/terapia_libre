import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
const url = import.meta.env.VITE_API_BASE_URL;
import '../styles/DashboardFacturacion.css';

interface Session {
    id: string;
    date: string;
    time: string;
    patient: string;
    value: number;
    status: 'cancelada' | 'completada' | 'pendiente';
    detail?: string;
}


const DashboardFacturacion = () => {
    const [activeFilter, setActiveFilter] = useState('todas');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [profesionalData, setProfesionalData] = useState<any>(null);
    const esProfesional = localStorage.getItem("esProfesional") === "true";
    const [, setError] = useState<string | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleDownloadInvoice = () => {
        console.log('Descargando factura...');
        // Aquí puedes implementar la lógica de descarga
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('Archivo seleccionado:', file.name);
            // Aquí puedes hacer lo que necesites con el archivo
        }
    };

    const toggleExpanded = (sessionId: string) => {
        const newExpanded = new Set(expandedSessions);
        if (newExpanded.has(sessionId)) {
            newExpanded.delete(sessionId);
        } else {
            newExpanded.add(sessionId);
        }
        setExpandedSessions(newExpanded);
    };


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const id = localStorage.getItem("id");
                if (!id) {
                    throw new Error("No se encontró el ID del profesional.");
                }

                const [profesionalResponse, sesionesResponse] = await Promise.all([
                    axios.get(`${url}/api/profesionales/${id}`),
                    axios.get(`${url}/api/profesionales/${id}/sesiones`)
                ]);

                setProfesionalData(profesionalResponse.data);
                setSessions(sesionesResponse.data);
            } catch (error: any) {
                setError(error.response?.data?.message || "Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const filteredSessions = sessions.filter(session => {
        const matchesFilter = activeFilter === 'todas' ||
            (activeFilter === 'próximas' && session.status === 'pendiente') ||
            (activeFilter === 'completadas' && session.status === 'completada') ||
            (activeFilter === 'canceladas' && session.status === 'cancelada');

        const matchesSearch = session.patient.toLowerCase().includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const formatValue = (value: number) => `$${value.toLocaleString()}`;

    const getStatusDisplay = (status: string) => {
        const statusMap = {
            cancelada: 'Cancelada',
            completada: 'Completada',
            pendiente: 'Pendiente'
        };
        return statusMap[status as keyof typeof statusMap] || status;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const id = localStorage.getItem("id");
                if (!id) {
                    throw new Error("No se encontró el ID del profesional.");
                }

                // 🔹 Obtener datos del profesional
                const profesionalResponse = await axios.get(`${url}/api/profesionales/${id}`);
                setProfesionalData(profesionalResponse.data);


            } catch (error: any) {
                setError(error.response?.data?.message || "Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    if (loading) return <LoadingSpinner />;

    return (
        <div className="parent">
            {/* Sidebar solo en pantallas grandes */}
            {!isMobile && <div className="div-side-bar"><Sidebar /></div>}

            <div className="div-search-navbar">
                <SearchNavbar
                    profileImage="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                    profileName={profesionalData?.nombre || "Profesional"} // Usar el nombre del profesional
                />
            </div>

            <div className="div-centrado-solo" style={{ backgroundColor: "#F8F8F8", borderRadius: "25px", marginTop: "-7rem" }}>
                <div className="sessions-container">
                    <div className="sessions-header">
                        <h1 className="session-title">Sesiones</h1>
                        <div className="filters-and-search">
                            {isMobile ? (
                                <>
                                    <div className="search-container">
                                        <img src="/sidebar/search_facturacion.png" alt="" className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="search-input"
                                        />
                                    </div>
                                    <div className="filters">
                                        {['todas', 'próximas', 'completadas', 'canceladas'].map(filter => (
                                            <button
                                                key={filter}
                                                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                                onClick={() => setActiveFilter(filter)}
                                            >
                                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="filters">
                                        {['todas', 'próximas', 'completadas', 'canceladas'].map(filter => (
                                            <button
                                                key={filter}
                                                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                                                onClick={() => setActiveFilter(filter)}
                                            >
                                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="search-container">
                                        <img src="/sidebar/search_facturacion.png" alt="" className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder="Buscar"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="search-input"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                    </div>

                    <div className="table-container">
                        <div className="table-header">
                            <div className="header-cell">Fecha</div>
                            <div className="header-cell">Hora</div>
                            <div className="header-cell">Paciente</div>
                            <div className="header-cell">Valor</div>
                            <div className="header-cell">Estado</div>
                            <div className="header-cell">Detalle</div>
                        </div>

                        <div className="table-body">
                            {filteredSessions.map(session => (
                                <div key={session.id} className="table-row-container">
                                    <div className="table-row">
                                        {isMobile ? (
                                            <>
                                                <div className="cell">{session.patient}</div>
                                                <div className="cell">{session.date} - {session.time}</div>
                                                <div className="cell">
                                                    <button
                                                        className="expand-btn"
                                                        onClick={() => toggleExpanded(session.id)}
                                                    >
                                                        {expandedSessions.has(session.id) ? '▲' : '▼'}
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
                                                    {session.detail ? (
                                                        <button
                                                            className="detail-link"
                                                            onClick={esProfesional ? handleFileUpload : handleDownloadInvoice}
                                                        >
                                                            {esProfesional ? session.detail : 'Descargar factura'}
                                                        </button>
                                                    ) : (
                                                        '-'
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
                                                <span>Pagó: {formatValue(session.value)}</span>
                                            </div>
                                            {session.detail && (
                                                <button
                                                    className="detail-link"
                                                    onClick={esProfesional ? handleFileUpload : handleDownloadInvoice}
                                                >
                                                    {esProfesional ? session.detail : 'Descargar factura'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default DashboardFacturacion;