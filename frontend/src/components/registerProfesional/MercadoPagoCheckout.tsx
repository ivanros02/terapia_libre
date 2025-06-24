import React, { useState } from 'react';

interface MercadoPagoCheckoutProps {
    userEmail: string | null;
    onSuccess: () => void;
    onError: () => void;
}

const MercadoPagoCheckout: React.FC<MercadoPagoCheckoutProps> = ({ 
    userEmail, 
    onSuccess, 
    onError 
}) => {
    const [loading, setLoading] = useState(true);
    // test '2c9380848f81302d018f81f9c2da004b' produccion '2c938084955cc4800195a48f3aa61f98'
    const subscriptionUrl = `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848f81302d018f81f9c2da004b&external_reference=${userEmail}`;

    const handleIframeLoad = () => {
        setLoading(false);
    };

    // Escuchar mensajes del iframe para detectar éxito/error
    React.useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'https://www.mercadopago.com.ar') return;
            
            if (event.data?.type === 'payment_success') {
                onSuccess();
            } else if (event.data?.type === 'payment_error') {
                onError();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onSuccess, onError]);

    return (
        <div className="mercadopago-checkout" style={{ height: '600px', position: 'relative' }}>
            {loading && (
                <div className="text-center p-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando checkout...</p>
                </div>
            )}
            
            <iframe
                src={subscriptionUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                onLoad={handleIframeLoad}
                style={{ 
                    border: 'none',
                    borderRadius: '8px',
                    display: loading ? 'none' : 'block'
                }}
                title="MercadoPago Checkout"
            />
            
            <div className="text-center mt-3">
                <small className="text-muted">
                    Serás redirigido automáticamente tras completar el pago
                </small>
                <br/>
                <button 
                    className="btn btn-link btn-sm mt-2" 
                    onClick={onSuccess}
                    style={{ fontSize: '12px' }}
                >
                    ¿Ya completaste el pago? Continuar
                </button>
            </div>
        </div>
    );
};

export default MercadoPagoCheckout;