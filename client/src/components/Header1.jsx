import React from "react";
import logo from "../assets/logo.png";
import "../styles/Header.css"; // Import external CSS for styling

const Header1 = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <h1>ResumeXpert</h1>
      </div>
    </header>
  );
};

export default Header1;
