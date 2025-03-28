
interface SuscripcionInfoProps {
    email: string; // ✅ Ahora recibe el email
}

const SuscripcionInfo: React.FC<SuscripcionInfoProps> = () => {

    return (
        <div className="subscription-container p-3 shadow-sm rounded-3 d-flex flex-column align-items-center w-100">
            <a
                href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c938084955cc4800195a48f3aa61f98"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
            >
                Suscribirme
            </a>
        </div>
    );
};

export default SuscripcionInfo;
