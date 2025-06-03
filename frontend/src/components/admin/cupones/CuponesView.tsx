import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Spinner } from "react-bootstrap";
import ModalFormularioCupon from "./ModalFormularioCupon";
import { toast } from "react-toastify";
const url = import.meta.env.VITE_API_BASE_URL;
interface Cupon {
    codigo: string;
    descripcion: string;
    descuento: number;
    activo: boolean;
    solo_una_vez: boolean;
    dado_por?: string;
}

const CuponesView = () => {
    const [cupones, setCupones] = useState<Cupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [cuponActual, setCuponActual] = useState<Cupon | null>(null);

    const fetchCupones = async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            console.error("⚠️ No hay token disponible");
            return;
        }

        try {
            const res = await axios.get(`${url}/api/admin/cupones`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCupones(res.data || []);

        } catch (err) {
            toast.error("Error al cargar cupones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCupones();
    }, []);

    const handleEditar = (cupon: Cupon) => {
        setCuponActual(cupon);
        setShowModal(true);
    };


    const handleEliminar = async (codigo: string) => {
        if (!window.confirm(`¿Eliminar el cupón ${codigo}?`)) return;

        try {
            const token = localStorage.getItem("adminToken");
            await axios.delete(`${url}/api/admin/cupones/${codigo}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Cupón eliminado");
            fetchCupones();
        } catch (error) {
            toast.error("Error al eliminar cupón");
            console.error(error);
        }
    };


    const handleNuevo = () => {
        setCuponActual(null); // limpio datos
        setShowModal(true);
    };


    const handleClose = () => {
        setShowModal(false);
        fetchCupones(); // Recargar después de agregar
    };

    if (loading) return <Spinner animation="border" />;

    return (
        <>
            <div className="container-fluid px-3 py-2">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
                    <h4 className="mb-0">Cupones</h4>
                    <Button onClick={handleNuevo}>Crear Cupón</Button>
                </div>

                <div className="table-responsive">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Descripción</th>
                                <th>Descuento</th>
                                <th>Activo</th>
                                <th>Solo una vez</th>
                                <th>Otorgado por</th>
                                <th>Acciones</th> {/* ✅ nueva columna */}
                            </tr>
                        </thead>
                        <tbody>
                            {cupones.map((cupon) => (
                                <tr key={cupon.codigo}>
                                    <td>{cupon.codigo}</td>
                                    <td style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{cupon.descripcion}</td>
                                    <td>{cupon.descuento * 100}%</td>
                                    <td>{cupon.activo ? "Sí" : "No"}</td>
                                    <td>{cupon.solo_una_vez ? "Sí" : "No"}</td>
                                    <td>{cupon.dado_por}</td>
                                    <td className="d-flex gap-1 flex-wrap">
                                        <Button size="sm" variant="warning" onClick={() => handleEditar(cupon)}>Editar</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleEliminar(cupon.codigo)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                </div>

                <ModalFormularioCupon
                    show={showModal}
                    onClose={handleClose}
                    cupon={cuponActual} // ✅ nuevo prop
                />

            </div>
        </>
    );
};

export default CuponesView;
