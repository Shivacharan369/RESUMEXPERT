import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Navigation Hook
import bgImage from "../assets/bg.jpg";
import heroImage from "../assets/hero-image.jpg";
import atsImage from "../assets/ats.png";
import aImage from "../assets/a.png"; // Image for "Check Your Resume" section
import bImage from "../assets/b.png"; // Image for "Resume Tailoring" section
import Footer from "../components/Footer"; 
import header from "../components/Header";



const Home = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [isVisible, setIsVisible] = useState(false);
  const [isTailoringVisible, setIsTailoringVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const resumeCheck = document.getElementById("resume-check");
      const resumeTailoring = document.getElementById("resume-tailoring");

      if (resumeCheck) {
        const top = resumeCheck.getBoundingClientRect().top;
        setIsVisible(top < window.innerHeight - 100);
      }

      if (resumeTailoring) {
        const top = resumeTailoring.getBoundingClientRect().top;
        setIsTailoringVisible(top < window.innerHeight - 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen text-white pt-20 font-caramond"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Hero Section */}
      <div className="flex items-center justify-center px-12 py-20">
        {/* Left: Large Image */}
        <motion.div className="w-1/2" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <img src={heroImage} alt="Hero" className="rounded-lg shadow-lg" />
        </motion.div>

        {/* Right: Text Content */}
        <motion.div
          className="w-1/2 pl-10 bg-black bg-opacity-70 p-5 rounded-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl font-bold text-primary">Craft Your Success</h2>
          <p className="mt-4 text-lg">
            Build professional resumes, cover letters, and portfolios with ease. 
            Transform your career with expert guidance.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-purple-600 text-white text-lg font-bold rounded-lg hover:bg-purple-700 transition"
            onClick={() => navigate("/resume")}
          >
            Get Started
          </button>
        </motion.div>
      </div>

      {/* ATS Optimization Section */}
      <div className="flex items-center justify-between px-12 py-20">
        {/* Left: Text */}
        <motion.div
          className="w-1/2 bg-black bg-opacity-100 p-8 rounded-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold text-primary">
            Resume Optimization for Applicant Tracking Systems (ATS)
          </h2>
          <p className="mt-4 text-lg">
            Ensure your resume is ATS-friendly to increase your chances of getting hired.
          </p>
          <button
            className="mt-6 px-6 py-3 bg-purple-600 text-white text-lg font-bold rounded-lg hover:bg-purple-700 transition"
            onClick={() => navigate("/resume")}
          >
            Build Resume
          </button>
        </motion.div>

        {/* Right: Image with Hover Effect */}
        <motion.div className="w-1/2 flex justify-end">
          <motion.img
            src={atsImage}
            alt="ATS Optimization"
            className="rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      {/* Check Your Resume Section */}
      <div id="resume-check" className="flex items-center justify-between px-12 py-20">
        {/* Left: Text Section with Animation */}
        <motion.div
          className={`w-1/2 bg-black bg-opacity-100 p-8 rounded-lg transition-opacity duration-1000 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          <h2 className="text-4xl font-bold text-primary">
            Check your resume for grammatical and punctuation errors
          </h2>
          <p className="mt-4 text-lg">
            A built-in content checker tool helps you avoid grammar mistakes and clichés:
          </p>
          <ul className="mt-4 space-y-2 text-lg">
            <li>✅ Wording and readability analysis</li>
            <li>✅ Eliminate typos and grammatical errors</li>
            <li>✅ Content suggestions based on your job and experience</li>
          </ul>
        </motion.div>

        {/* Right: Image with Hover Effect */}
        <motion.div className="w-1/2 flex justify-end">
          <motion.img
            src={aImage}
            alt="Grammar Checker"
            className="rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>

      {/* Resume Tailoring Section */}
      <div id="resume-tailoring" className="flex items-center justify-between px-12 py-20">
        {/* Left: Text Section with Background */}
        <motion.div
          className={`w-1/2 bg-black bg-opacity-100 p-8 rounded-lg transition-opacity duration-1000 ${
            isTailoringVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
        >
          <h2 className="text-5xl font-bold text-primary">
            Resume tailoring based on the job you’re applying for
          </h2>
          <p className="mt-4 text-2xl">
            Quickly ensure that your resume covers key skills and experiences by pasting the job ad you’re applying for.
          </p>
          <ul className="mt-4 space-y-2 text-2xl">
            <li>✅ Skills and experience section analysis</li>
            <li>✅ Actionable checklist of what else to add to your resume</li>
            <li>✅ Instant comparison between your resume and the job posting</li>
          </ul>
        </motion.div>

        {/* Right: Image with Hover Effect */}
        <motion.div className="w-1/2 flex justify-end">
          <motion.img
            src={bImage}
            alt="Resume Tailoring"
            className="rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
