import React, { useState } from 'react';
import { Modal } from "react-bootstrap";
import axios from "axios";
//import { PayPalButtons } from "@paypal/react-paypal-js";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
//import { useNavigate } from "react-router-dom";
import "../../styles/ConfirmBookingModal.css"; // Importa tu CSS personalizado
const url = import.meta.env.VITE_API_BASE_URL;
const public_key_mp = import.meta.env.VITE_MP_PUBLIC_KEY;

interface ConfirmBookingModalProps {
    show: boolean;
    onHide: () => void;
    selectedDateTime: string | null;
    id_profesional: number;
    id_usuario: number;
    precio: number;  // 🔹 Precio para Mercado Pago
    precioInternacional: number;  // 🔹 Precio para PayPal
    profesionalName: string | null;
}

const ConfirmBookingModal: React.FC<ConfirmBookingModalProps> = ({ show, onHide, selectedDateTime, id_profesional, id_usuario, precio,
}) => {
    // ✅ Inicializa Mercado Pago solo una vez
    initMercadoPago(public_key_mp, { locale: 'es-AR' });

    //const [showPayPal, setShowPayPal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [preferenceId, setPreferenceId] = useState(null);
    const [loadingWallet, setLoadingWallet] = useState(false);
    const [cupon, setCupon] = useState('');
    //const [bookingToken, setBookingToken] = useState<string | null>(null); // 🔒 Token para PayPal

    //const navigate = useNavigate();

    // Calcular precio del servicio (5% del precio base)
    const precioServicio = Math.round(precio * 0.05);
    const totalAPagar = precio + precioServicio;

    // Formatear fecha y hora
    const formatearFechaHora = () => {
        if (!selectedDateTime) return '';

        const [fecha, rango] = selectedDateTime.split(" - ");
        const [anio, mes, dia] = fecha.split("-");
        const fechaDate = new Date(Number(anio), Number(mes) - 1, Number(dia));

        const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const diaSemana = diasSemana[fechaDate.getDay()];

        const [inicio,] = rango.split(" a ");
        const horaInicio = inicio.slice(0, 5);

        return `${diaSemana} ${dia}/${mes} - ${horaInicio} PM`;
    };

    /*
    // 🔹 Crear orden de pago en PayPal
    const handleCreateOrder = async (): Promise<string> => {
        try {
            const [fecha_turno, hora_turno] = selectedDateTime?.split(" - ") ?? [];

            // ✅ Solo enviamos datos de identificación, NO precios
            const response = await axios.post(`${url}/api/turnos/paypal/create-order`, {
                id_profesional,
                id_usuario,
                fecha_turno,
                hora_turno,
                cupon, // El backend calculará el precio final
            });

            // 🔒 Guardar token de seguridad para la captura
            setBookingToken(response.data.booking_token);
            return response.data.id;
        } catch (error) {
            console.error("Error creando la orden de PayPal:", error);
            throw new Error("No se pudo crear la orden en PayPal");
        }
    };

    // 🔹 Capturar el pago en PayPal
    const handleApprove = async (data: any) => {
        try {
            if (!bookingToken) {
                throw new Error("Token de seguridad no disponible");
            }

            const response = await axios.post(`${url}/api/turnos/paypal/capture-order`, {
                orderID: data.orderID,
                booking_token: bookingToken, // 🔒 Usar token en lugar de datos manuales
            });

            if (response.data.message === "Pago exitoso y turno reservado") {
                setShowSuccessModal(true);
                onHide();
                setTimeout(() => navigate("/dashboard/calendario"), 2000);
            }
        } catch (error) {
            console.error("❌ Error al capturar el pago:", error);
        }
    };
    */


    // CREAR ORDEN DE PAGO
    const create_preference = async () => {
        try {
            const response = await axios.post(`${url}/api/mercadopago/create-order`, {
                // ✅ Solo datos de identificación
                id_profesional,
                id_usuario,
                fecha_turno: selectedDateTime?.split(" - ")[0],
                hora_turno: selectedDateTime?.split(" - ")[1],
                cupon,
                // ❌ NO enviamos: title, quantity, price
            });

            return response.data.id;
        } catch (error) {
            console.error('Error al crear la preferencia de pago:', error);
            throw error;
        }
    };


    const handleBuy = async () => {
        // 🔹 Guardar navegador de origen antes de salir
        const browser = navigator.userAgent;
        localStorage.setItem("navegador_origen", browser);

        setLoadingWallet(true); // 🔹 Mostrar mensaje de carga
        const id = await create_preference();
        if (id) {
            setPreferenceId(id);
        }
        setLoadingWallet(false); // 🔹 Ocultar loader cuando ya está listo
    };




    return (
        <>
            <Modal
                show={show}
                onHide={onHide}
                centered
                className="modal-confirmation"
                dialogClassName="custom-modal-size"
                backdrop="static"
            >
                <Modal.Body>
                    {/* Título principal */}
                    <div className="main-title">
                        Para confirmar el turno debes abonar la sesión
                    </div>

                    {/* Contenedor de información del turno */}
                    <div className="info-container"></div>

                    {/* Información del turno */}
                    <div className="turno-text">
                        Turno: {formatearFechaHora()}
                    </div>

                    {/* Detalles de precios */}
                    <div className="price-details">
                        <span className="price-session">Valor de la sesión:</span>
                        <span className="price-value"> ${precio.toLocaleString()}.-<br /></span>
                        <span className="service-cost">Costo de servicio: </span>
                        <span className="price-value">${precioServicio.toLocaleString()}.-</span>
                    </div>

                    {/* Total a pagar */}
                    <div className="total-amount">
                        Total a abonar: ${totalAPagar.toLocaleString()}.-
                    </div>

                    {/* Campo de cupón */}
                    <div className="coupon-container">
                        <input
                            type="text"
                            className="coupon-input"
                            placeholder=""
                            value={cupon}
                            onChange={(e) => setCupon(e.target.value.toUpperCase())}
                        />
                        {!cupon && <div className="coupon-label">Cupón de descuento</div>}
                    </div>

                    {/* Botón de Pagar / Wallet de Mercado Pago */}
                    {!preferenceId && !loadingWallet && (
                        <div className="btn-pagar" onClick={handleBuy}>
                            <div className="btn-pagar-text">PAGAR</div>
                        </div>
                    )}

                    {/* Loader */}
                    {loadingWallet && (
                        <div className="btn-pagar">
                            <div className="btn-pagar-text">Cargando...</div>
                        </div>
                    )}

                    {/* Wallet cuando está lista la preferencia */}
                    {preferenceId && (
                        <div className="wallet-container">
                            <Wallet initialization={{ preferenceId }} />
                        </div>
                    )}

                    {/* Botón Cancelar */}
                    <div className="btn-cancelar" onClick={onHide}>
                        <div className="btn-cancelar-text">CANCELAR</div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal de Confirmación de Pago Exitoso */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    <h4 className="fw-bold" style={{ color: "var(--verde)" }}>¡Turno Confirmado!</h4>
                    <p>Te enviamos un correo con los detalles de tu turno.</p>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center border-0">
                    <button
                        style={{
                            backgroundColor: "var(--verde)",
                            color: "white",
                            width: "80%",
                            border: "1px solid var(--verde)",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            fontWeight: "600"
                        }}
                        onClick={() => setShowSuccessModal(false)}
                    >
                        Aceptar
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmBookingModal;
