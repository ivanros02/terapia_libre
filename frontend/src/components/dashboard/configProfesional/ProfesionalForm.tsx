// ProfesionalForm.tsx
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from 'react-toastify';
import { getGoogleDriveImageUrl } from "../../../utils/googleDrive";
import { useEditProfessional } from "../../../hooks/formProfesional/useEditProfessional";
import { usePasswordChange } from "../../../hooks/formProfesional/usePasswordChange";
import PersonalDataSection from "../../registerProfesional/form-sections/PersonalDataSection";
import ProfessionalDataSection from "../../registerProfesional/form-sections/ProfessionalDataSection";
import DescriptionSection from "../../registerProfesional/form-sections/DescriptionSection";
import ValuesSection from "../../registerProfesional/form-sections/ValuesSection";
import PasswordChangeSection from "../../registerProfesional/form-sections/PasswordChangeSection";

const url = import.meta.env.VITE_API_BASE_URL;

interface Profesional {
    id_profesional: number;
    nombre: string;
    titulo_universitario: string;
    matricula_nacional: string;
    matricula_provincial?: string | null;
    descripcion?: string | null;
    telefono?: string | null;
    correo_electronico: string;
    foto_perfil_url?: string | null;
    valor: number;
    valor_internacional: number;
    cbu?: string | null;
    cuit?: string | null;
    condicion_fiscal?: string | null;
    creado_en: string;
    especialidades: {
        id_especialidad: number;
        nombre: string;
    }[];
}

interface ProfesionalFormProps {
    show: boolean;
    handleClose: () => void;
    profesional: Profesional | null;
    onSave: () => void;
    fetchProfesionalData: () => void;
}

function ProfesionalForm({ show, handleClose, profesional, onSave, fetchProfesionalData }: ProfesionalFormProps) {
    const {
        formData,
        selectedEspecialidades,
        handleChange,
        handleEspecialidadChange,
    } = useEditProfessional(profesional);

    const {
        passwordActual,
        nuevaPassword,
        confirmarPassword,
        mostrarPasswordForm,
        setPasswordActual,
        setNuevaPassword,
        setConfirmarPassword,
        togglePasswordForm,
        validatePasswords,
        getPasswordData,
        resetPasswords,
    } = usePasswordChange();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePasswords()) return;

        try {
            await axios.put(`${url}/api/profesionales/${profesional?.id_profesional}`, {
                ...formData,
                especialidades: selectedEspecialidades.map(Number),
                ...getPasswordData(),
            });

            toast.success("✅ Profesional actualizado correctamente");
            resetPasswords();
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
                    <PersonalDataSection
                        formData={formData}
                        onChange={handleChange}
                    />

                    <ProfessionalDataSection
                        formData={formData}
                        onChange={handleChange}
                        onEspecialidadChange={handleEspecialidadChange}
                    />

                    <DescriptionSection
                        formData={formData}
                        onChange={handleChange}
                        descripcionAviso=""
                        maxCaracteres={1000}
                    />

                    <ValuesSection
                        formData={formData}
                        onChange={handleChange}
                    />

                    {/* Vista previa de foto si existe */}
                    {formData.foto_perfil_url && (
                        <div className="text-center mt-3 mb-3">
                            <img
                                src={getGoogleDriveImageUrl(formData.foto_perfil_url)}
                                alt="Foto de perfil"
                                style={{ maxWidth: "100px", borderRadius: "50%" }}
                            />
                        </div>
                    )}

                    {/* Input para cambiar foto */}
                    <div className="mt-3 mb-3">
                        <Form.Group>
                            <Form.Label>URL de foto de perfil</Form.Label>
                            <Form.Control
                                type="text"
                                name="foto_perfil_url"
                                value={formData.foto_perfil_url || ''}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </Form.Group>
                    </div>

                    <PasswordChangeSection
                        passwordActual={passwordActual}
                        nuevaPassword={nuevaPassword}
                        confirmarPassword={confirmarPassword}
                        mostrarForm={mostrarPasswordForm}
                        onToggleForm={togglePasswordForm}
                        onPasswordActualChange={setPasswordActual}
                        onNuevaPasswordChange={setNuevaPassword}
                        onConfirmarPasswordChange={setConfirmarPassword}
                    />

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