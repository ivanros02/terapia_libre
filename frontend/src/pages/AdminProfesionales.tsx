import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Spinner, ButtonGroup } from "react-bootstrap";
import ProfesionalesView from "../components/admin/ProfesionalesView";
import CuponesView from "../components/admin/CuponesView";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [vista, setVista] = useState<"profesionales" | "cupones">("profesionales");

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin-login");
        } else {
            setLoading(false);
        }
    }, [navigate]);

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    }

    return (
        <Container>
            <h2 className="my-4">Panel de Administración</h2>

            <ButtonGroup className="mb-4">
                <Button
                    variant={vista === "profesionales" ? "primary" : "outline-primary"}
                    onClick={() => setVista("profesionales")}
                >
                    Profesionales
                </Button>
                <Button
                    variant={vista === "cupones" ? "primary" : "outline-primary"}
                    onClick={() => setVista("cupones")}
                >
                    Cupones
                </Button>
            </ButtonGroup>

            {vista === "profesionales" && <ProfesionalesView />}
            {vista === "cupones" && <CuponesView />}
        </Container>
    );
};

export default AdminDashboard;
