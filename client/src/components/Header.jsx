import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import "../styles/Header.css"; // Import external CSS

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (from local storage or backend response)
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleNavigation = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Please log in first!");
      navigate("/");
    } else {
      navigate(path);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
        <h1>ResumeXpert</h1>
      </div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/resume" onClick={(e) => handleNavigation(e, "/resume")}>
          Resume
        </Link>
        <Link to="/coverletter" onClick={(e) => handleNavigation(e, "/coverletter")}>
          CoverLetter
        </Link>
        <Link to="/mock" onClick={(e) => handleNavigation(e, "/mock")}>
          MockInterview
        </Link>
        <Link to="/profile" onClick={(e) => handleNavigation(e, "/profile")}>
          Profile
        </Link>
      </nav>
    </header>
  );
};

export default Header;
