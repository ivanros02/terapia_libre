import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, FormControl, InputGroup, Navbar, Image } from "react-bootstrap";
import "../../styles/SearchNavbar.css";
interface SearchNavbarProps {
  profileImage: string;
  profileName: string;
}

const SearchNavbar: React.FC<SearchNavbarProps> = ({ profileImage, profileName }) => {
  return (
    <Navbar expand="lg" className="px-3 py-2 navbar-custom">
      <Container fluid>
        {/* Mensaje de "Buen día" solo visible en móviles */}
        <div className="d-lg-none me-auto">
          <span className="fw-bold">Buen día, <span style={{color:"var(--naranja)"}}>{profileName}!</span></span>
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
            />
            {/* Nombre solo visible en desktop */}
            <span className="fw-bold d-none d-lg-inline">{profileName}</span>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default SearchNavbar;
