import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, FormControl, InputGroup, Navbar, Image } from "react-bootstrap";
import "../../styles/SearchNavbar.css";
interface SearchNavbarProps {
  profileImage: string;
  profileName: string;
}

const SearchNavbar: React.FC<SearchNavbarProps> = ({ profileImage, profileName }) => {
  return (
    <Navbar expand="lg" className="px-3 py-2 fixed-top navbar-custom">
      <Container fluid>
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

        {/* Perfil del usuario con contenedor redondeado */}
        <div className="d-flex align-items-center px-2 py-1 ">
          <div className="bg-white rounded-pill profile-container">
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
