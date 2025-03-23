import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFilePdf, FaFileWord, FaTrash, FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bgImage from "../assets/bg.jpg";
import interviewImg from "../assets/int.jpeg"; // Interview Image

const MockInterview = () => {
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [questions, setQuestions] = useState([]);

  // Dropzone Configuration
  const { getRootProps, getInputProps } = useDropzone({
    accept: ".pdf, .doc, .docx",
    onDrop: (acceptedFiles) => {
      setResumeFile(acceptedFiles[0]);
      setMessage({ type: "", text: "" });
      setQuestions([]);
    },
  });

  const removeResumeFile = () => {
    setResumeFile(null);
    setMessage({ type: "", text: "" });
    setQuestions([]);
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      setMessage({ type: "error", text: "⚠️ Please upload your resume for the mock interview." });
      return;
    }

    setIsUploading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const response = await fetch("http://localhost:5001/mock-interview", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions);
        setMessage({ type: "success", text: "✅ Resume uploaded successfully! Starting the interview session..." });

        setTimeout(() => {
          navigate("/mock-interview-session", { state: { questions: data.questions } });
        }, 2000); // Redirect after 2 seconds
      } else {
        setMessage({ type: "error", text: data.error || "❌ Upload failed. Please try again." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "❌ Error uploading file. Check your connection." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center text-white pt-20 font-caramond relative"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 max-w-6xl px-6">
          {/* Left - Interview Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img src={interviewImg} alt="AI Mock Interview"
              className="w-[50vw] max-w-[600px] rounded-lg shadow-lg hover:scale-105 transition-transform" />
          </div>

          {/* Right - Title & Description */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-5xl font-bold text-purple-400">AI MOCK INTERVIEW</h1>
            <p className="mt-4 text-xl text-gray-300 leading-relaxed">
              Ace your interviews with our AI-driven mock interview system. Get personalized feedback, improve your responses, and gain confidence. 
              Our AI simulates real interview questions based on your resume.
            </p>
          </div>
        </div>
      </div>

      {/* Resume Upload Section */}
      <div className="flex flex-col items-center justify-center text-white pt-10 pb-20 bg-black">
        <h2 className="text-4xl font-bold text-purple-400">Upload Your Resume</h2>
        <p className="mt-2 text-lg text-gray-300">Our AI will generate interview questions based on your resume.</p>

        {/* Resume Upload Box */}
        <div {...getRootProps()} className="mt-6 w-full max-w-2xl border-2 border-dashed border-gray-500 bg-gray-800/80 p-10 rounded-2xl text-center cursor-pointer hover:bg-gray-700 transition-all">
          <input {...getInputProps()} />
          {!resumeFile ? (
            <>
              <p className="text-gray-300 text-2xl font-medium">Drop your resume or choose file</p>
              <p className="text-lg text-gray-500 mt-2">PDFs and DOCs only</p>
            </>
          ) : (
            <div className="flex items-center justify-center gap-4">
              {resumeFile.name.endsWith(".pdf") ? <FaFilePdf className="text-red-500 text-5xl" /> : <FaFileWord className="text-blue-500 text-5xl" />}
              <p className="text-gray-300 text-xl">{resumeFile.name}</p>
              <button onClick={removeResumeFile} className="text-red-400 hover:text-red-600">
                <FaTrash className="text-3xl" />
              </button>
            </div>
          )}
        </div>

        {/* Error & Success Messages */}
        {message.text && <p className={`mt-4 text-lg ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>{message.text}</p>}

        {/* Upload Button */}
        <button className="mt-6 px-6 py-3 bg-purple-600 text-white font-bold text-xl rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          onClick={handleUpload} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Start Mock Interview"}
        </button>
      </div>

      <Footer />
    </>
  );
};

export default MockInterview;
