// hooks/usePasswordChange.ts
import { useState } from "react";
import { toast } from "react-toastify";

export const usePasswordChange = () => {
  const [passwordActual, setPasswordActual] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mostrarPasswordForm, setMostrarPasswordForm] = useState(false);

  const togglePasswordForm = () => setMostrarPasswordForm(!mostrarPasswordForm);

  const validatePasswords = (): boolean => {
    if (nuevaPassword || confirmarPassword || passwordActual) {
      if (!passwordActual || !nuevaPassword || !confirmarPassword) {
        toast.error("❌ Completá todos los campos para cambiar la contraseña");
        return false;
      }
      if (nuevaPassword !== confirmarPassword) {
        toast.error("❌ Las contraseñas nuevas no coinciden");
        return false;
      }
    }
    return true;
  };

  const getPasswordData = () => ({
    password_actual: passwordActual || undefined,
    nueva_password: nuevaPassword || undefined,
  });

  const resetPasswords = () => {
    setPasswordActual("");
    setNuevaPassword("");
    setConfirmarPassword("");
    setMostrarPasswordForm(false);
  };

  return {
    passwordActual,
    nuevaPassword,
    confirmarPassword,
    mostrarPasswordForm,
    setPasswordActual,
    setNuevaPassword,
    setConfirmarPassword,
    togglePasswordForm,
    validatePasswords,
    getPasswordData,
    resetPasswords,
  };
};