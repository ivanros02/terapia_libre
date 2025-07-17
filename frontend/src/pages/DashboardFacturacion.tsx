import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
const url = import.meta.env.VITE_API_BASE_URL;
import { getGoogleDriveImageUrl } from "../utils/googleDrive";
import '../styles/DashboardFacturacion.css';
import TablaFacturacion from "../components/dashboard/TablaFacturacion";

interface Session {
    id: string;
    date: string;
    time: string;
    patient: string;
    value: number;
    status: 'cancelada' | 'completada' | 'pendiente';
    detail?: string;
}

interface UserData {
    nombre: string;
    correo_electronico: string;
    foto_perfil_url?: string;
}

const DashboardFacturacion = () => {
    const [activeFilter, setActiveFilter] = useState('todas');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [userData, setUserData] = useState<UserData | null>(null);
    const esProfesional = localStorage.getItem("esProfesional") === "true";
    const [, setError] = useState<string | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string>('');
    const handleFileUpload = (sessionId: string) => {
        setCurrentSessionId(sessionId);
        fileInputRef.current?.click();
    };
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        const fetchUserData = async () => {
            try {
                if (!id || !token) {
                    throw new Error("No se encontró el ID o el token de autenticación.");
                }

                const apiUrl = esProfesional
                    ? `${url}/api/profesionales/${id}`
                    : `${url}/api/auth/usuario/${id}`;

                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
            } catch (error: any) {
                setError(error.message || "Error al obtener los datos.");
            }
        };

        fetchUserData();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [id, token, esProfesional]);

    const mapearEstado = (estado: string) => {
        const estadoLower = estado?.toLowerCase();
        switch (estadoLower) {
            case 'pendiente':
            case 'confirmado':
                return 'pendiente';
            case 'completado':
                return 'completada';
            case 'cancelado':
                return 'cancelada';
            default:
                return 'pendiente';
        }
    };

    const formatDateForMobile = (dateString: string) => {
        const [day, month] = dateString.split('/');
        return `${day}/${month}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = localStorage.getItem("id");
                if (!id) throw new Error("No se encontró el ID.");

                const turnosResponse = await axios.get(
                    esProfesional
                        ? `${url}/api/turnos/profesional/${id}`
                        : `${url}/api/turnos/usuario/${id}`
                );

                const formattedSessions = turnosResponse.data.map((turno: any) => ({
                    id: turno.id_turno,
                    date: turno.fecha_turno.split('T')[0].split('-').reverse().join('/'),
                    time: turno.hora_turno.slice(0, 5),
                    patient: esProfesional
                        ? (turno.nombre_paciente || 'Sin nombre')
                        : (turno.nombre_profesional || 'Sin nombre'),
                    value: turno.valor || turno.precio,
                    status: mapearEstado(turno.estado),
                    detail: turno.factura_filename ? 'Ver factura' : null
                }));

                setSessions(formattedSessions);
            } catch (error: any) {
                setError(error.response?.data?.message || "Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [esProfesional]);

    const handleDownloadInvoice = (sessionId: string, sessionDate: string) => {
        // Convertir de DD/MM/YYYY a YYYY/MM
        const [_, month, year] = sessionDate.split('/');
        const formattedDate = `${year}/${month.padStart(2, '0')}`;

        window.open(`${url}/api/facturas/${formattedDate}/turno_${sessionId}_factura.pdf`, '_blank');
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !currentSessionId) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('factura', file);
            formData.append('id_turno', currentSessionId);

            // Encontrar la fecha del turno actual
            const currentSession = sessions.find(s => s.id === currentSessionId);
            if (currentSession) {
                formData.append('fecha_turno', currentSession.date); // DD/MM/YYYY
            }

            await axios.post(`${url}/api/turnos/factura/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            window.location.reload();
        } catch (error) {
            console.error('Error al subir factura:', error);
            alert('Error al subir la factura');
        } finally {
            setUploading(false);
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

    const filteredSessions = sessions.filter(session => {
        const matchesFilter = activeFilter === 'todas' ||
            (activeFilter === 'próximas' && session.status === 'pendiente') ||
            (activeFilter === 'completadas' && session.status === 'completada') ||
            (activeFilter === 'canceladas' && session.status === 'cancelada');

        const matchesSearch = session.patient?.toLowerCase().includes(search.toLowerCase()) || false;

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

    if (loading) return <LoadingSpinner />;

    return (
        <div className="parent">
            {/* Sidebar solo en pantallas grandes */}
            {!isMobile && <div className="div-side-bar"><Sidebar /></div>}

            <div className="div-search-navbar">
                <SearchNavbar
                    profileImage={getGoogleDriveImageUrl(userData?.foto_perfil_url || "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png")}
                    profileName={userData?.nombre || (esProfesional ? "Profesional" : "Usuario")} />
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
                            <div className="header-cell">{esProfesional ? 'Paciente' : 'Profesional'}</div>
                            <div className="header-cell">Valor</div>
                            <div className="header-cell">Estado</div>
                            <div className="header-cell">Detalle</div>
                        </div>

                        <TablaFacturacion
                            sessions={filteredSessions}
                            isMobile={isMobile}
                            uploading={uploading}
                            expandedSessions={expandedSessions}
                            esProfesional={esProfesional}
                            toggleExpanded={toggleExpanded}
                            formatValue={formatValue}
                            getStatusDisplay={getStatusDisplay}
                            handleFileUpload={handleFileUpload}
                            handleDownloadInvoice={handleDownloadInvoice}
                            formatDateForMobile={formatDateForMobile}
                        />
                    </div>
                </div>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default DashboardFacturacion;