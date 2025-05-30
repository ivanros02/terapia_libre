import React, { useRef } from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import NeedTherapy from "../components/NeedTherapy";
import BenefitsSection from "../components/BenefitsSection";
import Footer from "../layouts/Footer";
import Head from "../layouts/Header";
import LegalPopup from "../layouts/LegalPopup";
const Home: React.FC = () => {
  const needTherapyRef = useRef<HTMLDivElement>(null);

  const handleScrollToNeedTherapy = () => {
    if (needTherapyRef.current) {
      needTherapyRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const menuLinks = [
    { name: "¿Necesito terapia?", href: "#necesito-terapia" },
    { name: "Buscar profesional", href: "/professionals" },
  ];

  return (
    <>
      <Head links={menuLinks} onScrollToNeedTherapy={handleScrollToNeedTherapy} />
      <HeroSection />
      <AboutSection />
      <div ref={needTherapyRef}>
        <NeedTherapy />
      </div>
      <BenefitsSection />
      <Footer />
      <LegalPopup/>
    </>
  );
};

export default Home;
