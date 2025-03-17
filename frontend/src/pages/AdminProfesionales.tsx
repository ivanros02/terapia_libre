import { Container } from "react-bootstrap";
import ProfesionalesListaAdmin from "../components/ProfesionalesListaAdmin";

const AdminProfesionales = () => {
  return (
    <Container>
      <h2 className="my-4">Administración de Profesionales</h2>
      <ProfesionalesListaAdmin />
    </Container>
  );
};

export default AdminProfesionales;
