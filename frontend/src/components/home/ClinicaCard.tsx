import { Card } from "react-bootstrap";

interface ClinicaCardProps {
    titulo?: string;
    servicios?: string;
    contacto?: string;
    logo?: string;
}

const ClinicaCard: React.FC<ClinicaCardProps> = ({
    titulo = "Internación - Consultorios externos - Módulos de integración - Hospital de día",
    servicios = "admisiones@clinicacomunidadtandil.com +54 9 2494 34-0696",
    logo = "/clinica_home.jpg",
}) => {
    return (
        <div className="d-flex justify-content-center mb-5 px-2 px-md-3">
            <Card
                className="d-flex flex-column align-items-center text-center p-4 w-100 w-md-75 w-lg-50"
                style={{
                    maxWidth: '1274px',
                    height: '375px',
                    flexShrink: 0,
                    borderRadius: '57px',
                    border: '1px var(--verde) solid',
                    backgroundColor: 'white'
                }}
            >
                <img
                    src={logo}
                    alt="Logo clínica"
                    className="mb-3 mt-2"
                    style={{
                        maxWidth: '436.25px',
                        height: '171px'
                    }}
                />

                <h4 className="mb-3 fs-6 fs-md-5 mt-2" style={{
                    fontWeight: '600',
                    color: '#333'
                }}>
                    {titulo}
                </h4>

                <div className="text-center mt-2" style={{ color: '#666' }}>
                    <p className="mb-2 fs-6 fs-md-5" style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                    }}>
                        {servicios}
                    </p>
                </div>

            </Card>
        </div>
    );
};

export default ClinicaCard;