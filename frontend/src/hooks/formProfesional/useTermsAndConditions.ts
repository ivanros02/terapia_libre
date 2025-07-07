import { useState } from "react";

export const useTermsAndConditions = () => {
  const [termsChecked, setTermsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const openTermsModal = () => setShowTermsModal(true);
  const closeTermsModal = () => setShowTermsModal(false);

  const acceptTerms = () => {
    setTermsAccepted(true);
    setTermsChecked(true);
    setShowTermsModal(false);
  };

  return {
    termsChecked,
    setTermsChecked,
    showTermsModal,
    termsAccepted,
    openTermsModal,
    closeTermsModal,
    acceptTerms,
  };
};