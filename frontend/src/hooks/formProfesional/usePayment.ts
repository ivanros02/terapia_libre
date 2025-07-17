import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const url = import.meta.env.VITE_API_BASE_URL;

export const usePayment = (formData: any, clearForm: () => void) => {
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const openPaymentModal = async () => {
    try {
      setLoading(true);

      // Registrar profesional ANTES de abrir modal (sin toast)
      await axios.post(`${url}/api/profesionales`, formData);

      // Abrir modal de pago después del registro
      setShowPaymentModal(true);

    } catch (error: any) {
      toast.error("Error al crear cuenta: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success("¡Profesional registrado con éxito! 🎉"); // Toast aquí
    setShowPaymentModal(false);
    clearForm();

    setTimeout(() => {
      navigate("/successfulProfessionalRegister");
    }, 1000);
  };

  const closePaymentModal = () => {
    toast.success("¡Profesional registrado con éxito! 🎉"); // Toast aquí también
    setShowPaymentModal(false);
  };



  const handlePaymentError = () => {
    toast.error("Error al procesar el pago. Intentá nuevamente.");
  };

  return {
    loading,
    showPaymentModal,
    openPaymentModal,
    closePaymentModal,
    handlePaymentSuccess,
    handlePaymentError,
  };
};