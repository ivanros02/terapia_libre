import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import EditarUsuario from "../components/dashboard/EditarUsuario";
const url = import.meta.env.VITE_API_BASE_URL;
import "../styles/DashboardProfesional.css"
import "../styles/DashboardUsuarioConfig.css";
import { getGoogleDriveImageUrl } from "../utils/googleDrive";
import { Button, Container, Row, Col } from "react-bootstrap";

// Tipos de datos
interface UserData {
    nombre: string;
    correo_electronico: string;
    foto_perfil_url?: string;
}

const Dashboard = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalShow, setModalShow] = useState(false); // 🔹 Estado para el modal
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    // Detectar si es profesional o usuario
    const esProfesional = localStorage.getItem("esProfesional") === "true";
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserData = async () => {
            try {


                if (!id || !token) {
                    throw new Error("No se encontró el ID o el token de autenticación.");
                }

                // Determinar la API correcta según el tipo de usuario
                const apiUrl = esProfesional
                    ? `${url}/api/profesionales/${id}`  // Si es profesional, obtiene su info
                    : `${url}/api/auth/usuario/${id}`; // Si es usuario, obtiene su info

                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
            } catch (error: any) {
                setError(error.message || "Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [esProfesional]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="parent">
            {!isMobile && <div className="div-side-bar"><Sidebar /></div>}
            <div className="div-search-navbar"><SearchNavbar
                profileImage={getGoogleDriveImageUrl(userData?.foto_perfil_url || "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png")}
                profileName={userData?.nombre || (esProfesional ? "Profesional" : "Usuario")}
            /></div>

            <div className="div-centrado-solo">{/* Contenedor centrado */}
                <Container
                    className="d-flex flex-column justify-content-center align-items-center"
                    style={{ minHeight: "50vh" }}
                >
                    <Row className="w-100 text-center">
                        <Col>
                            <h2 className="titulo-config">Perfil de Usuario</h2>
                            <p className="text-muted">{userData?.correo_electronico}</p>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                        <Col className="text-center">
                            {/* 🔹 Botón centrado y responsivo */}
                            <Button variant="primary" onClick={() => setModalShow(true)} className="px-4 py-2 btn-edit">
                                Editar Perfil
                            </Button>
                        </Col>
                    </Row>
                </Container>

                {/* 🔹 Modal de edición */}
                <EditarUsuario
                    userId={id ? parseInt(id, 10) : 0}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                /></div>

        </div>
    );
};

export default Dashboard;
