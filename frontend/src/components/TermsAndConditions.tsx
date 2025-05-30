import React from "react";
import {Link} from "react-router-dom";
const TermsAndConditions: React.FC = () => {
    return (
        <>
            

            <p>
                Esta web utiliza cookies propias y de terceros para analizar y mejorar su experiencia de navegación.
                Al continuar navegando, siendo mayor de edad entendemos que acepta su uso junto a los
                <Link to="/terminos-y-condiciones" className="text-dark fw-semibold mx-2">Términos y condiciones</Link> |
                <Link to="/privacidad" className="text-dark fw-semibold mx-2">Políticas de privacidad</Link>
            </p>

        </>
    );
};

export default TermsAndConditions;
