import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import EspecialidadSelectEditable from "../EspecialidadSelectEditable";
import { toast } from 'react-toastify';
import { getGoogleDriveImageUrl } from "../../../utils/googleDrive";

interface Profesional {
    id_profesional: number;
    nombre: string;
    titulo_universitario: string;
    matricula_nacional: string;
    matricula_provincial?: string | null;
    descripcion?: string | null;
    telefono?: string | null;
    disponibilidad: "24 horas" | "48 horas" | "72 horas" | "96 horas";
    correo_electronico: string;
    foto_perfil_url?: string | null;
    valor: number;
    valor_internacional: number;
    creado_en: string;
    especialidades: {
        id_especialidad: number;
        nombre: string;
    }[];
}

const url = import.meta.env.VITE_API_BASE_URL;

interface ProfesionalFormProps {
    show: boolean;
    handleClose: () => void;
    profesional: Profesional | null;
    onSave: () => void;
    fetchProfesionalData: () => void;
}

function ProfesionalForm({ show, handleClose, profesional, onSave, fetchProfesionalData }: ProfesionalFormProps) {
    const [formData, setFormData] = useState<Profesional>({
        id_profesional: 0,
        nombre: "",
        titulo_universitario: "",
        matricula_nacional: "",
        matricula_provincial: "",
        descripcion: "",
        telefono: "",
        disponibilidad: "24 horas",
        correo_electronico: "",
        foto_perfil_url: "",
        valor: 0.0,
        valor_internacional: 0.0,
        creado_en: "",
        especialidades: []
    });

    const [, setEspecialidadesDisponibles] = useState<{ id_especialidad: number; nombre: string }[]>([]);

    const [selectedEspecialidades, setSelectedEspecialidades] = useState<number[]>([]);
    const [passwordActual, setPasswordActual] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [mostrarPasswordForm, setMostrarPasswordForm] = useState(false);


    // 🔹 Cargar especialidades disponibles al montar el componente
    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                const response = await axios.get<{ id_especialidad: number; nombre: string }[]>(`${url}/api/especialidades`);
                setEspecialidadesDisponibles(response.data);
                console.log("✅ Especialidades disponibles:", response.data);
            } catch (error) {
                console.error("❌ Error al cargar especialidades", error);
            }
        };

        fetchEspecialidades();
    }, []);

    // 🔹 Cargar datos del profesional cuando el modal se abre
    useEffect(() => {
        if (profesional && show) {
            const especialidadesIDs = profesional.especialidades.map(e => e.id_especialidad);

            setFormData(profesional); // ✅
            setSelectedEspecialidades(especialidadesIDs);

        }
    }, [profesional, show]);





    // 🔹 Manejo de cambios en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // 🔹 Guardar cambios en la API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {

            if (nuevaPassword || confirmarPassword || passwordActual) {
                if (!passwordActual || !nuevaPassword || !confirmarPassword) {
                    toast.error("❌ Completá todos los campos para cambiar la contraseña");
                    return;
                }
                if (nuevaPassword !== confirmarPassword) {
                    toast.error("❌ Las contraseñas nuevas no coinciden");
                    return;
                }
            }

            await axios.put(`${url}/api/profesionales/${profesional?.id_profesional}`, {
                ...formData,
                especialidades: selectedEspecialidades.map(Number),
                password_actual: passwordActual || undefined,
                nueva_password: nuevaPassword || undefined
            });


            toast.success("✅ Profesional actualizado correctamente");

            onSave();
            fetchProfesionalData();
            handleClose();
        } catch (error) {
            console.error("❌ Error al actualizar datos del profesional", error);
            toast.error("❌ Error al actualizar profesional");
        }
    };


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Datos del Profesional</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>URL de la Foto de Perfil</Form.Label>
                        <Form.Control
                            type="text"
                            name="foto_perfil_url"
                            value={formData.foto_perfil_url ?? ""}
                            onChange={handleChange}
                            placeholder="Pegá aquí el enlace de la foto (por ejemplo, de Google Drive)"
                        />
                    </Form.Group>
                    {formData.foto_perfil_url && (
                        <div className="text-center mt-3">
                            <img
                                src={getGoogleDriveImageUrl(formData.foto_perfil_url)}
                                alt="Foto de perfil"
                                style={{ maxWidth: "100px", borderRadius: "50%" }}
                            />
                        </div>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Título Universitario</Form.Label>
                        <Form.Control type="text" name="titulo_universitario" value={formData.titulo_universitario} onChange={handleChange} />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Matrícula Nacional</Form.Label>
                        <Form.Control type="text" name="matricula_nacional" value={formData.matricula_nacional} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Matrícula Provincial</Form.Label>
                        <Form.Control
                            type="text"
                            name="matricula_provincial"
                            value={formData.matricula_provincial ?? ""}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Valor</Form.Label>
                        <Form.Control
                            type="number"
                            name="valor"
                            value={formData.valor}
                            onChange={handleChange}
                            step="0.01"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Valor Internacional</Form.Label>
                        <Form.Control
                            type="number"
                            name="valor_internacional"
                            value={formData.valor_internacional}
                            onChange={handleChange}
                            step="0.01"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control as="textarea" name="descripcion" value={formData.descripcion ?? ""} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control type="text" name="telefono" value={formData.telefono ?? ""} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Disponibilidad</Form.Label>
                        <Form.Select name="disponibilidad" value={formData.disponibilidad} onChange={handleChange}>
                            <option value="24 horas">24 horas</option>
                            <option value="48 horas">48 horas</option>
                            <option value="72 horas">72 horas</option>
                            <option value="96 horas">96 horas</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Especialidades</Form.Label>
                        <EspecialidadSelectEditable
                            selectedEspecialidades={selectedEspecialidades}
                            onChange={(selected) => {
                                setSelectedEspecialidades(selected);
                            }}
                        />
                    </Form.Group>

                    <Button
                        variant="outline-secondary"
                        className="mb-5"
                        onClick={() => setMostrarPasswordForm(!mostrarPasswordForm)}
                    >
                        {mostrarPasswordForm ? "Cancelar cambio de contraseña" : "¿Cambiar contraseña?"}
                    </Button>

                    {mostrarPasswordForm && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña actual</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={passwordActual}
                                    onChange={(e) => setPasswordActual(e.target.value)}
                                    placeholder="Ingresá tu contraseña actual"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nueva contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={nuevaPassword}
                                    onChange={(e) => setNuevaPassword(e.target.value)}
                                    placeholder="Nueva contraseña"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirmar nueva contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmarPassword}
                                    onChange={(e) => setConfirmarPassword(e.target.value)}
                                    placeholder="Confirmá la nueva contraseña"
                                />
                            </Form.Group>
                        </>
                    )}

                    

                    <Button
                        type="submit"
                        style={{
                            backgroundColor: "var(--naranja)",
                            borderColor: "var(--naranja)",
                            paddingLeft: "20px",
                            paddingRight: "20px",
                            color: "white"
                        }}
                        variant="success"
                    >
                        Guardar
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ProfesionalForm;
