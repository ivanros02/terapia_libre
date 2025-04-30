import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, FormControl, InputGroup, Navbar, Image } from "react-bootstrap";
import "../../styles/SearchNavbar.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface SearchNavbarProps {
  profileImage: string;
  profileName: string;
}


const SearchNavbar: React.FC<SearchNavbarProps> = ({ profileImage, profileName }) => {
  const navigate = useNavigate(); // ✅ ahora SÍ disponible

  const handleLogout = async () => {
    const confirmLogout = () => {
      const isGoogle = localStorage.getItem("isGoogleLogin") === "true";
      const googleToken = localStorage.getItem("google_token");

      if (isGoogle && googleToken) {
        fetch(`https://oauth2.googleapis.com/revoke?token=${googleToken}`, {
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        }).catch((error) => console.warn("Error al revocar token de Google:", error));
      }

      // Limpiar todo
      localStorage.clear();
      navigate("/login");
    };

    toast.info(
      <div className="d-flex flex-column align-items-center">
        <p className="mb-2">¿Seguro que querés cerrar sesión?</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              confirmLogout();
              toast.dismiss(); // Cerrar el toast
            }}
          >
            Sí, cerrar
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => toast.dismiss()} // Solo cierra el toast
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false, // ❗ Que no se cierre solo
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  return (
    <Navbar expand="lg" className="px-3 py-2 navbar-custom">
      <Container fluid>
        {/* Mensaje de "Buen día" solo visible en móviles */}
        <div className="d-lg-none me-auto">
          <span className="fw-bold">Buen día, <span style={{ color: "var(--naranja)" }}>{profileName}!</span></span>
        </div>

        {/* Barra de búsqueda al inicio (izquierda) */}
        <Form className="d-flex me-3 search-container" style={{ maxWidth: "700px", width: "100%" }}>
          <InputGroup>
            <FormControl
              type="search"
              placeholder="Buscar"
              className="search-bar"
            />
          </InputGroup>
        </Form>

        {/* Perfil del usuario */}
        <div className="d-flex align-items-center px-2 py-1 profile-wrapper" style={{ border: "1px solid #E5E5E5", borderRadius: "10px" }}>
          <div className="bg-white rounded-pill profile-container">
            <Image
              src={profileImage}
              roundedCircle
              width={40}
              height={40}
              onClick={handleLogout} // 🔥 Al hacer click en la imagen
              style={{ cursor: "pointer" }} // 🔥 Para mostrar el cursor de mano
            />
            {/* Nombre solo visible en desktop */}
            {/* Nombre solo visible en desktop */}
            <span className="fw-bold d-none d-lg-inline">{profileName}</span>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default SearchNavbar;
