import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const url = import.meta.env.VITE_API_BASE_URL;

export const usePayment = (formData: any, clearForm: () => void) => {
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const openPaymentModal = () => setShowPaymentModal(true);
  const closePaymentModal = () => setShowPaymentModal(false);

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      await axios.post(`${url}/api/profesionales`, formData);

      toast.success("Profesional registrado con éxito 🎉");
      clearForm();
      setShowPaymentModal(false);

      setTimeout(() => {
        navigate("/successfulProfessionalRegister");
      }, 1000);

    } catch (error: any) {
      toast.error("Error al registrar profesional: " + error.response?.data?.message);
      setShowPaymentModal(false);
    } finally {
      setLoading(false);
    }
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