import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
const url = import.meta.env.VITE_API_BASE_URL;
interface Props {
    show: boolean;
    onClose: () => void;
    cupon: Cupon | null; // nuevo
}
interface Cupon {
    codigo: string;
    descripcion: string;
    descuento: number;
    activo: boolean;
    solo_una_vez: boolean;
    dado_por?: string;
}


const ModalFormularioCupon: React.FC<Props> = ({ show, onClose, cupon }) => {
    const [form, setForm] = useState({
        codigo: "",
        descripcion: "",
        descuento: "",
        activo: true,
        solo_una_vez: true,
        dado_por: "",
    });

    useEffect(() => {
        if (cupon) {
            setForm({
                ...cupon,
                descuento: String(cupon.descuento * 100), // para mostrarlo como 60, no 0.6
                dado_por: cupon.dado_por || "",
            });
        } else {
            setForm({
                codigo: "",
                descripcion: "",
                descuento: "",
                activo: true,
                solo_una_vez: true,
                dado_por: "",
            });
        }
    }, [cupon]);


    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, type, value, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };


    const handleSubmit = async () => {
        const { codigo, descripcion, descuento, dado_por } = form;

        if (!codigo || !descripcion || !descuento || !dado_por) {
            toast.error("Por favor completá todos los campos obligatorios.");
            return;
        }

        const token = localStorage.getItem("adminToken");
        if (!token) {
            console.error("⚠️ No hay token disponible");
            return;
        }

        try {
            const formateado = {
                ...form,
                descuento: parseFloat(form.descuento) / 100,
            };

            const token = localStorage.getItem("adminToken");

            if (cupon) {
                // editar
                await axios.put(`${url}/api/admin/cupones/${form.codigo}`, formateado, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Cupón actualizado");
            } else {
                // crear
                await axios.post(`${url}/api/admin/cupones`, formateado, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Cupón creado");
            }

            onClose();
        } catch (err) {
            toast.error("Error al guardar el cupón");
            console.error(err);
        }

    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Cupón</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Nombre del cupon</Form.Label>
                        <Form.Control name="codigo" value={form.codigo} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control name="descripcion" value={form.descripcion} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Descuento (%)</Form.Label>
                        <Form.Control
                            type="number"
                            step="1"
                            min="1"
                            max="100"
                            name="descuento"
                            value={form.descuento}
                            onChange={handleChange}
                            required
                        />
                        <Form.Text muted>
                            Ingresá el valor como porcentaje. Por ejemplo, escribí <strong>60</strong> para un 60% de descuento.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Creado por</Form.Label>
                        <Form.Control name="dado_por" value={form.dado_por} onChange={handleChange} />
                        <Form.Text muted>
                            Creador del cupon.
                        </Form.Text>
                    </Form.Group>
                    <Form.Check type="checkbox" label="Activo" name="activo" checked={form.activo} onChange={handleChange} />
                    <Form.Check type="checkbox" label="Solo una vez" name="solo_una_vez" checked={form.solo_una_vez} onChange={handleChange} />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalFormularioCupon;
