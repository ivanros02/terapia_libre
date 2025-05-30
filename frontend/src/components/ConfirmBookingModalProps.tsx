import React, { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useNavigate } from "react-router-dom";
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

const ConfirmBookingModal: React.FC<ConfirmBookingModalProps> = ({ show, onHide, selectedDateTime, id_profesional, id_usuario, precio, precioInternacional, profesionalName }) => {
    // ✅ Inicializa Mercado Pago solo una vez
    initMercadoPago(public_key_mp, { locale: 'es-AR' });

    const [, setOrderID] = useState<string | null>(null);
    const [showPayPal, setShowPayPal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [preferenceId, setPreferenceId] = useState(null);
    const [loadingWallet, setLoadingWallet] = useState(false);
    const [cupon, setCupon] = useState('');

    const navigate = useNavigate();

    // 🔹 Crear orden de pago en PayPal
    const handleCreateOrder = async (): Promise<string> => {
        try {
            const [fecha_turno, hora_turno] = selectedDateTime?.split(" - ") ?? [];
            const precioNumerico = Number(precioInternacional); // ✅ Usar precio en USD
            if (isNaN(precioNumerico)) throw new Error("El precio no es un número válido.");

            const response = await axios.post(`${url}/api/turnos/paypal/create-order`, {
                id_profesional,
                id_usuario,
                fecha_turno,
                hora_turno,
                precio: precioNumerico.toFixed(2),
                cupon,
            });

            setOrderID(response.data.id);
            return response.data.id;
        } catch (error) {
            console.error("Error creando la orden de PayPal:", error);
            throw new Error("No se pudo crear la orden en PayPal");
        }
    };

    // 🔹 Capturar el pago en PayPal
    const handleApprove = async (data: any) => {
        try {
            let [fecha_turno, hora_turno] = selectedDateTime?.split(" - ") ?? [];
            if (!fecha_turno || !hora_turno) return;

            const fechaFormatted = new Date(fecha_turno).toISOString().split("T")[0];
            const response = await axios.post(`${url}/api/turnos/paypal/capture-order`, {
                orderID: data.orderID,
                id_profesional,
                id_usuario,
                fecha_turno: fechaFormatted,
                hora_turno,
                precio,
                cupon,
            });

            if (response.data.message === "Pago exitoso y turno reservado") {
                setShowSuccessModal(true);
                onHide();

                // Redirigir después de un pequeño retraso
                setTimeout(() => {
                    navigate("/dashboard/calendario");
                }, 2000); // Redirige después de 2 segundos para mostrar el modal
            }
        } catch (error) {
            console.error("❌ Error al capturar el pago:", error);
        }
    };


    // CREAR ORDEN DE PAGO
    const create_preference = async () => {
        try {
            const response = await axios.post(`${url}/api/mercadopago/create-order`, {
                title: profesionalName,
                quantity: 1,
                price: precio,
                id_profesional,
                id_usuario,
                fecha_turno: selectedDateTime?.split(" - ")[0],
                hora_turno: selectedDateTime?.split(" - ")[1],
                cupon,
            });

            const { id } = response.data;
            return id;
        } catch (error) {
            console.error('Error al crear la preferencia de pago:', error);
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
            <Modal show={show} onHide={onHide} centered>
                <Modal.Body style={{ backgroundColor: "var(--verde)", color: "white" }} className="text-center rounded-top p-4">
                    {selectedDateTime && (
                        <p className="fs-5 fw-bold">
                            Turno: {
                                (() => {
                                    const [fecha, rango] = selectedDateTime.split(" - ");
                                    const [anio, mes, dia] = fecha.split("-");
                                    const fechaDate = new Date(Number(anio), Number(mes) - 1, Number(dia));

                                    const fechaFormateada = fechaDate.toLocaleDateString("es-AR", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    });

                                    const [inicio, fin] = rango.split(" a ");
                                    const horaInicio = inicio.slice(0, 5);
                                    const horaFin = fin.slice(0, 5);

                                    return `${fechaFormateada} de ${horaInicio} a ${horaFin}`;
                                })()
                            }
                        </p>
                    )}

                    <div className="p-4 bg-white shadow rounded-4">
                        <p className="text-center" style={{ color: "var(--verde)" }}>
                            Para confirmar debe abonar la sesión.
                        </p>

                        {/* 🔹 Campo de cupón */}
                        <div className="mt-3">
                            <label className="form-label text-dark fw-bold">¿Tenés un cupón?</label>
                            <input
                                type="text"
                                className="form-control text-center"
                                placeholder="Ej: PRIMERASESION"
                                value={cupon}
                                onChange={(e) => setCupon(e.target.value.toUpperCase())}
                            />
                        </div>
                    </div>

                </Modal.Body>

                <Modal.Footer style={{ backgroundColor: "var(--verde)" }} className="d-flex flex-column align-items-center border-0">
                    {!showPayPal ? (
                        <>
                            {/* 🔹 Botón de Mercado Pago Checkout Pro */}
                            {!preferenceId && !loadingWallet && (
                                <Button
                                    style={{ backgroundColor: "white", color: "var(--verde)", border: "2px solid white", width: "80%" }}
                                    className="fw-bold px-4 py-2 d-flex flex-column align-items-center justify-content-center"
                                    onClick={handleBuy}
                                >
                                    {/* 🔹 Contenedor centrado del Wallet */}
                                    {preferenceId && (
                                        <div className="wallet-container" style={{ display: "flex", justifyContent: "center" }}>
                                            <Wallet initialization={{ preferenceId: preferenceId }} />
                                        </div>
                                    )}

                                    {/* 🔹 Texto centrado correctamente */}
                                    <span className="text-center w-100 mt-2">Pagar con Mercado Pago</span>
                                </Button>
                            )}

                            {/* 🔹 Loader */}
                            {loadingWallet && (
                                <div className="text-white py-2">
                                    Cargando botón de pago...
                                </div>
                            )}

                            {/* 🔹 Wallet cuando está lista la preferencia */}
                            {preferenceId && (
                                <div className="wallet-container mb-2" style={{ display: "flex", justifyContent: "center", width: "80%" }}>
                                    <Wallet initialization={{ preferenceId }} />
                                </div>
                            )}


                            {/* 🔹 Botón de PayPal */}
                            <Button
                                style={{ backgroundColor: "white", color: "var(--verde)", border: "2px solid white", width: "80%" }}
                                className="fw-bold px-4 py-2"
                                onClick={() => setShowPayPal(true)}
                            >
                                Pagar con PayPal
                            </Button>
                        </>
                    ) : (
                        <div className="w-100 d-flex justify-content-center">
                            <PayPalButtons createOrder={handleCreateOrder} onApprove={handleApprove} />
                        </div>
                    )}
                    <Button
                        style={{ backgroundColor: "white", color: "var(--verde)", border: "2px solid white", width: "80%" }}
                        className="fw-bold px-4 py-2 mt-3"
                        onClick={onHide}
                    >
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* ✅ Modal de Confirmación de Pago Exitoso */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Body className="text-center p-4">
                    <h4 className="fw-bold" style={{ color: "var(--verde)" }}>¡Turno Confirmado!</h4>
                    <p>Te enviamos un correo con los detalles de tu turno.</p>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center border-0">
                    <Button
                        style={{ backgroundColor: "var(--verde)", color: "white", width: "80%", borderColor: "var(--verde)" }}
                        className="fw-bold px-4 py-2"
                        onClick={() => setShowSuccessModal(false)}
                    >
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmBookingModal;
