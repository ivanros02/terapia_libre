import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

type HeadProps = {
  description?: string;
  keywords?: string;
  links?: { name: string; href: string }[];
  onScrollToNeedTherapy?: () => void; // Agregamos la prop opcional
};

const Head: React.FC<HeadProps> = ({ description, keywords, links = [], onScrollToNeedTherapy }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Terapia Libre</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom p-3 fixed-top shadow mb-5">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center ms-4" href="/">
            <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
            <span style={{ fontSize: '1.5rem', color: "var(--verde)" }}>Terapia Libre</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {links.map((link, index) => (
                <li key={index} className="nav-item me-3">
                  {link.name === "¿Necesito terapia?" ? (
                    <a
                      className="nav-link text-secondary fs-5"
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault(); // Evita la navegación
                        onScrollToNeedTherapy?.(); // Llama a la función de scroll
                      }}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <a className="nav-link text-secondary fs-5" href={link.href}>
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </HelmetProvider>
  );
};

export default Head;
