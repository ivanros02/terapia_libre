import "../styles/VolverLink.css";

const VolverLink = ({ href = "#", children = "Volver" }) => {
  return (
    <div className="text-start"> {/* Bootstrap: alinea a la izquierda */}
      <a href={href} className="volver-link">
        {children}
      </a>
    </div>
  );
};

export default VolverLink;
