import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, FormControl, InputGroup, Navbar, Nav, Image } from "react-bootstrap";
import {FaBell, FaCommentDots, FaBars } from "react-icons/fa";

interface SearchNavbarProps {
  profileImage: string;
  profileName: string;
}

const SearchNavbar: React.FC<SearchNavbarProps> = ({ profileImage, profileName }) => {
  return (
    <Navbar bg="light" expand="lg" className="px-3 py-2 shadow-sm fixed-top" style={{ marginLeft: "80px" }}>
      <Container fluid>
        {/* Botón de hamburguesa para móviles */}
        <Navbar.Toggle aria-controls="navbar-content" className="border-0">
          <FaBars size={20} />
        </Navbar.Toggle>

        {/* Barra de búsqueda al inicio (izquierda) */}
        <Form className="d-flex me-3" style={{ maxWidth: "700px", width: "100%" }}>
          <InputGroup>
            <FormControl
              type="search"
              placeholder="Buscar"
              className="rounded-pill border-end-0" // Elimina el borde derecho para que se una con la lupa
            />
          </InputGroup>
        </Form>

        {/* Perfil del usuario con contenedor redondeado */}
        <div className="d-flex align-items-center px-2 py-1"> 
          {/* Íconos de mensajes y notificaciones más cerca del perfil */}
          <Nav className="align-items-center ms-2"> {/* Reducir el margen izquierdo */}
            <Nav.Link href="#" className="me-2 text-dark"> {/* Reducir el margen derecho */}
              <FaCommentDots size={20} />
            </Nav.Link>
            <Nav.Link href="#" className="me-2 text-dark"> {/* Reducir el margen derecho */}
              <FaBell size={20} />
            </Nav.Link>
          </Nav>
          <div className="bg-white rounded-pill">
            <Image
              src={profileImage}
              roundedCircle
              width={40}
              height={40}
              className="me-2"
            />
            <span className="fw-bold">{profileName}</span>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default SearchNavbar;
