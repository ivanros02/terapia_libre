import React from "react";
import { Link } from "react-router-dom";
import { House, Calendar, MessageCircle, PieChart, Settings, LogOut } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/DashboardProfesional.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul className="nav flex-column w-100 text-center">
        <li className="nav-item" style={{ marginTop: "5rem" }}>
          <Link to="/dashboard" className="nav-link text-white py-3">
            <House size={24} />
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/appointments" className="nav-link text-white py-3">
            <Calendar size={24} />
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/messages" className="nav-link text-white py-3">
            <MessageCircle size={24} />
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/stats" className="nav-link text-white py-3">
            <PieChart size={24} />
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/settings" className="nav-link text-white py-3">
            <Settings size={24} />
          </Link>
        </li>
        <li className="nav-item mt-auto">
          <Link to="/logout" className="nav-link text-white py-3">
            <LogOut size={24} />
          </Link>
        </li>
      </ul>
      <div className="mt-3">
        <img src="/logo.png" alt="Logo" style={{ width: "40px" }} />
      </div>
    </div>
  );
};

export default Sidebar;