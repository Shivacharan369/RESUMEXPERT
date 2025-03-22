import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/LandingPage.css"; // External styles

// Import background & video
import bgImage from "../assets/bg.jpg";
import videoSrc from "../assets/lpv.mp4";

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFormData({ username: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const endpoint = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      } else {
        setSuccess(isLogin ? "Login Successful!" : "Registration Successful!");
        localStorage.setItem("authToken", data.token);
        setTimeout(() => navigate("/home"), 1000);
      }
    } catch (error) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="landing-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <Header disableNavigation={true} />
      <div className="hero-section">
        {/* Left - Video */}
        <div className="video-container">
          <video autoPlay loop muted className="video-player">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right - Login/Register Card */}
        <div className="auth-card">
          <h2 className="text-2xl font-bold text-purple-400">{isLogin ? "Login" : "Register"}</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <button type="submit">{isLogin ? "Login" : "Register"}</button>
          </form>
          <p className="toggle-text" onClick={handleToggle}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
