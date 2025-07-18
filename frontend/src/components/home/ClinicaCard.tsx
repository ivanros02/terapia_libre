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
    logo = "/clinica_home.jpg",
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
                className="d-flex flex-column align-items-center text-center p-4 w-100 w-md-75 w-lg-50"
                style={{
                    maxWidth: '1274px',
                    minHeight: '375px',
                    flexShrink: 0,
                    borderRadius: '49px',
                    border: '1px var(--verde) solid',
                    backgroundColor: 'white'
                }}
            >
                <img
                    src={logo}
                    alt="Logo clínica"
                    className="mb-2"
                    style={{
                        maxWidth: '436.25px',
                        height: '171px'
                    }}
                />

                <p className="service-text mb-3">
                    {servicios}
                </p>

                <h4 className="mb-3 title-text">
                    {titulo}
                </h4>

                <div className="d-flex flex-column flex-md-row gap-2 gap-md-4 mt-2 align-items-start align-items-md-center">
                    <div
                        className="d-flex align-items-center justify-content-start justify-content-md-center gap-2 cursor-pointer"
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
                        className="d-flex align-items-center justify-content-start justify-content-md-center gap-2 cursor-pointer"
                        onClick={handlePhoneClick}
                        style={{ cursor: 'pointer' }}
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