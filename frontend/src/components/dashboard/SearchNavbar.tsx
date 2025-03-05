import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, FormControl, InputGroup, Navbar, Nav, Image } from "react-bootstrap";
import { FaSearch, FaBell, FaCommentDots, FaBars } from "react-icons/fa";

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

        <Navbar.Collapse id="navbar-content" className="justify-content-center">
          {/* Barra de búsqueda */}
          <Form className="d-flex" style={{ maxWidth: "500px", width: "100%" }}>
            <InputGroup>
              <FormControl type="search" placeholder="Buscar" className="rounded-pill mt-2" />
              <InputGroup.Text className="bg-white border-0 rounded-pill">
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </Form>

          {/* Íconos de mensajes y notificaciones */}
          <Nav className="align-items-center ms-3">
            <Nav.Link href="#" className="me-3 text-dark">
              <FaCommentDots size={20} />
            </Nav.Link>
            <Nav.Link href="#" className="me-3 text-dark">
              <FaBell size={20} />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        {/* Perfil del usuario con contenedor redondeado */}
        <div className="d-flex align-items-center bg-white rounded-pill px-2 py-1 shadow-sm">
          <Image
            src={profileImage} 
            roundedCircle
            width={40}
            height={40}
            className="me-2"
          />
          <span className="fw-bold">{profileName}</span>
        </div>
      </Container>
    </Navbar>
  );
};

export default SearchNavbar;
