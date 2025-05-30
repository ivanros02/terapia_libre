import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/Header.css";
const url = import.meta.env.VITE_API_BASE_URL;

type HeadProps = {
  description?: string;
  keywords?: string;
  links?: { name: string; href: string }[];
  onScrollToNeedTherapy?: () => void; // Agregamos la prop opcional
};

const Head: React.FC<HeadProps> = ({ description, keywords, links = [], onScrollToNeedTherapy }) => {
  const navigate = useNavigate(); // Hook para redireccionar
  const [usuario, setUsuario] = useState<{ nombre: string; esProfesional: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarioData = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        const esProfesional = localStorage.getItem("esProfesional") === "true"; // Convierte a booleano

        if (!id || !token) {
          throw new Error("No se encontró el ID o el token de autenticación.");
        }

        // Definir la URL según el tipo de usuario
        const apiEndpoint = esProfesional ? `${url}/api/profesionales/${id}` : `${url}/api/auth/usuario/${id}`;

        // Hacer la solicitud a la API
        const response = await axios.get(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsuario({ ...response.data, esProfesional }); // Guardar datos del usuario
      } catch (error: any) {
        setError(error.message || "Error al obtener los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarioData();
  }, []);

  // Función para redirigir al dashboard correcto
  const handleDashboardRedirect = () => {
    if (usuario) {
      const dashboardPath = usuario.esProfesional ? "/dashboard/profesional" : "/dashboard/usuario";
      navigate(dashboardPath);
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Terapia Libre</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom p-3 fixed-top shadow mb-5">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo (más grande en escritorio, más a la izquierda en móviles) */}
          <a className="navbar-brand d-flex align-items-center logo-container" href="/">
            <img src="/logo.png" alt="Logo" className="logo-img" />
            <span className="brand-text">Terapia Libre</span>
          </a>

          {/* Sección Atención Inmediata (Pantallas grandes: Original, Móviles: Ajustado) */}
          <div className="d-none d-lg-flex align-items-center">
            <img src="/atencion_psiquiatrica.png" alt="Atención Psiquiátrica" style={{ height: "70px", marginRight: "10px", paddingLeft: "10px" }} />
            <span style={{ color: "var(--naranja)", fontWeight: "bold" }}>
              <span style={{ fontSize: "0.9rem" }}>ATENCIÓN INMEDIATA</span>
              <br />
              <span style={{ fontSize: "2rem" }}>0810 666 3372</span>
            </span>
          </div>

          {/* En móviles: Todo en una línea, pero el número debajo */}
          <div className="d-lg-none d-flex flex-column align-items-center atencion-movil">
            <span className="atencion-text">ATENCIÓN INMEDIATA</span>
            <a href="tel:08106663372" className="atencion-numero">
              0810 666 3372
            </a>
          </div>

          {/* Botón de menú hamburguesa */}
          <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Enlaces de navegación */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {links.map((link, index) => (
                <li key={index} className="nav-item me-3">
                  {link.name === "¿Necesito terapia?" ? (
                    <a
                      className="nav-link text-secondary fs-5"
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        onScrollToNeedTherapy?.();
                      }}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <a className="nav-link text-secondary fs-5" href={link.href}>
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
              {/* Muestra "Hola, Nombre" y lo hace clickeable */}
              {loading ? (
                <li className="nav-item me-3">
                  <span className="nav-link text-secondary fs-5">Cargando...</span>
                </li>
              ) : usuario ? (
                <li className="nav-item me-3">
                  <span
                    className="nav-link fs-5 fw-bold"
                    style={{ color: "var(--verde)", cursor: "pointer" }}
                    onClick={handleDashboardRedirect} // Redirige al dashboard
                  >
                    Hola, {usuario.nombre}
                  </span>
                </li>
              ) : (
                <li className="nav-item me-3">
                  <a className="nav-link text-secondary fs-5" href="/login">
                    Iniciar Sesión
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </HelmetProvider>
  );
};

export default Head;