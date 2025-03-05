import React from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import NeedTherapy from "../components/NeedTherapy";
import BenefitsSection from "../components/BenefitsSection";
import Footer from "../layouts/Footer";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <NeedTherapy />
      <BenefitsSection />
      <Footer />
    </>
  );
};

export default Home;
