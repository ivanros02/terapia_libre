import { Card } from "react-bootstrap";
import '../../styles/ClinicaCard.css';

interface ClinicaCardProps {
    titulo?: string;
    servicios?: string;
    email?: string;
    telefono?: string;
    logo?: string;
}

const ClinicaCard: React.FC<ClinicaCardProps> = ({
    titulo = "Internación - Consultorios externos - Módulos de integración - Hospital de día",
    servicios = "32 años brindando servicios de Salud Mental",
    email = "admisiones@clinicacomunidadtandil.com",
    telefono = "+54 9 2494 34-0696",
    logo = "/clinica_home.png",
}) => {
    const handleEmailClick = () => {
        window.location.href = `mailto:${email}`;
    };

    const handlePhoneClick = () => {
        window.location.href = `tel:${telefono}`;
    };

    return (
        <div className="d-flex justify-content-center mb-5 px-2 px-md-3">
            <Card
                className="d-flex flex-column align-items-start align-items-md-center text-start text-md-center p-3 p-md-4 clinica-card"
                style={{
                    flexShrink: 0,
                    border: '1px var(--verde) solid',
                    backgroundColor: 'white'
                }}
            >
                <img
                    src={logo}
                    alt="Logo clínica"
                    className="mb-0 mb-md-1 align-self-start align-self-md-center logo-clinica" 
                />

                <p className="service-text mb-1 mb-md-3 text-start text-md-center service-overlay">
                    {servicios}
                </p>

                <h4 className="mb-4 mb-md-3 title-text text-start text-md-center">
                    {titulo}
                </h4>

                <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-md-5">
                    <div
                        className="d-flex align-items-center justify-content-start justify-content-md-center gap-2 cursor-pointer contact-align-left"
                        onClick={handleEmailClick}
                        style={{ cursor: 'pointer' }}
                    >
                        <img
                            src="/publi_home/letter.png"
                            alt="Email"
                            className="icon-responsive"
                        />
                        <span className="contact-text">
                            {email}
                        </span>
                    </div>

                    <div
                        className="d-flex align-items-center justify-content-start justify-content-md-center gap-2 cursor-pointer contact-align-left"
                        onClick={handlePhoneClick}
                    >
                        <img
                            src="/publi_home/phone.png"
                            alt="Teléfono"
                            className="icon-responsive"
                        />
                        <span className="contact-text">
                            {telefono}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ClinicaCard;