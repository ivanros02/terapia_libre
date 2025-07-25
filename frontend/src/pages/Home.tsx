import React, { useRef } from "react";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import NeedTherapy from "../components/home/NeedTherapy";
import BenefitsSection from "../components/home/BenefitsSection";
import Footer from "../layouts/Footer";
import Head from "../layouts/Header";
import LegalPopup from "../layouts/LegalPopup";
import ClinicaCard from "../components/home/ClinicaCard";
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
      <ClinicaCard />
      <Footer />
      <LegalPopup/>
    </>
  );
};

export default Home;
