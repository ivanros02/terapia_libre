import React from "react";

const TermsAndConditions: React.FC = () => {
    return (
        <>
            <p>
                Esta web utiliza cookies propias y de terceros para analizar y mejorar su experiencia de navegación. 
                Al continuar navegando, siendo mayor de edad entendemos que acepta su uso junto a los  
                <a href="/terminos-y-condiciones" className="text-dark fw-semibold mx-2">Términos y condiciones</a> |
                <a href="/privacidad" className="text-dark fw-semibold mx-2">Políticas de privacidad</a>
            </p>
        </>
    );
};

export default TermsAndConditions;
